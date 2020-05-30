export default [
    {
        id: 'home',
        icon: 'ios-planet-outline',
        name: `首页`,
        path: '/frame/home'
    },

    // 法律服务条款
    {
        id: 'legal',
        icon: 'md-paper',
        name: `法律服务条款`,
        path: '/frame/legal'
    },

    // 信息安全审核
    {
        id: 'authentication',
        icon: 'md-done-all',
        name: `信息安全审核`,
        path: '/frame/authentication'
    },

    // 服务规格配置
    {
        id: 'service-specs',
        icon: 'md-cog',
        name: `服务规格配置`,
        path: '/frame/service-specs'
    },

    // 订单管理
    {
        id: 'order',
        icon: 'md-reorder',
        name: `订单管理`,
        path: '/frame/order',
        child: [{
            id: 'instance',
            icon: 'ios-reorder',
            name: `订单列表`,
            path: '/frame/order/list',
        }]
    },

    // 实例管理
    {
        id: 'instance',
        icon: 'ios-card-outline',
        name: `实例管理`,
        path: '/frame/instance',
        child: [{
            id: 'instance',
            icon: 'ios-options-outline',
            name: `实例列表`,
            path: '/frame/instance/list',
        }, {
            id: 'instanceApproval',
            icon: 'ios-create-outline',
            name: `线下实例审批`,
            path: '/frame/instance/approval'
        }]
    },

    {
        id: 'coupon-list',
        icon: 'md-pricetags',
        name: `优惠券管理`,
        path: '/frame/coupon',
        child: [{
            id: 'coupon-list',
            icon: 'ios-construct',
            name: `优惠券`,
            path: '/frame/coupon-manage/coupon'
        }, {
            id: 'coupon-approval',
            icon: 'md-checkbox-outline',
            name: `优惠券审批`,
            path: '/frame/coupon-manage/approval'
        }]
    },

    // 费用中心
    {
        id: 'cost-center',
        icon: 'logo-usd',
        name: `费用中心`,
        path: '/frame/cost',
        child: [{
            id: 'cash-account-overview',
            icon: 'ios-cash',
            name: `现金账户总览`,
            path: '/frame/cost/cash-account-overview'
        }, {
            id: 'cash-payment-detail',
            icon: 'logo-bitcoin',
            name: `现金收支明细`,
            path: '/frame/cost/cash-payment-detail'
        }, {
            id: 'payment-manage',
            icon: 'ios-card',
            name: `支付管理`,
            path: '/frame/cost/payment-manage'
        }, {
            id: 'payment-detail',
            icon: 'ios-card-outline',
            name: `租户支付明细`,
            path: '/frame/cost/payment-detail'
        }]
    },

    // 信用管理
    {
        id: 'credit-manage',
        icon: 'md-card',
        name: `信用管理`,
        path: '/frame/credit',
        child: [{
            id: 'credit-account',
            icon: 'md-cash',
            name: `信用账户`,
            path: '/frame/credit/credit-account'
        },{
            id: 'credit-limit-approval',
            icon: 'md-cash',
            name: `信用额度管理`,
            path: '/frame/credit/credit-limit-approval'
        }]
    },

    // 收入管理
    {
        id: 'income-manage',
        icon: 'logo-yen',
        name: `收入管理`,
        path: '/frame/income',
        child: [{
            id: 'credit-account',
            icon: 'ios-trending-up',
            name: `收入查询`,
            path: '/frame/income/income-manage'
        }]
    },
    //缓存管理 功能跟下方类似 有机会需要合并
    {
        id: 'cache-admin',
        icon: 'md-ionic',
        name: `缓存管理`,
        path: '/frame/cacheAdmin'


    },
    // 数据刷新
    {
        id: 'data-refresh',
        icon: 'ios-barcode-outline',
        name: `数据刷新`,
        path: '/frame/data-refresh'
    },
    // 收入管理
    {
        id: 'invoice-manage',
        icon: 'ios-paper-outline',
        name: `发票管理`,
        path: '/frame/invoice',
        child: [{
            id: 'invoice-manage',
            icon: 'md-paper',
            name: `发票管理`,
            path: '/frame/invoice/list'
        }]
    },
    // 账单管理
    {
        id: 'bill',
        icon: 'md-list-box',
        name: `账单管理`,
        path: '/frame/bill',
        child: [{
            id: 'collection',
            icon: 'ios-trending-up',
            name: `收款管理`,
            path: '/frame/bill/collection/list'
        }]
    },
]