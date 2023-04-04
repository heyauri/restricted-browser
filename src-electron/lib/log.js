const log4js = require("log4js");
const path = require("path");
import {
    app
} from 'electron'

const LOG_PATH = path.join(app.getPath('userData'), 'logs');
console.log(LOG_PATH);

log4js.configure({
    appenders: {
        // 设置控制台输出 （默认日志级别是关闭的（即不会输出日志））
        out: {
            type: 'console' // 配置了这一项，除了会输出到日志文件，也会输出到控制台
        },
        // 设置每天：以日期为单位,数据文件类型，dataFile 注意设置pattern，alwaysIncludePattern属性
        alldateFileLog: {
            type: 'dateFile',
            filename: path.join(LOG_PATH, 'log'),
            pattern: '.yyyy-MM-dd.log', // 每天生成按这个格式拼接到filename后边
            alwaysIncludePattern: true // 始终包含pattern
        },
        httpLog: {
            type: "dateFile",
            filename: path.join(LOG_PATH, 'http'),
            pattern: ".yyyy-MM-dd.log",
            keepFileExt: true, // 文件名是否需要加".log"后缀
            alwaysIncludePattern: true
        },
        dataLog: {
            type: "dateFile",
            filename: path.join(LOG_PATH, 'http'),
            pattern: ".yyyy-MM-dd.log",
            keepFileExt: true, // 文件名是否需要加".log"后缀
            alwaysIncludePattern: true
        },
        operationLog: {
            type: "dateFile",
            filename: path.join(LOG_PATH, 'operation'),
            pattern: ".yyyy-MM-dd.log",
            keepFileExt: true, // 文件名是否需要加".log"后缀
            alwaysIncludePattern: true
        },
        renderProcessLog: {
            type: "dateFile",
            filename: path.join(LOG_PATH, 'renderer'),
            pattern: ".yyyy-MM-dd.log",
            keepFileExt: true,
            alwaysIncludePattern: true
        },
        mainProcessLog: {
            type: 'file',
            filename: path.join(LOG_PATH, 'main.log'),
            keepFileExt: true,
            maxLogSize: 1024 * 1024 * 100, // 文件最大容纳值
            backups: 3
        },
        crashLog: {
            type: 'file',
            filename: path.join(LOG_PATH, 'crash.log')
        },
        // 错误日志 type:过滤类型logLevelFilter,将过滤error日志写进指定文件
        errorLog: {
            type: 'file',
            filename: path.join(LOG_PATH, 'error.log')
        },
        error: {
            type: "logLevelFilter",
            level: "error",
            appender: 'errorLog'
        }
    },
    // 不同等级的日志追加到不同的输出位置：appenders: ['out', 'allLog']  categories 作为getLogger方法的键名对应
    categories: {
        date: {
            appenders: ['out', 'alldateFileLog'],
            level: "debug"
        },
        http: {
            appenders: ['out', 'httpLog'],
            level: "debug"
        },
        operation: {
            appenders: ['out', 'operationLog'],
            level: "debug"
        },
        data: {
            appenders: ['out', 'dataLog'],
            level: "debug"
        },
        main: {
            appenders: ['out', 'mainProcessLog'],
            level: "debug"
        },
        renderer: {
            appenders: ['renderProcessLog'],
            level: "debug"
        },
        crash: {
            appenders: ['out', 'crashLog'],
            level: "debug"
        },
        default: {
            appenders: ['out', 'alldateFileLog'],
            level: "debug"
        }
    }
});

export let logger = log4js.getLogger('date');
export let http = log4js.getLogger('http');
export let main = log4js.getLogger('main');
export let renderer = log4js.getLogger('renderer');
export let crash = log4js.getLogger('crash');
export let operation = log4js.getLogger("operation");
export let data = log4js.getLogger("data");
