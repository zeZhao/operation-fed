// @ts-ignore
import Empty from '../../components/Empty'

// @ts-ignore
const Home = () => import(/* webpackChunkName: "home" */ '../../views/frame/home/Index.vue');

// @ts-ignore
const COUPON_LIST = () => import(/* webpackChunkName: "coupon-list" */ '../../views/frame/coupon/Index.vue');
// @ts-ignore
const APPROVAL_LIST = () => import(/* webpackChunkName: "approval-list" */ '../../views/frame/coupon/Approval.vue');
// @ts-ignore
const COUPON_FORM = () => import(/* webpackChunkName: "coupon-form" */ '../../views/frame/coupon/Form.vue');

// @ts-ignore
const LEGAL_LIST = () => import(/* webpackChunkName: "legal-list" */ '../../views/frame/legal/Index.vue');
// @ts-ignore
const LEGAL_FORM = () => import(/* webpackChunkName: "legal-form" */ '../../views/frame/legal/Form.vue');

// @ts-ignore
const AUTHENTICATION_LIST = () => import(/* webpackChunkName: "authentication-list" */ '../../views/frame/authentication/Index.vue');
// @ts-ignore
const AUTHENTICATION_FORM = () => import(/* webpackChunkName: "authentication-form" */ '../../views/frame/authentication/Form.vue');

// @ts-ignore
const INSTANCE_APPROVAL_LIST = () => import(/* webpackChunkName: "instance-approval-list" */ '../../views/frame/instanceApproval/Index.vue');
// @ts-ignore
const INSTANCE_APPROVAL_FORM = () => import(/* webpackChunkName: "instance-approval-form" */ '../../views/frame/instanceApproval/Form.vue');

// @ts-ignore
const CASH_ACCOUNT_OVERVIEW = () => import(/* webpackChunkName: "cash-account-overview" */ '../../views/frame/cost/CashAccountOverview.vue');
// @ts-ignore
const CASH_PAYMENT_DETAIL = () => import(/* webpackChunkName: "cash-payment-detail" */ '../../views/frame/cost/CashPaymentDetail.vue');
// @ts-ignore
const PAYMENT_MANAGE = () => import(/* webpackChunkName: "payment-manage" */ '../../views/frame/cost/PaymentManage.vue');
// @ts-ignore
const PAYMENT_DETAIL = () => import(/* webpackChunkName: "payment-detail" */ '../../views/frame/cost/PaymentDetail.vue');
// @ts-ignore
const MONEY_BACK_DETAIL = () => import(/* webpackChunkName: "money-back-detail" */ '../../views/frame/cost/MoneyBackDetail.vue');

// @ts-ignore
const CREDIT_ACCOUNT = () => import(/* webpackChunkName: "credit-account" */ '../../views/frame/credit/CreditAccount.vue');
// @ts-ignore
const CREDIT_LIMIT_APPROVAL = () => import(/* webpackChunkName: "credit-limit-approval" */ '../../views/frame/credit/CreditLimitApproval.vue');

// @ts-ignore
const INCOME_MANAGE = () => import(/* webpackChunkName: "income-manage" */ '../../views/frame/income/IncomeManage.vue');
// @ts-ignore
const RECORDED_LIST = () => import(/* webpackChunkName: "recorded-list" */ '../../views/frame/income/RecordedList.vue');

// @ts-ignore
const INSTANCE_LIST = () => import(/* webpackChunkName: "instance-list" */ '../../views/frame/instance/Index.vue');

// 服务配置
// @ts-ignore
const SERVICE_SPECS = () => import(/* webpackChunkName: "service-specs" */ '../../views/frame/serviceSpecs/Index.vue');

// @ts-ignore
const SERVICE_SPECS_ACTION_FORM = () => import(/* webpackChunkName: "service-specs-action-form" */ '../../views/frame/serviceSpecs/ActionForm.vue');

// @ts-ignore
const SERVICE_SPECS_KEY_LIST = () => import(/* webpackChunkName: "service-specs-key-list" */ '../../views/frame/serviceSpecs/KeyList.vue');
// @ts-ignore
const SERVICE_SPECS_KEY_FORM = () => import(/* webpackChunkName: "service-specs-key-form" */ '../../views/frame/serviceSpecs/KeyForm.vue');
// @ts-ignore
const SERVICE_SPECS_VALUE_LIST = () => import(/* webpackChunkName: "service-specs-value-form" */ '../../views/frame/serviceSpecs/ValueList.vue');
// @ts-ignore
const SERVICE_SPECS_VALUE_FORM = () => import(/* webpackChunkName: "service-specs-value-form" */ '../../views/frame/serviceSpecs/ValueForm.vue');
// @ts-ignore
const SERVICE_SPECS_RELATION_FORM = () => import(/* webpackChunkName: "service-specs-relation-form" */ '../../views/frame/serviceSpecs/RelationForm.vue');

