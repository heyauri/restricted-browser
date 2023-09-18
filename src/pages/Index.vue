<template>
    <q-page class="q-pa-md column juestify-start" style="width: 100%">
        <div class="row">
            <div class="q-pa-md col-6">
                <h3 v-if="basicData.homepage_setting.title" style="margin:0">{{ basicData.homepage_setting.title }}
                </h3>
                <p class="q-pa-sm" v-if="basicData.homepage_setting.description" style="margin:0">{{
                    basicData.homepage_setting.description }}</p>
            </div>
            <div class="col q-pa-sm text-right"> <q-toggle v-model="showChats" color="green"
                    v-if="basicData.homepage_setting.instruction"
                    :label="basicData.homepage_setting.instruction.toggle_label" /></div>
        </div>
        <section>
            <div v-if="showChats && basicData.homepage_setting.instruction.chats" class="q-pa-md row justify-center"
                style="border:1px dashed #ddd">
                <div style="width: 100%; max-width: 800px">
                    <template v-for="(chat, key) in basicData.homepage_setting.instruction.chats" :key="key">
                        <q-chat-message :name="chat.name" :avatar="chat.avatar" :text="chat.messages" :sent="chat.sent"
                            text-color="white" :bg-color="chat.sent ? 'positive' : 'primary'" /></template>
                </div>
            </div>
        </section>
        <section class="q-pa-md">
            <h5 class="q-pa-md" style="margin:0">{{ basicData.homepage_setting.link_title }}</h5>
            <q-list v-if="basicData.accessible_sites">
                <template v-for="(item, key) in basicData.accessible_sites" :key="key">
                    <q-item v-if="item.name && item.path" clickable v-ripple bordered @click="accessWebpage(item)">
                        <q-item-section avatar>
                            <q-avatar rounded color="primary" text-color="white" icon="link" />
                        </q-item-section>
                        <q-item-section>{{ item.name }}</q-item-section>
                    </q-item>
                    <q-separator />
                </template>
            </q-list>
        </section>
    </q-page>
</template>

<script lang="js">
import { defineComponent, ref } from "vue";
import { mainStore } from "../stores/main-store";
export default defineComponent({
    name: "PageIndex",
    components: {},
    setup() {
        const store = mainStore();
        return {
            basicData: store.$state.basicData
        }
    },
    data() {
        return {
            showChats: true,
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
        accessWebpage(item) {
            console.log(item);
            this.sendMsg("accessUrl", item);
        }
    },
});
</script>
<style>
body {
    background: #eee;
}
</style>
