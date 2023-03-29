<template>
    <q-page class="column juestify-start" style="width: 100%">
        <div class="row items-center" style="width: 100%;height:120px;">
            <div class="col-8 q-pa-lg">
                <q-input outlined color="primary" v-model="targetUrl" label="网址" placeholder="以http://或https://开头的目标页面">
                </q-input>
            </div>
            <div class="col-3 q-pa-sm text-right">
                <q-btn size="md" align="between" color="secondary" label="访问网站" icon="check" @click="accessWebpage" />
            </div>
        </div>
        <div class="column" style="width: 98%; margin: 20px auto;" v-if="msgArr.length > 0">
            <p style="font-size:1.5em;padding:10px 40px;margin:0">消息记录</p>
            <div style="width: 80%; max-width: 1200px;  margin: 20px auto;">
                <div v-for="(item, index) in msgArr" :key="index">
                    <q-chat-message :name="`${item['url']} ${item['status']}`"
                        :text="[item['content'] || item['responseText']]" :stamp="item['t']" />
                </div>
            </div>
        </div>
    </q-page>
</template>

<script lang="js">
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "PageIndex",
    components: {},
    setup() { },
    data() {
        return {
            dialogShow: false,
            targetUrl: "https://www.qq.com",
            msgArr: []
        };
    },
    mounted() {
        let _this = this;
        //@ts-ignore
        _this.$global.$on("xhrMsg", (data) => {
            let content = data["response"] || data["responseText"];
            if (content.length > 600) {
                content = content.slice(0, 600) + "...";
            }
            data["content"] = content;
            _this.msgArr.unshift(data);
            while (_this.msgArr.length > 20) {
                _this.msgArr.pop();
            }
        });
    },
    watch: {

    },
    methods: {
        sendMsg(type, msg) {
            // @ts-ignore : $global在原型中不存在
            this.$global.$emit(type, msg);
        },
        accessWebpage() {
            let url = this.targetUrl;
            if (!/https:\/\//.test(url) && !/http:\/\//.test(url)) {
                alert("请输入以http://或https://开头的网址");
                return;
            }
            this.sendMsg("accessUrl", this.targetUrl);
        }
    },
});
</script>
