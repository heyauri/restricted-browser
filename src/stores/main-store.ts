import { defineStore } from 'pinia';

export const mainStore = defineStore('main', {
    state: () => {
        let basicData: { [key: string]: any } = {}
        return {
            logSrc: "",
            dataSrc: "",
            basicData
        }
    },
    getters: {
        logSrcPath: (state) => state.logSrc,
        dataSrcPath: (state) => state.dataSrc,
        basicData: (state) => state.basicData
    },
    actions: {
        setLogSrc(str: any) {
            this.logSrc = str;
            return true;
        },
        setDataSrc(str: any) {
            this.dataSrc = str;
            return true;
        },
        setBasicData(obj: any) {
            this.basicData = obj;
            return true;
        },
    },
});
