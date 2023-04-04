const fs = require('fs')
const path = require('path')
const config = require('config')

import { app } from 'electron'

let userData = app.getPath('userData')
const LOG_PATH = path.join(app.getPath('userData'), 'logs')
let userAgents = [
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36",
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
]

export let getUserAgent = function () {
    return userAgents[Math.floor(Math.random() * userAgents.length)]
}

export let send2win = function (window, args) {
    window.webContents.send('fromMain', args)
}

export let streamToBuffer = function (stream) {
    return new Promise((resolve, reject) => {
        let buffers = []
        stream.on('error', reject)
        stream.on('data', (data) => buffers.push(data))
        stream.on('end', () => resolve(Buffer.concat(buffers)))
    })
}

export let pause = function (t) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, t)
    })
}

export let getType = function (data) {
    return Object.prototype.toString.call(data)
}
export let isArray = function (data) {
    return getType(data) === '[object Array]'
}
export let isObject = function (data) {
    return getType(data) === '[object Object]'
}

/**
 *  init the config place
 */
let savePathBase,
    dataDirName = 'rebr-config'
try {
    if (!savePathBase) {
        if (!fs.existsSync(path.join(userData, dataDirName))) {
            fs.mkdirSync(path.join(userData, dataDirName))
        }
        savePathBase = path.join(userData, dataDirName)
    }
} catch (e) {
    console.log(e);
}

export let getDataSavePath = function () {
    return savePathBase
}

export let getLogPath = function () {
    return LOG_PATH
}

export let getConfig = function () {
    let fp = path.join(savePathBase, 'config.js');
    if (!fs.existsSync(fp)) {
        let dirPath;
        if (process.env.DEBUGGING) {
            dirPath = process.cwd()

        } else {//发布环境
            dirPath = process.resourcesPath
        }
        let srcFilePath = path.join(dirPath, 'common/config-template.js');
        console.log("Template Address:",srcFilePath)
        fs.copyFileSync(srcFilePath, fp);
    }
    let config = require(fp);
    return config;
}
