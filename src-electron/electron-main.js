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
    session,
    shell,
} from "electron";
import path from "path";
import os from "os";
import * as electronUtils from "./lib/electron-utils.js";
let config = electronUtils.config;

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
    if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
        require("fs").unlinkSync(
            path.join(app.getPath("userData"), "DevTools Extensions")
        );
    }
} catch (_) {}

let windows = {};

electronUtils.prepareApp(app);

Menu.setApplicationMenu(null);

function init() {
    let defaultUrl = config.default_url;
    let mainWindowUrl = process.env.APP_URL;
    // mainWindow.loadURL(process.env.APP_URL);
    // electronUtils.createWindow(defaultUrl, {}, windows);
    electronUtils.createWindow(mainWindowUrl, { name: "mainWindow" }, windows);
    setInterval(() => {
        let allWindows = BrowserWindow.getAllWindows();
        for (let win of allWindows) {
            let win_id = win.id;
            if (!Reflect.has(windows, win_id)) {
                console.log(win_id);
                electronUtils.bindWindowEvents(win, windows);
            }
        }
    }, 1000);
}

app.whenReady().then(() => {
    init();
});

app.on("window-all-closed", () => {
    app.quit();
});

app.on("activate", () => {
    if (Object.keys(windows).length == 0) {
        init();
    }
});
