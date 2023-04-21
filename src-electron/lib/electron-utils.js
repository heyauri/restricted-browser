import {
    BrowserWindow,
    nativeTheme,
    BrowserView,
    ipcMain,
    ipcRenderer,
    Menu,
    autoUpdater,
    dialog,
    session,
    shell,
} from "electron";
const configTemplate = require("../../common/config-template");

import path from "path";
import * as utils from "./utils.js";
const URL = require("url-parse");
let config = utils.getConfig() || configTemplate;
import { bindMsgCenter } from "./msg-center";

let BrowserWindowConfig = {
    minimizable: true
};
if (config.browser_window && utils.isObject(config.browser_window)) {
    if (Reflect.has(config.browser_window, "minimizable") && config.browser_window.minimizable == false) {
        BrowserWindowConfig.minimizable = false;
    }
}

function prepareApp(app) {
    try {
        if (config.proxy_server !== false) {
            app.commandLine.appendSwitch('proxy-server', config.proxy_server)
        }
        if (config.proxy_pac_url !== false) {
            app.commandLine.appendSwitch('proxy-pac-url', config.proxy_pac_url)
        }
        if (config.proxy_bypass_list !== false) {
            app.commandLine.appendSwitch('proxy-bypass-list', config.proxy_bypass_list)
        }
    } catch (e) {
        console.error(e);
    }
}

function checkWhiteListUrl(url) {
    if (!config.white_list_patterns || !utils.isArray(config.white_list_patterns) || config.white_list_patterns.length == 0) {
        return true;
    }
    let parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname;
    for (let pattern of config.white_list_patterns) {
        pattern.lastIndex = 0;
        let testRes = pattern.test(hostname);
        if (testRes) {
            console.log(pattern, hostname)
            return true;
        }
    }
    return false;
}

function checkBlackListUrl(url) {
    if (!config.checkBlackListUrl || !utils.isArray(config.checkBlackListUrl) || config.checkBlackListUrl.length == 0) {
        return true;
    }
    let parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname;
    for (let pattern of config.checkBlackListUrl) {
        pattern.lastIndex = 0;
        if (pattern.test(hostname)) {
            return false;
        }
    }
    return true;
}

function checkUrl(url) {
    let white_list_result = checkWhiteListUrl(url), black_list_result = checkBlackListUrl(url);
    console.log(url, white_list_result, black_list_result)
    return white_list_result && black_list_result;
}

function showWarningDialog(options = {}) {
    let currentWindow = BrowserWindow.getFocusedWindow();
    dialog.showMessageBoxSync(currentWindow, {
        title: options["title"] || config.warning_dialog.title,
        message: options["message"] || config.warning_dialog.message,
        icon: path.resolve(__dirname, "../../public/favicon.png")
    })
}

function bindWindowEvents(currentWindow, windows) {
    let curr_window_id = currentWindow.id;
    currentWindow.webContents.on("did-fail-load", function () {
        console.log("load url failed: " + targetUrl);
        showWarningDialog();
        currentWindow.close();
    })
    currentWindow.webContents.on("did-finish-load", function () {
        windows[curr_window_id] = currentWindow;
        // console.log(windows);
        bindMsgCenter(ipcMain, windows);
    });
    currentWindow.webContents.on("will-navigate", function (event, url) {
        console.log(url);
        if (!checkUrl(url)) {
            console.log(url, "navigate is blocked");
            showWarningDialog();
            event.preventDefault();
        }
    })
    currentWindow.webContents.setWindowOpenHandler((detail) => {
        let url = detail.url;
        /**
         *  Not to use the `createWindow` method because some page are opened via HTTP methods other than get.
         *  The vanilla implementation can handle this. However, the events' handlers should be binded to the window object later.
         */
        if (checkUrl(url)) {
            console.log(url, "allowed to access");
            return {
                action: "allow",
                overrideBrowserWindowOptions: {
                    title: "browser window",
                    minimizable: BrowserWindowConfig.minimizable,
                    webPreferences: {
                        userAgent: utils.getUserAgent(),
                        contextIsolation: true,
                        // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
                        preload: path.resolve(
                            __dirname,
                            process.env.QUASAR_ELECTRON_PRELOAD
                        ),
                        plugins: true
                    },
                }
            }
        }
        console.log(url, "denied to access");
        return { action: "deny" };
    });


    if (process.env.DEBUGGING) {
        // if on DEV or Production with debug enabled
        currentWindow.webContents.openDevTools();
    } else {
        // we're on production; no access to devtools pls
        // mainWindow.webContents.on('devtools-opened', () => {
        //     mainWindow.webContents.closeDevTools()
        // })
    }

    currentWindow.on("closed", () => {
        Reflect.deleteProperty(windows, curr_window_id);
        currentWindow = null;
    });
}

function createWindow(targetUrl, options = {}, windows) {
    /**
     * Initial window options
     */
    let currentWindow = new BrowserWindow({
        title: "browser window",
        icon: path.resolve(__dirname, "../../public/favicon.png"), // tray icon
        width: 1200,
        height: 700,
        minimizable: BrowserWindowConfig.minimizable,
        useContentSize: true,
        webPreferences: {
            userAgent: utils.getUserAgent(),
            contextIsolation: true,
            // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
            preload: path.resolve(
                __dirname,
                process.env.QUASAR_ELECTRON_PRELOAD
            ),
            plugins: true
        },
    });
    // mainWindow.loadURL(process.env.APP_URL);
    currentWindow.loadURL(targetUrl, options);
    currentWindow.maximize();
    bindWindowEvents(currentWindow, windows);
}

export {
    prepareApp,
    createWindow,
    bindWindowEvents,
    config
}
