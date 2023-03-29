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

import { bindMsgCenter } from "./msg-center";

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

Menu.setApplicationMenu(null);
function createWindow(targetUrl) {
    /**
     * Initial window options
     */
    let currentWindow = new BrowserWindow({
        icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
        width: 1200,
        height: 700,
        useContentSize: true,
        webPreferences: {
            contextIsolation: true,
            // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
            preload: path.resolve(
                __dirname,
                process.env.QUASAR_ELECTRON_PRELOAD
            ),
            session: "persist:main",
        },
    });

    windows[targetUrl] = currentWindow;
    // mainWindow.loadURL(process.env.APP_URL);
    currentWindow.loadURL(targetUrl);

    currentWindow.webContents.on("did-finish-load", function () {
        bindMsgCenter(ipcMain, windows);
    });
    currentWindow.webContents.setWindowOpenHandler(({ url }) => {
        console.log(url);
        // shell.openExternal(url);
        // return { action: "deny" };
        return { action: "allow" };
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
        currentWindow = null;
    });
}

app.whenReady().then(() => {
    let defaultUrl = "https://ggfw.hrss.gd.gov.cn/"
    createWindow(defaultUrl);
    session
        .fromPartition("persist:main")
        .setPermissionRequestHandler((webContents, permission, callback) => {
            const parsedUrl = new URL(webContents.getURL());
            console.log(parsedUrl);
            if (permission === "notifications") {
                // Approves the permissions request
                callback(true);
            }

            // Verify URL
            if (
                parsedUrl.protocol !== "https:" ||
                parsedUrl.host !== "baidu.com"
            ) {
                // Denies the permissions request
                return callback(false);
            }
        });
});

app.on("window-all-closed", () => {
    if (platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
