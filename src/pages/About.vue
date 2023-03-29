<template>
    <q-page class="q-pa-md">
        <q-card class="my-card">
            <q-card-section>
                <div class="text-overline text-orange-9">About</div>
                <div class="text-h6">应用说明 <q-badge align="top">v1.0.1beta</q-badge>
                </div>
                <div class="text-subtitle2">2022.07.03</div>
            </q-card-section>
            <q-separator dark />
            <q-separator dark />
            <q-card-section>
                <div v-if="logSrc">
                    <div class="text-subtitle1">
                        日志地址
                    </div>
                    <p class="bg-dark text-white q-pa-md">
                        {{ logSrc }}
                    </p>
                </div>
                <br />
                <div v-if="dataSrc">
                    <div class="text-subtitle1">
                        数据地址
                    </div>
                    <p class="bg-dark text-white q-pa-md">
                        {{ dataSrc }}
                    </p>
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>
<style lang="scss">
.bg-dark {
    background: $blue-grey-9;
}
</style>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { mainStore } from "../stores/main-store";

const store = mainStore();
export default defineComponent({
    name: "PageIndex",
    components: {},
    setup() {
    },
    data() {
        return {
            logSrc: "",
            dataSrc: ""
        }
    },
    computed: {
    },
    mounted() {
        //@ts-ignore
        let _this = this;
        setTimeout(() => {
            _this.logSrc = store.$state.logSrc;
            console.log(_this.logSrc);
            _this.dataSrc = store.$state.dataSrc;
        }, 500)
    }
});
</script>
