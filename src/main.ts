import Vue from 'vue';
// @ts-ignore
import App from './App.vue';
import router from './router/router';
import store from './store';
// 加载iview CSS
import 'iview/dist/styles/iview.css'
import './assets/reset.scss'
import './assets/public.scss'
// 按需加载iview 组件
import iviewOnDemand from './util/iviewOnDemand';
// 加载项目扩展组件
import plugin from './util/plugin';

Vue.config.productionTip = false;

Vue.use(iviewOnDemand);

// @ts-ignore
Vue.use(plugin);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
