interface APIInterface {
    // 图片验证码
    readonly CITIC_PIC_VERIFICATION_CODE: string,
    // 登录接口
    readonly  CITIC_DO_LOGIN: string,
    // 登出
    readonly  REGISTER_LOGOUT: string,
    // 优惠券
    readonly CITIC_COUPON_QUERY: string,
    // 优惠券列表
    readonly CITIC_COUPON_APPROVE_QUERY: string,
    // 优惠券审批
    readonly CITIC_COUPON_APPROVE_APPROVE: string,
    // 优惠券新增
    readonly  CITIC_COUPON_SAVE: string,
    // 供应商
    readonly  SUPPLIER_SUPPLIERS: string,
    // 服务
    readonly  SUPPLIER_SERVICES: string,
    // 租户
    readonly  TENANTS_PAGE: string,

    // 服务条款列表
    readonly  TERMS_OF_CONDITIONS: string,
    // 上传服务条款
    readonly  TERMS_OF_CONDITIONS_UPLOAD_TERMS_OF_CONDITIONS: string,
    // 发布服务条款
    readonly  TERMS_OF_CONDITIONS_RELEASE: string,
    // 服务条款详情
    readonly  TERMS_OF_CONDITIONS_CONTENT: string,

    // 查询实例详情
    readonly  CITIC_AUTH_GET_AUTH_INSTANCE_DETAIL: string,
    // 中信认证实例列表查询
    readonly  CITIC_AUTH_GET_AUTH_INSTANCE_LIST: string,
    // 审批
    readonly  CITIC_AUTH_SECURITY_AUTH_APPROVAL: string,
    // 线下实例审批列表
    readonly  CITIC_GENERAL_ADAPTER_QUERY_INSTANCE_PAGE: string,
    // 查询线下实例审批列表详情信息
    readonly  CITIC_GENERAL_ADAPTER_GET_INSTANCE_APPROVE_DETAIL: string,
    // 线下实例审批列表详情审批
    readonly  CITIC_GENERAL_ADAPTER_CONFIRM_INSTANCE_APPROVE: string,
    // 供应商
    readonly  SUPPLIER_SUPPLIERS_GETAVAILABLETRUE: string,
    //供应商服务
    readonly  SUPPLIER_SERVICES_SUPPLIER: string,
    //应用基线
    readonly  CITIC_USER_APP_BASES: string,
    //成本中心
    readonly  CITIC_USER_GET_COST_CENTER_OFFICE_LIST: string,
    //实例列表
    readonly  SRVMGT_GET_COST_CENTER_OFFICE_LIST: string,
    //实例明细
    readonly  SRVMGT_GET_INSTANCE_NEW_DETAIL: string,
    //租户查询
    readonly  CITIC_USER_GET_TENANT_LIST: string,

