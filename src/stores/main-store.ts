import { defineStore } from 'pinia';

export const mainStore = defineStore('main', {
    state: () => ({
        logSrc: "",
        dataSrc: ""
    }),
    getters: {
        logSrcPath: (state) => state.logSrc,
        dataSrcPath: (state) => state.dataSrc,
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
    },
});
