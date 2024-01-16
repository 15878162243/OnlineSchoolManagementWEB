import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import axios from './utils/request.ts'
import router from './router'
import store from './store';
import mitt from 'mitt'

const EventBus = mitt()
/**
 * 代码提示[……不存在属性"EventBus"……]是因为在app.config.globalProperties上挂载的EventBus
 * 要进行ComponentCustomProperties接口扩展才能获得类型识别
 * ComponentCustomProperties接口是vue3提供的增强组件实例类型以支持自定义全局属性，通过TypeScript模块扩展来扩展的
 */
declare module 'vue' {
  export interface ComponentCustomProperties {
    EventBus: typeof EventBus
  }
}

const app = createApp(App)

app.use(ElementPlus).use(router).use(store)
app.config.globalProperties.EventBus = EventBus
app.config.globalProperties.$axios = axios;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

