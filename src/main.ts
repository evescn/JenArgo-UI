import { createApp } from 'vue'
// import ArcoVue from "@arco-design/web-vue"
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'

import App from './App.vue'
import router from './router'
import pinia, { useServiceStore } from '@/stores/index'

// 导入 自定义 button
import CButton from '@/components/CButton/index.vue'
import MainHead from '@/components/MainHead/index.vue'

const app = createApp(App)
app.component('CButton', CButton)
app.component('MainHead', MainHead)

const initGlobalData = async () => {
    const serviceStore = useServiceStore()
    // 获取 service 数据
    serviceStore.getServiceInfo()
}

app.use(pinia).use(ArcoVue).use(ArcoVueIcon).use(router)

app.mount('#app')

initGlobalData()
