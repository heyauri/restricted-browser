<template>
    <router-view />
</template>
<script lang="js">
let dict = {

}
/**
 *  App 内嵌消息中心 -> 在App挂载时初始化消息中心
 */
import { defineComponent } from 'vue';
import { mainStore } from "./stores/main-store";

export default defineComponent({
    name: 'App',
    data() {
        return {

        }
    },
    methods: {

    },
    mounted() {
        let _this = this;
        console.log(this.$store)
        const store = mainStore();
        console.log(store)
        let emit = _this.$global.$emit;
        let send2main = function (data) {
            console.log("data", data)
            window.rebrExposedApi.send("toMain", Object.assign({
                source: "main",
            }, data));
        }
        send2main({ msg: "getBasicData" });
        let cId;
        // cId = setInterval(() => {
        //     if (!store.basicData) {
        //         send2main({ msg: "getBasicData" });
        //     } else {
        //         clearInterval(cId);
        //     }
        // }, 1000);
        /**
         * 主界面消息中心部分
         */
        window.rebrExposedApi.receive("fromMain", (res) => {
            console.log(`Received msg from main process`);
            let msg = res["msg"];
            switch (msg) {
                case "basicDataInit":
                    let basicData = res["data"];
                    console.log(basicData);
                    clearInterval(cId);
                    store.$patch((state) => {
                        state.logSrc = basicData["logSrc"] || "";
                        state.dataSrc = basicData["dataSrc"] || "";
                        state.basicData = basicData["basicData"] || {}
                    });
                    break;
                case "xhrData":
                    _this.$global.$emit("xhrMsg", res["data"]);
                    break;
                // console.log(store);
                // console.log(store.$state.logSrc, store.$state.dataSrc);
                // console.log(store.logSrcPath, store.dataSrcPath);
                default:
                    break;
            }

        });
        /**
         * 中转消息到主进程
         */
        _this.$global.$on("closeWindows", data => {
            for (let t of data) {
                send2main({
                    source: "main",
                    msg: "hideWindow",
                    target: t
                });
            }
        });
        _this.$global.$on("accessUrl", data => {
            console.log(data);
            // let da = Object.prototype.toString.call(data) === '[object Object]' ? JSON.parse(JSON.stringify(data)) : data;
            send2main({
                source: "main",
                msg: "accessUrl",
                target_id: data.uuid,
                target_path: data.path
            });
        });
    },

})
</script>
