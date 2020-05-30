import Vue from 'vue';
import Router from 'vue-router';

import Frame from './frame/index';

// @ts-ignore
const LOGIN = () => import(/* webpackChunkName: "login" */ '../views/Login.vue');
// @ts-ignore
const FRAME_MAIN = () => import(/* webpackChunkName: "frame" */ '../views/frame/Main.vue');
// @ts-ignore
const LEGAL_PREVIEW = () => import(/* webpackChunkName: "legal-preview" */ '../views/frame/legal/Preview.vue');
// @ts-ignore
const ORDER_DETAIL = () => import(/* webpackChunkName: "order-detail" */ '../views/frame/order/Detail.vue');
// @ts-ignore
const ORDER_ADJUST_LOG = () => import(/* webpackChunkName: "order-adjust-log" */ '../views/frame/order/AdjustLog.vue');


Vue.use(Router);

// @ts-ignore
const router = new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        // 登录页面
        {
            path: '/login',
            component: LOGIN,
        },

        // 运营系统框架页面
        {
            path: '/frame',
            component: FRAME_MAIN,
            children: [
                ...Frame
            ]
        },

        // 法律条款预览页面
        {
            path: '/legal-preview',
            component: LEGAL_PREVIEW,
        },

        // 订单详情页面
        {
            path: '/order-detail',
            component: ORDER_DETAIL,
        },

        // 订单调价日志
        {
            path: '/order-adjust-log',
            component: ORDER_ADJUST_LOG,
        },

        // 路由地址错误时重定向到默认页面
        {
            path: '*',
            redirect: '/frame/home'
        },
    ],
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
});

router.beforeEach((to, from, next) => {

    if (to.path.includes("/login") || sessionStorage.getItem('citic-token')) {
        next();
    } else {
        sessionStorage.clear();
        localStorage.clear();
        next('/login');
    }

});


export default router