// @ts-ignore
const ORDER_LIST = () => import(/* webpackChunkName: "order-list" */ '../../views/frame/order/Index.vue');
// @ts-ignore
const CACHE_ADMIN = () => import('../../views/frame/cacheAdmin/Index.vue');
// @ts-ignore
const DATA_REFRESH = () => import(/* webpackChunkName: "data-refresh" */ '../../views/frame/dataRefresh/Index.vue');
// @ts-ignore
const INVOICE_LIST = () => import(/* webpackChunkName: "invoice-list" */ '../../views/frame/invoice/Index.vue');
// @ts-ignore
const INVOICE_DETAIL = () => import(/* webpackChunkName: "invoice-detail" */ '../../views/frame/invoice/Detail.vue');

// @ts-ignore
const COLLECTION_LIST = () => import(/* webpackChunkName: "collection-list" */ '../../views/frame/bill/collection/Index.vue');// @ts-ignore
// @ts-ignore
const COLLECTION_DETAIL = () => import(/* webpackChunkName: "collection-detail" */ '../../views/frame/bill/collection/Detail.vue');// @ts-ignore
// @ts-ignore
const COLLECTION_OTHER_LIST = () => import(/* webpackChunkName: "collection-otherList" */ '../../views/frame/bill/collection/OtherList.vue');// @ts-ignore


// const ORDER_LIST = () => import(/* webpackChunkName: "order-list" */ '../../views/frame/order/Index.vue');


export default [

    {
        path: 'home',
        component: Empty,
        children: [
            {path: '/', component: Home},
        ]
    },

    // 法律服务条款
    {
        path: 'legal',
        component: Empty,
        children: [
            {path: '/', component: LEGAL_LIST},
            {path: 'form', component: LEGAL_FORM},
        ]
    },

    // 优惠券
    {
        path: 'coupon-manage',
        component: Empty,
        children: [
            {
                path: 'coupon', component: Empty, children: [
                    {path: '/', component: COUPON_LIST},
                    {path: 'form', component: COUPON_FORM},
                ]
            },

            {
                path: 'approval', component: Empty, children: [
                    {path: '/', component: APPROVAL_LIST},
                ]
            },
        ]
    },

    // 信息安全审核
    {
        path: 'authentication',
        component: Empty,
        children: [
            {path: '/', component: AUTHENTICATION_LIST},
            {path: 'form', component: AUTHENTICATION_FORM},
        ]
    },

    // 费用中心
    {
        path: 'cost',
        component: Empty,
        children: [
            {path: 'cash-account-overview', component: CASH_ACCOUNT_OVERVIEW},
            {path: 'cash-payment-detail', component: CASH_PAYMENT_DETAIL},
            {path: 'payment-manage', component: PAYMENT_MANAGE},
            {path: 'payment-detail', component: PAYMENT_DETAIL},
            {path: 'money-back-detail', component: MONEY_BACK_DETAIL},
        ]
    },

    // 信用管理
    {
        path: 'credit',
        component: Empty,
        children: [
            {path: 'credit-account', component: CREDIT_ACCOUNT},
            {path: 'credit-limit-approval', component: CREDIT_LIMIT_APPROVAL},
        ]
    },

    // 收入管理
    {
        path: 'income',
        component: Empty,
        children: [
            {path: 'income-manage', component: INCOME_MANAGE},
            {path: 'recorded-list', component: RECORDED_LIST}
        ]
    },

    // 实例管理
    {
        path: 'instance',
        component: Empty,
        children: [
            {path: 'list', component: INSTANCE_LIST},
            // 线下实例审批
            {path: 'approval', component: INSTANCE_APPROVAL_LIST},
            {path: 'approval/form', component: INSTANCE_APPROVAL_FORM},
        ]
    },

    // 服务规格配置
    {
        path: 'service-specs',
        component: Empty,
        children: [
            {path: '/', component: SERVICE_SPECS},
            {path: 'action/form', component: SERVICE_SPECS_ACTION_FORM},
            {path: 'key/list', component: SERVICE_SPECS_KEY_LIST},
            {path: 'key/form', component: SERVICE_SPECS_KEY_FORM},
            {path: 'value/list', component: SERVICE_SPECS_VALUE_LIST},
            {path: 'value/form', component: SERVICE_SPECS_VALUE_FORM},
            {path: 'relation/form', component: SERVICE_SPECS_RELATION_FORM},
        ]
    },

    // 实例管理
    {
        path: 'order',
        component: Empty,
        children: [
            {path: 'list', component: ORDER_LIST},
        ]
    },
    // 缓存管理
    {
        path: 'cacheAdmin',
        component: Empty,
        children: [
            {path: '/', component: CACHE_ADMIN},
        ]
    },
    //  数据刷新
    {
        path:'data-refresh',
        component: Empty,
        children: [
            {path:'/', component: DATA_REFRESH}
        ]
    },
    // 发票管理
    {
        path: 'invoice',
        component: Empty,
        children: [
            {path: 'list', component: INVOICE_LIST},
            {path: 'detail', component: INVOICE_DETAIL},
        ]
    },
    // 账单管理
    {
        path: 'bill',
        component: Empty,
        children: [
            {path: 'collection/list', component: COLLECTION_LIST},
            {path: 'collection/detail', component: COLLECTION_DETAIL},
            {path: 'collection/other/list', component: COLLECTION_OTHER_LIST},
        ]
    },
]