    // 信用管控接口
    // 根据条件查询租户支付列表
    readonly  CITIC_ACCOUNT_BILL: string,
    // 租户月账单支付明细列表查询
    readonly  CITIC_ACCOUNT_BILL_DETAIL: string,
    // 根据查询参数获取现金账户列表数据
    readonly CITIC_ACCOUNT_CASH: string,
    // 根据查询参数获取现金账户明细列表数据
    readonly CITIC_ACCOUNT_CASH_DETAIL: string,
    // 根据查询参数获取信用账户列表数据
    readonly CITIC_ACCOUNT_CREDIT: string,
    // 手工冻结账户
    readonly CITIC_ACCOUNT_CREDIT_FREEZE: string,
    // 根据查询参数查询通过银企直联接入的收入列表数据
    readonly CITIC_BEDC_INCOME: string,
    // 额度调整申请列表 && 申请调整信用额度
    readonly CITIC_ACCOUNT_CREDIT_ADJUST: string,
    // 审批信用额度调整申请
    readonly CITIC_ACCOUNT_CREDIT_ADJUST_APPROVE: string,
    // 撤销信用额度调整申请
    readonly CITIC_ACCOUNT_CREDIT_ADJUST_CANCEL: string,
    // 文件上传
    readonly COMMON_UPLOAD_CREDIT_LINES_ADJUST: string,
    // 文件删除
    readonly COMMON_DELETE_FILE: string,
    // optionsKey列表
    readonly  CITIC_SERVICE_OPTIONSKEY_LIST: string,
    // optionsKey新增
    readonly  CITIC_SERVICE_OPTIONSKEY: string,
    // optionsKey编辑页面类型列表
    readonly  CITIC_OPTIONSKEY_TYPELIST: string,
    // 新增action
    readonly  CITIC_SERVICE_CONFIG_ACTION: string,
    // 删除action
    readonly  CITIC_SERVICE_CONFIG_ACTION_DELETEID: string,
    // 通过serviceId查询key
    readonly  CITIC_SERVICE_CONFIG_OPTIONS_KEY_SERVICE_ID: string,
    // 查询指定service下action
    readonly  CITIC_SERVICE_CONFIG_ACTION_SERVICE_ID: string,
    // enum 操作类型即行为类型如创建/变配等
    readonly  CITIC_SERVICE_CONFIG_ACTION_TYPE_ENUM: string,
    // enum 操作类型即行为类型如创建/变配等
    readonly  CITIC_SERVICE_CONFIG_ACTION_ID: string,
    // 通过actionId查询绑定key详情列表 {actionId}
    readonly  CITIC_SERVICE_CONFIG_OPTIONS_KEY_ACTION_ID: string,
    // 根据keyId查询value {keyId}
    readonly  CITIC_SERVICE_CONFIG_OPTIONS_VALUE_KEY_ID: string,
    // 树形更新、查询接口
    readonly CITIC_SERVICE_CONFIG_OPTIONS_RELATION_TREE: string,
    // 根据keyId查询value
    readonly CITIC_SERVICE_CONFIG_OPTIONS_VALUE: string,
    // 操作绑定key
    readonly CITIC_SERVICE_CONFIG_ACTION_OPTIONS: string,
    // 通过actionId查询action_options详情
    readonly CITIC_SERVICE_CONFIG_ACTION_OPTIONS_ACTION_ID: string,
    // enum value类型
    readonly CITIC_SERVICE_CONFIG_OPTIONS_VALUE_ENUM: string,
    // 订单列表
    readonly ORDER: string,
    // 订单详情
    readonly ORDER_PURCHASE: string,
    // 订单调价记录
    readonly ORDER_ADJUST_PRICE_LOG: string,
    // 订单调价记录
    readonly ORDER_ADJUST_PRICE: string,
    // 导出实例列表
    readonly INSTANCE_DOWNLOAD: string,
    //  现金账户明细回退记录
    readonly CITIC_ACCOUNT_CASH_DETAIL_REFUND: string,
    // 回退资金
    readonly CITIC_ACCOUNT_CASH_DETAIL_REFUND_REFUND: string,
    // 根据ID集合（如：ID1,ID2）查询支付明细列表
    readonly CITIC_ACCOUNT_BILL_DETAIL_FOR_LIST: string,
    // 查询待确认收入列表  &&  手工录入收入信息
    readonly CITIC_BEDC_INCOME_WAIT_CONFIRM: string,
    //  查询所有租户账号
    readonly CITIC_BEDC_BANK_ACCOUNTS_ALL: string,
    //  关闭入账
    readonly CITIC_BEDC_INCOME_WAIT_CONFIRM_CLOSED_ACCOUNTING: string,
    //  确认入账
    readonly CITIC_BEDC_INCOME_WAIT_CONFIRM_CONFIRMED_ACCOUNTING: string,
    //  删除手工录入数据
    readonly CITIC_BEDC_CLOSED_ACCOUNTING_DEL: string,
     // 根据key获得value
    readonly CITIC_SERVICE_CONFIG_OPTIONSVALUE_KEYID: string,
     // 刷新刷新citic-food库的adapter_service_config表数据
    readonly CITIC_ADAPTER_SERVICE_CONFIG_REFRESH: string,
    // 文件上传通用接口
    readonly COMMON_UPLOAD_FILE_BUSINESS: string,
    // 查询线下实例审批记录
    readonly  CITIC_GENERAL_ADAPTER_GET_INSTANCE_APPROVE_LOG: string,

