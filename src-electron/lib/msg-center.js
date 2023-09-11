import {
    app,
    BrowserWindow,
    nativeTheme,
    BrowserView,
    ipcMain,
    ipcRenderer,
    Menu,
    autoUpdater,
    dialog,
} from "electron";
import * as log from "./log.js";
import * as utils from "./utils.js";
import path from "path";
import fs from "fs";
import os from "os";
import * as injectScripts from "../scripts";

const moment = require("moment");
let send2win = utils.send2win;

/**
 *  ipc 进程间消息中转中心
 */
async function bindMsgCenter(ipcMain, windows) {
    let mainWindow = windows.mainWindow;
    ipcMain.removeListener("toMain", () => { });
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
                                    basicData: utils.getConfig()
                                },
                            });
                            break;
                    }
                    break;
            }
        } catch (e) {
            console.error("msg center error", e, args)
        }
    });
}

export { bindMsgCenter };
