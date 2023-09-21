import { BrowserWindow, nativeTheme, BrowserView, ipcMain, ipcRenderer, Menu, autoUpdater, dialog, session, shell } from "electron";
const configTemplate = require("../../common/config-template");

import path from "path";
import * as utils from "./utils.js";
const URL = require("url-parse");
let config = utils.getConfig() || configTemplate;
import { bindMsgCenter } from "./msg-center";

let BrowserWindowConfig = {
    minimizable: true,
};
if (config.browser_window && utils.isObject(config.browser_window)) {
    if (Reflect.has(config.browser_window, "minimizable") && config.browser_window.minimizable == false) {
        BrowserWindowConfig.minimizable = false;
    }
}
/**
 *
 * @param {*} app
 *
 * proxies related config will be applied on all web access
 */
function prepareApp(app) {
    try {
        if (config.proxy_server !== false) {
            app.commandLine.appendSwitch("proxy-server", config.proxy_server);
        }
        if (config.proxy_pac_url !== false) {
            app.commandLine.appendSwitch("proxy-pac-url", config.proxy_pac_url);
        }
        if (config.proxy_bypass_list !== false) {
            app.commandLine.appendSwitch("proxy-bypass-list", config.proxy_bypass_list);
        }
    } catch (e) {
        console.error(e);
    }
}

function checkWhiteListUrl(url, white_list_patterns = []) {
    if (!white_list_patterns || !utils.isArray(white_list_patterns) || white_list_patterns.length == 0) {
        return true;
    }
    let parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname;
    for (let pattern of white_list_patterns) {
        pattern.lastIndex = 0;
        let testRes = pattern.test(hostname);
        if (testRes) {
            console.log(pattern, hostname);
            return true;
        }
    }
    return false;
}

function checkBlackListUrl(url, black_list_patterns = []) {
    if (!black_list_patterns || !utils.isArray(black_list_patterns) || black_list_patterns.length == 0) {
        return true;
    }
    let parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname;
    for (let pattern of black_list_patterns) {
        pattern.lastIndex = 0;
        if (pattern.test(hostname)) {
            return false;
        }
    }
    return true;
}

function checkUrl(url, options = {}) {
    let site_configuration = options["site_configuration"] || {};
    let white_list_patterns = site_configuration["white_list_patterns"] || [];
    let black_list_patterns = site_configuration["black_list_patterns"] || [];
    let white_list_result = checkWhiteListUrl(url, white_list_patterns),
        black_list_result = checkBlackListUrl(url, black_list_patterns);
    console.log(url, white_list_result, black_list_result);
    return white_list_result && black_list_result;
}

function showWarningDialog(options = {}) {
    let currentWindow = BrowserWindow.getFocusedWindow();
    dialog.showMessageBoxSync(currentWindow, {
        title: options["title"] || config.warning_dialog.title,
        message: options["message"] || config.warning_dialog.message,
        icon: path.resolve(__dirname, "../../public/favicon.png"),
    });
}

/**
 *  To attach the associated events on windows that are not create by `createWindow` method
 *  The interval is 100ms -> if the user's operation is faster than 100ms, the attachment may not success.
 */
let parent_config_dict = {};
let current_parent_id = 0;

function bindWindowEvents(currentWindow, windows, options = {}) {
    let curr_window_id = currentWindow.id;
    console.log("current window id:", curr_window_id);
    if (!options || (!options.site_configuration && options.name !== "mainWindow")) {
        // console.log(currentWindow);
        // console.log(current_parent_id, parent_config_dict);
        options = parent_config_dict[current_parent_id] || {};
    }
    if (options && options.site_configuration) {
        parent_config_dict[curr_window_id] = options;
    }
    windows[curr_window_id] = currentWindow;
    currentWindow.webContents.on("did-fail-load", function () {
        console.log("load url failed: " + targetUrl);
        windows[curr_window_id] = null;
        showWarningDialog();
        currentWindow.close();
    });
    currentWindow.webContents.on("did-finish-load", function () {
        windows[curr_window_id] = currentWindow;
        // console.log(windows);
        bindMsgCenter(ipcMain, windows);
    });
    currentWindow.webContents.on("will-navigate", function (event, url) {
        console.log(url);
        if (!checkUrl(url, options)) {
            console.log(url, "navigate is blocked");
            showWarningDialog();
            event.preventDefault();
            if (config.warning_dialog.close_triggered_window) {
                currentWindow.close();
            }
        }
    });
    currentWindow.webContents.setWindowOpenHandler((detail) => {
        let url = detail.url;
        current_parent_id = curr_window_id;
        console.log("current_parent_id", current_parent_id);
        /**
         *  Not to use the `createWindow` method because some page are opened via HTTP methods other than get.
         *  The vanilla implementation can handle this. However, the events' handlers should be bound to the window object later.
         */
        if (checkUrl(url, options)) {
            console.log(url, "allowed to access");
            return {
                action: "allow",
                site_configuration: options["site_configuration"] || {},
                overrideBrowserWindowOptions: {
                    title: "browser window",
                    minimizable: BrowserWindowConfig.minimizable,
                    icon: path.resolve(__dirname, "../../public/favicon.png"), // tray icon
                    webPreferences: {
                        userAgent: utils.getUserAgent(),
                        contextIsolation: true,
                        // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
                        preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
                        plugins: true,
                        outlivesOpener: true,
                    },
                },
                outlivesOpener: true,
            };
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
        // currentWindow.webContents.openDevTools();
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
            preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
            plugins: true,
        },
    });
    // mainWindow.loadURL(process.env.APP_URL);
    windows[currentWindow.id] = currentWindow;
    if (options && options.name) {
        windows[options.name] = currentWindow;
    }
    currentWindow.loadURL(targetUrl, options);
    currentWindow.maximize();
    bindWindowEvents(currentWindow, windows, options);
}

export { prepareApp, createWindow, bindWindowEvents, config };