    // 取消订单确认弹窗文件上传接口
    readonly CITIC_CANCEL_ORDER_UPLOAD: string,

    // 确认取消订单接口
    readonly CITIC_CONFIRM_CANCLE_ORDER: string,

    // 取消交付中的实例
    readonly CITIC_CANCEL_INSTANCE_APPROVE: string,
    
    //  数据刷新
    readonly FRESH: string,
    //  发票管理列表
    readonly INVOICE_GET_INVOICE_INFO_PAGE: string,
    //   发票详情
    readonly INVOICE_PAYMENT: string,
    //  发票详情列表
    readonly INVOICE_PAYMENT_SERVICE_BILL_LIST: string,
    //  查看发票信息
    readonly INVOICE_INVOICE_CONFIG: string,
    //  确认复核
    readonly INVOICE_CHECK_INVOICE_INFO: string,
    //  确认开票
    readonly INVOICE_CONFIRM_INVOICE_INFO: string,
    //  导出发票邮寄模版信息
    readonly INVOICE_INVOICE_EXPRESS_TEMPLATE_EXPORT: string,
    // 导出发票信息
    readonly INVOICE_INVOICE_INFO_EXPORT: string,
    // 导出发票配置信息
    readonly INVOICE_INVOICE_CONFIG_EXPORT: string,
    //  更新备注信息
    readonly INVOICE_SUBMIT_INVOICE_REMARKS: string,
    //  查询发票基本信息
    readonly INVOICE_GET_INVOICE_INFO_BYID: string,
    //  导入邮寄信息
    readonly INVOICE_INVOICE_EXPRESS_IMPORT: string,
    //  收款管理列表
    readonly RECEIVABLES: string,
    //  修改调账金额
    readonly RECEIVABLES_ADJUST: string,
    //  导出收款通知书
    readonly RECEIVABLES_FILE: string,
    //  发送通知书
    readonly RECEIVABLES_SEND_GATHERING_NOTICE: string,
    //  关闭发送
    readonly RECEIVABLES_CANCEL_SEND_NOTICE: string,
    //  关闭调账
    readonly RECEIVABLES_ADJUST_CLOSE: string,
    //  是否可以关闭调账
    readonly RECEIVABLES_ADJUST_STATUS: string,
    //  是否有发送中
    readonly RECEIVABLES_CHECK_SEND_STATUS: string,
    //  所有租户
    readonly CITIC_USER_TENANTS: string,
    // 收款管理详情列表
    readonly RECEIVABLES_SERVICE_BILL: string,
    //  折扣列表
    readonly CITIC_ACCOUNT_ELEDISCOUNT_PAGE_LIST: string,
}

