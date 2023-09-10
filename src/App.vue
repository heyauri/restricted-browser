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
        let emit = _this.$global.$emit;
        let send2main = function (data) {
            window.rebrExposedApi.send("toMain", Object.assign({
                source: "main",
            }, data));
        }
        const store = mainStore();
        // let cId = setInterval(() => {
        //     if (!store.dataSrc) {
        //         send2main({ msg: "getAssetsPath" });
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
                case "assetsPaths":
                    let assets = res["data"];
                    console.log(assets);
                    clearInterval(cId);
                    store.$patch((state) => {
                        state.logSrc = assets["logSrc"] || "";
                        state.dataSrc = assets["dataSrc"] || ""
                    });
                case "xhrData":
                    _this.$global.$emit("xhrMsg", res["data"]);
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
            send2main({
                source: "main",
                msg: "accessUrl",
                target: data
            });
        });
    },

})
</script>
