import { app, BrowserWindow, nativeTheme, BrowserView, ipcMain, ipcRenderer, Menu, autoUpdater, dialog } from "electron";
import * as log from "./log.js";
import * as utils from "./utils.js";
import path from "path";
import fs from "fs";
import os from "os";
import * as injectScripts from "../scripts";

const moment = require("moment");
let send2win = utils.send2win;

import { createWindow, config } from "./electron-utils";

/**
 *  ipc 进程间消息中转中心
 */
let id_debounce_mark = {};
async function bindMsgCenter(ipcMain, windows) {
    let mainWindow = windows.mainWindow;
    let path_dict = {};
    if (config && config["accessible_sites"] && utils.isArray(config["accessible_sites"])) {
        for (let item of config["accessible_sites"]) {
            path_dict[item.uuid] = item;
            path_dict[item.path] = item;
        }
    }
    ipcMain.removeListener("toMain", () => {});
    ipcMain.on("toMain", async (event, args) => {
        try {
            let source = args["source"];
            if (mainWindow === null) {
                // app.quit();
                return;
            }
            switch (source) {
                case "main":
                    send2win(mainWindow, { msg: "mainReceive" });
                    log.operation.info("main", args);
                    switch (args["msg"]) {
                        case "getBasicData":
                            send2win(mainWindow, {
                                msg: "basicDataInit",
                                data: {
                                    logSrc: utils.getLogPath(),
                                    dataSrc: utils.getLogPath(),
                                    basicData: config,
                                },
                            });
                            break;
                        case "accessUrl":
                            if (id_debounce_mark[args["target_id"]] !== args["target_id"] && id_debounce_mark[args["target_path"]] !== args["target_path"]) {
                                let target_item = path_dict[args["target_id"]] || path_dict[args["target_path"]];
                                createWindow(target_item["path"], { site_configuration: target_item }, windows);
                                id_debounce_mark[args["target_id"]] = args["target_id"];
                                setTimeout(() => {
                                    id_debounce_mark[args["target_id"]] = "";
                                }, 1000);
                            }
                            break;
                    }
                    break;
            }
        } catch (e) {
            console.error("msg center error", e, args);
        }
    });
}

export { bindMsgCenter };