const API: APIInterface = {
    // 图片验证码
    CITIC_PIC_VERIFICATION_CODE: 'register/pic/auth',
    // 登录接口
    CITIC_DO_LOGIN: "register/login",
    // 登出
    REGISTER_LOGOUT: 'register/logout',
    // 优惠券
    CITIC_COUPON_QUERY: 'citic/coupon/query',
    // 优惠券列表
    CITIC_COUPON_APPROVE_QUERY: 'citic/couponApprove/query',
    // 优惠券审批
    CITIC_COUPON_APPROVE_APPROVE: 'citic/couponApprove/approve',
    // 优惠券新增
    CITIC_COUPON_SAVE: 'citic/coupon/save',

    // 供应商
    SUPPLIER_SUPPLIERS: 'supplier/suppliers',
    // 供应商服务
    SUPPLIER_SERVICES: 'supplier/services',
    // 租户
    TENANTS_PAGE: 'tenants/page',

    // 服务条款列表
    TERMS_OF_CONDITIONS: 'terms-of-conditions',
    // 上传服务条款
    TERMS_OF_CONDITIONS_UPLOAD_TERMS_OF_CONDITIONS: 'terms-of-conditions/uploadTermsOfConditions/TermsOfConditions',
    // 发布服务条款
    TERMS_OF_CONDITIONS_RELEASE: 'terms-of-conditions/release',
    // 服务条款详情
    TERMS_OF_CONDITIONS_CONTENT: 'terms-of-conditions/content',

    // 查询实例详情
    CITIC_AUTH_GET_AUTH_INSTANCE_DETAIL: 'citicAuth/getAuthInstanceDetail',
    // 中信认证实例列表查询
    CITIC_AUTH_GET_AUTH_INSTANCE_LIST: 'citicAuth/getAuthInstanceList',
    // 审批
    CITIC_AUTH_SECURITY_AUTH_APPROVAL: 'citicAuth/securityAuthApproval',

    // 信用管控接口
    // 根据条件查询租户支付列表
    CITIC_ACCOUNT_BILL: 'citic-account/bill',
    // 租户月账单支付明细列表查询
    CITIC_ACCOUNT_BILL_DETAIL: 'citic-account/bill/detail',
    // 根据查询参数获取现金账户列表数据
    CITIC_ACCOUNT_CASH: 'citic-account/cash',
    // 根据查询参数获取现金账户明细列表数据
    CITIC_ACCOUNT_CASH_DETAIL: 'citic-account/cash-detail',
    // 根据查询参数获取信用账户列表数据
    CITIC_ACCOUNT_CREDIT: 'citic-account/credit',
    // 手工冻结账户
    CITIC_ACCOUNT_CREDIT_FREEZE: 'citic-account/credit/freeze/#{0}',
    // 根据查询参数查询通过银企直联接入的收入列表数据
    CITIC_BEDC_INCOME: 'citic-bedc/income',

    // 线下实例审批列表
    CITIC_GENERAL_ADAPTER_QUERY_INSTANCE_PAGE: 'citicGeneralAdapter/queryInstancePage',
    // 查询线下实例审批列表详情信息
    CITIC_GENERAL_ADAPTER_GET_INSTANCE_APPROVE_DETAIL: 'citicGeneralAdapter/getInstanceApproveDetail',
    // 线下实例审批列表详情审批
    CITIC_GENERAL_ADAPTER_CONFIRM_INSTANCE_APPROVE: 'citicGeneralAdapter/confirmInstanceApprove',


    //供应商
    SUPPLIER_SUPPLIERS_GETAVAILABLETRUE: 'supplier/suppliers/getavailabletrue',
    //供应商服务
    SUPPLIER_SERVICES_SUPPLIER: 'supplier/services/supplier',
    //应用基线
    CITIC_USER_APP_BASES: 'citicUser/app-bases',
    //成本中心
    CITIC_USER_GET_COST_CENTER_OFFICE_LIST: 'citicUser/getCostCenterOfficeList',
    //实例列表
    SRVMGT_GET_COST_CENTER_OFFICE_LIST: 'srvmgt/getInstanceNewList',
    //实例明细
    SRVMGT_GET_INSTANCE_NEW_DETAIL: 'srvmgt/getInstanceNewDetail',
    //租户查询
    CITIC_USER_GET_TENANT_LIST: 'citicUser/getTenantList',
    // optionsKey列表
    CITIC_SERVICE_OPTIONSKEY_LIST: 'citicServiceConfig/optionsKey/page',
    // optionsKey新增
    CITIC_SERVICE_OPTIONSKEY: 'citicServiceConfig/optionsKey',
    // 新增action
    CITIC_SERVICE_CONFIG_ACTION: 'citicServiceConfig/action',
    // 删除action
    CITIC_SERVICE_CONFIG_ACTION_DELETEID: 'citicServiceConfig/action',
    // 通过serviceId查询key
    CITIC_SERVICE_CONFIG_OPTIONS_KEY_SERVICE_ID: 'citicServiceConfig/optionsKey/serviceId',
    // 查询指定service下action
    CITIC_SERVICE_CONFIG_ACTION_SERVICE_ID: 'citicServiceConfig/action/serviceId',
    // optionsKey编辑页面类型列表
    CITIC_OPTIONSKEY_TYPELIST: 'citicServiceConfig/optionsKeyEnum',
    // enum 操作类型即行为类型如创建/变配等
    CITIC_SERVICE_CONFIG_ACTION_TYPE_ENUM: 'citicServiceConfig/actionTypeEnum',
    // 通过id查询action详情
    CITIC_SERVICE_CONFIG_ACTION_ID: 'citicServiceConfig/action',
    // 通过actionId查询绑定key详情列表 {actionId}
    CITIC_SERVICE_CONFIG_OPTIONS_KEY_ACTION_ID: 'citicServiceConfig/optionsKey/actionId/#{0}?available=1',
    // 根据keyId查询value {keyId}
    CITIC_SERVICE_CONFIG_OPTIONS_VALUE_KEY_ID: 'citicServiceConfig/optionsValue/keyId/#{0}?available=1',
    // 树形更新、查询接口
    CITIC_SERVICE_CONFIG_OPTIONS_RELATION_TREE: 'citicServiceConfig/options/relation/tree',
    // 根据keyId查询value
    CITIC_SERVICE_CONFIG_OPTIONS_VALUE: 'citicServiceConfig/optionsValue',
    // 操作绑定key
    CITIC_SERVICE_CONFIG_ACTION_OPTIONS: 'citicServiceConfig/actionOptions',
    // 通过actionId查询action_options详情
    CITIC_SERVICE_CONFIG_ACTION_OPTIONS_ACTION_ID: 'citicServiceConfig/actionOptions/actionId',
    //  enum value类型
    CITIC_SERVICE_CONFIG_OPTIONS_VALUE_ENUM: 'citicServiceConfig/optionsValueEnum',

    // 订单列表
    ORDER: 'order',
    // 订单详情
    ORDER_PURCHASE: 'order/purchase/#{0}',
    // 订单调价记录
    ORDER_ADJUST_PRICE_LOG: 'order/adjust-price-log/#{0}',
    // 订单调价记录
    ORDER_ADJUST_PRICE: 'order/adjust-price',
    // 导出实例列表
    INSTANCE_DOWNLOAD: "instance/download",
    //  文件上传
    COMMON_UPLOAD_CREDIT_LINES_ADJUST: 'common/upload/CreditLinesAdjust',
    //  文件删除
    COMMON_DELETE_FILE: 'common/delete-file',
    //  现金账户明细回退记录
    CITIC_ACCOUNT_CASH_DETAIL_REFUND: 'citic-account/cash-detail-refund',
    // 回退资金
    CITIC_ACCOUNT_CASH_DETAIL_REFUND_REFUND:'citic-account/cash-detail-refund/refund',
    // 根据ID集合（如：ID1,ID2）查询支付明细列表
    CITIC_ACCOUNT_BILL_DETAIL_FOR_LIST:'citic-account/bill/detail-for-list',

    //  查询待确认收入列表  &&  手工录入收入信息
    CITIC_BEDC_INCOME_WAIT_CONFIRM: 'citic-bedc/income-wait-confirm',
    //  查询所有租户账号
    CITIC_BEDC_BANK_ACCOUNTS_ALL: 'citic-bedc/bank-accounts/all',
    //  关闭入账
    CITIC_BEDC_INCOME_WAIT_CONFIRM_CLOSED_ACCOUNTING: 'citic-bedc/income-wait-confirm/closed-accounting',
    //  确认入账
    CITIC_BEDC_INCOME_WAIT_CONFIRM_CONFIRMED_ACCOUNTING: 'citic-bedc/income-wait-confirm/confirmed-accounting',
    //  删除手工录入数据
    CITIC_BEDC_CLOSED_ACCOUNTING_DEL: 'citic-bedc/closed-accounting/del',

    //  额度调整申请列表 && 申请调整信用额度
    CITIC_ACCOUNT_CREDIT_ADJUST: 'citic-account/credit/adjust',
    //  审批信用额度调整申请
    CITIC_ACCOUNT_CREDIT_ADJUST_APPROVE: 'citic-account/credit/adjust/approve',
    //  撤销信用额度调整申请
    CITIC_ACCOUNT_CREDIT_ADJUST_CANCEL: 'citic-account/credit/adjust/cancel',
     // 根据key获得value
    CITIC_SERVICE_CONFIG_OPTIONSVALUE_KEYID:'citicServiceConfig/optionsValue/keyId/KEYID',
    // 刷新刷新citic-food库的adapter_service_config表数据
    CITIC_ADAPTER_SERVICE_CONFIG_REFRESH:'adapter/service/config/refresh',
    // 文件上传通用接口
    COMMON_UPLOAD_FILE_BUSINESS: "common/upload-file/#{0}",
    // 查询线下实例审批记录
    CITIC_GENERAL_ADAPTER_GET_INSTANCE_APPROVE_LOG: "citicGeneralAdapter/get-instance-approve-log",

    // 取消订单确认弹窗文件上传接口
    CITIC_CANCEL_ORDER_UPLOAD: "common/upload/OrderCancel",

    // 确认取消订单接口
    CITIC_CONFIRM_CANCLE_ORDER: "order/order/cancel",

    // 取消交付中的实例
    CITIC_CANCEL_INSTANCE_APPROVE: "citicGeneralAdapter/cancelInstance",
    //   数据刷新
    FRESH: 'fresh',
    // 发票管理列表
    INVOICE_GET_INVOICE_INFO_PAGE:'invoice/getInvoiceInfoPage',
    //  发票详情
    INVOICE_PAYMENT:'invoice/payment',
    //   发票详情列表
    INVOICE_PAYMENT_SERVICE_BILL_LIST:'invoice/payment/service-bill/list',
    //  查看发票信息
    INVOICE_INVOICE_CONFIG:'invoice/invoiceConfig',
    //  确认复核
    INVOICE_CHECK_INVOICE_INFO:'invoice/checkInvoiceInfo',
    //  确认开票
    INVOICE_CONFIRM_INVOICE_INFO:'invoice/confirmInvoiceInfo',
    //  导出发票邮寄模版信息
    INVOICE_INVOICE_EXPRESS_TEMPLATE_EXPORT:'invoice/invoiceExpressTemplateExport',
    // 导出发票信息
    INVOICE_INVOICE_INFO_EXPORT:'invoice/invoiceInfoExport',
    // 导出发票配置信息
    INVOICE_INVOICE_CONFIG_EXPORT:'invoice/invoiceConfigExport',
    //  更新备注信息
    INVOICE_SUBMIT_INVOICE_REMARKS:'invoice/submitInvoiceRemarks',
    //  查询发票基本信息
    INVOICE_GET_INVOICE_INFO_BYID:'invoice/getInvoiceInfoById',
    //  导入邮寄信息
    INVOICE_INVOICE_EXPRESS_IMPORT:'invoice/invoiceExpressImport',
    //  收款管理列表
    RECEIVABLES:'receivables',
    //  修改调账金额
    RECEIVABLES_ADJUST:'receivables/adjust',
    //  导出收款通知书
    RECEIVABLES_FILE:'receivables/file',
    //  发送通知书
    RECEIVABLES_SEND_GATHERING_NOTICE:'receivables/sendGatheringNotice',
    //  关闭发送
    RECEIVABLES_CANCEL_SEND_NOTICE:'receivables/cancel-send-notice',
    //  关闭调账
    RECEIVABLES_ADJUST_CLOSE:'receivables/adjust-close',
    //  是否可以关闭调账
    RECEIVABLES_ADJUST_STATUS:'receivables/adjust-status',
    //  所有租户
    CITIC_USER_TENANTS:'citic/user/tenants',
    //  是否有发送中
    RECEIVABLES_CHECK_SEND_STATUS:'receivables/check/send-status',
    // 收款管理详情列表
    RECEIVABLES_SERVICE_BILL:'receivables/service-bill',
    //  折扣列表
    CITIC_ACCOUNT_ELEDISCOUNT_PAGE_LIST:'citic-account/elediscount/pageList',

};

export {
    API,
    APIInterface
}
