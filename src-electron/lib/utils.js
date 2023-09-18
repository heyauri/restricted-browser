const fs = require("fs");
const path = require("path");
const config = require("config");

import { app, Notification, dialog } from "electron";
import { v4 as uuidv4 } from "uuid";

let userData = app.getPath("userData");
const LOG_PATH = path.join(app.getPath("userData"), "logs");
let userAgents = [
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
];

export let getUserAgent = function () {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
};

export let send2win = function (window, args) {
    try {
        window.webContents.send("fromMain", args);
    } catch (e) {
        console.error("send2win error", e, args);
    }
};

export let streamToBuffer = function (stream) {
    return new Promise((resolve, reject) => {
        let buffers = [];
        stream.on("error", reject);
        stream.on("data", (data) => buffers.push(data));
        stream.on("end", () => resolve(Buffer.concat(buffers)));
    });
};

export let pause = function (t) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, t);
    });
};

export let getType = function (data) {
    return Object.prototype.toString.call(data);
};
export let isArray = function (data) {
    return getType(data) === "[object Array]";
};
export let isObject = function (data) {
    return getType(data) === "[object Object]";
};

/**
 *  init the config place
 */
let configPathBase,
    dataDirName = "rebr-config";

export let getConfigPathBase = function () {
    return configPathBase;
};

export let getLogPath = function () {
    return LOG_PATH;
};

function setConfigDir(inDir) {
    try {
        // let baseDir = path.dirname(app.getAppPath());
        let baseDir = inDir;
        if (!configPathBase) {
            if (!fs.existsSync(path.join(baseDir, dataDirName))) {
                fs.mkdirSync(path.join(baseDir, dataDirName));
            }
            configPathBase = path.join(baseDir, dataDirName);
        }
    } catch (e) {
        console.log(e);
    }
    return configPathBase;
}

export let getConfig = function () {
    configPathBase = setConfigDir(path.dirname(app.getPath("exe")));
    if (!configPathBase) {
        configPathBase = setConfigDir(userData);
    }
    console.log(configPathBase);
    let fp = path.join(configPathBase, "config.js");
    let version_mark = true;
    if (process.env.DEBUGGING) {
        // if on DEV or Production with debug enabled
        version_mark = false;
    }
    try {
        if (fs.existsSync(fp)) {
            let config = require(fp);
            if (config) {
                let v = config.version;
                if (v != 1) {
                    version_mark = false;
                }
            } else {
                version_mark = false;
            }
        }
    } catch (e) {
        console.error(e);
    }
    if (!fs.existsSync(fp) || !version_mark) {
        let dirPath;
        if (process.env.DEBUGGING) {
            dirPath = process.cwd();
        } else {
            //发布环境
            dirPath = process.resourcesPath;
        }
        let srcFilePath = path.join(dirPath, "common/config-template.js");
        console.log("Template Address:", srcFilePath);
        console.log("dst config address:", fp);
        fs.copyFileSync(srcFilePath, fp);
    }
    let config = require(fp);
    if (config && config["accessible_sites"] && isArray(config["accessible_sites"])) {
        for (let site of config["accessible_sites"]) {
            site["uuid"] = uuidv4();
        }
    }
    return config;
};
