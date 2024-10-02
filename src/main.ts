import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import VSwatches from 'vue3-swatches'
import 'vue3-swatches/dist/style.css'
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);

app
    .use(router)
    .use(Antd)
    .use(VSwatches)
    .mount('#app');
