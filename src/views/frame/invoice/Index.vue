<style lang="scss" scoped>
    .rightBtn {
        text-align: right;
    }

    .rightBtn button {
        margin-right: 20px;
    }

    .rightBtn button:last-child {
        margin-right: 0;
    }
    .upload-progress-bar {
        position: absolute;
        display: inline-block;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0;
        transition: .3s;
    }
    .operationBtn {
        margin-top: 20px;
    }
    .uploadBtn {
        color: #515a6e
    }
    /deep/.ivu-upload-list{
        display: none;
    }
</style>

<template>
    <Card title="发票管理">
        <ci-search-panel :searchFormConfig="searchFormConfig" :add="false" @search="mxDoSearch"></ci-search-panel>
        <Form class="operationBtn">
            <Row>
                <Col span="10">
                    <Form-item>
                        <Button type="primary" style="margin: 0 20px" @click="openModal(1)"
                                  :disabled="!hasCheckableFlag">确认复核
                        </Button>
                        <Button type="success" @click="openModal(2)" :disabled="!hasInvoiceFlag">确认开票</Button>
                        <Modal v-model="confirmCheckModal" :title="modalTitle" @on-ok="handleCheck"
                               @on-cancel="cancelCheck">
                            <p>{{modalText}}</p>
                        </Modal>
                    </Form-item>
                </Col>
                <Col span="14" class="rightBtn">
                    <Form-item>
                        <Button @click="exportInvoiceExpressTemplate">导出邮寄信息模板</Button>
                        <Upload :action="uploadUrl" :headers="headers" :on-success="upLoadSuccess" :on-error="upLoadError"
                                :before-upload="beforeUpload"
                                :on-format-error="handleFormatError" :format="['xls','xlsx']"
                                style="display: inline-block;margin-right: 20px;">
                            <Button class="uploadBtn">导入邮寄信息</Button>
                        </Upload>
                        <Button @click="exportInvoiceInfo">导出发票信息</Button>
                        <Button @click="exportInvoiceConfig">导出发票配置信息</Button>
                    </Form-item>
                </Col>
            </Row>
        </Form>

        <Table :columns="columns" :data="listData" :loading="loading" @on-selection-change='selectionChange'></Table>

        <Page class="list-page"
              :total="total"
              :current="pageIndex"
              :pageSize="pageSize"
              :page-size-opts="pageSizeOpts"
              show-total
              show-sizer
              show-elevator
              @on-change="mxChangePage"
              @on-page-size-change="mxChangePageSize"
        ></Page>
    </Card>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {ListMixin} from '../../../mixin'

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        searchParam = {
            tenantName:'',
            applyStatus:'',
            invoiceStatus:'',
            startMonth:'',
            endMonth:'',
    };

        columns = [
            {
                type: "selection",
                width: 60,
                align: "center"
            },
            {
                key: "tenantName",
                title: "租户名称"
            },
            {
                key: "billMonth",
                title: "账期月"
            },
            {
                title: "发票金额",
                key: "actualAmount",
                render: (h, params) => {
                    const {actualAmount, remarks} = params.row
                    let num = h("span", {}, (Number(actualAmount) / 1000).toFixed(2))
                    let text = h('Tooltip', {
                        props: {placement: "right"}
                    }, [
                        h('Icon', {
                            props: {
                                type: params.row.remarks ? 'ios-chatbubbles' : ''
                            },
                            style: {
                                cursor: 'pointer',
                                fontSize: '18px',
                                marginLeft: '5px'
                            }
                        }),
                        h('span', {slot: 'content', style: {whiteSpace: 'normal', wordBreak: 'break-all'}}, remarks)
                    ])
                    let dataArr: Array<any> = [];
                    dataArr.push(num)
                    if (remarks) {
                        dataArr.push(text)
                    }
                    return h('div',{}, dataArr)
                }
            },
            {
                title: "申请状态",
                render: (h, params) => {
                    const _status = params.row.applyStatus;
                    let _statusText = "";
                    let _statusColor = "";
                    if (_status == 0) {
                        _statusText = "未申请";
                        _statusColor = "#65b5ff";
                    } else {
                        _statusText = "已申请";
                        _statusColor = "#5b616e";
                    }
                    return [h("span", {style: {color: _statusColor}}, _statusText)];
                }
            },
            {
                key: "invoiceType",
                title: "发票类型",
                render: (h, params) => {
                    let _invoiceTypeText;
                    let invoiceType = params.row.invoiceType
                    if (invoiceType == '0') {
                        _invoiceTypeText = '专用发票';
                    } else if (invoiceType == '1') {
                        _invoiceTypeText = '普通发票';
                    } else {
                        _invoiceTypeText = '';
                    }
                    return [h("span", {}, _invoiceTypeText)];
                }
            },
            {
                title: "开票状态",
                render: (h, params) => {
                    switch (params.row.invoiceStatus) {
                        case "1":
                            return h("span", "待复核");
                            break;
                        case "2":
                            return h("span", "待开票");
                            break;
                        case "3":
                            return h("span", "已开票");
                            break;
                        case "4":
                            return h("span", "已邮寄");
                            break;
                    }
                }
            },
            {
                key: "info",
                title: "邮寄信息",
                render: (h, params) => {
                    return [h("span", {}, params.row.expressNo)];
                }
            },
            {
                title: "操作",
                align: "center",
                key: "action",
                render: (h, params) => {
                    return [
                        h(
                            "Button",
                            {
                                on: {
                                    click: () => {
                                        const {tenantName, tenantId, billMonth, invoiceStatus, applyStatus, id} = params.row
                                        this.mxToDetail({
                                            tenantName,
                                            tenantId,
                                            billMonth,
                                            invoiceStatus,
                                            applyStatus,
                                            id,
                                        })
                                    }
                                }
                            },
                            "查看详情"
                        )
                    ];
                }
            }
        ];

        searchFormConfig = [
            {
                type: 'input',
                key: 'tenantName',
                label: '按租户',
                placeholder: '请输入租户名称',
                defaultValue: function () {
                    return ""
                }
            },
            {
                type: 'select',
                key: 'applyStatus',
                label: '按申请状态',
                placeholder: '请选择',
                defaultValue: 'all',
                constValue: [
                    {key: 'all', value: '全部'},
                    {key: '0', value: '未申请'},
                    {key: '1', value: '已申请'}
                ]
            },
            {
                type: 'select',
                key: 'invoiceStatus',
                label: '按开票状态',
                placeholder: '请选择',
                defaultValue: 'all',
                constValue: [
                    {key: 'all', value: '全部'},
                    {key: '1', value: '待复核'},
                    {key: '2', value: '待开票'},
                    {key: '3', value: '已开票'},
                    {key: '4', value: '已邮寄'}
                ]
            },
            {
                type: 'monthrange',
                key: '_month_',
                keys: ['_month_', 'startMonth', 'endMonth'],
                label: '按年/月查询',
                dateOptions: [
                    {
                        disabledDate: (date) => this.mxGetTimeOperation('startMonth', 'endMonth', true, date)
                    }, {
                        disabledDate: (date) => this.mxGetTimeOperation('startMonth', 'endMonth', false, date)
                    }
                ]
            }
        ]

        searchAPI:string = this.$API_ENUM.INVOICE_GET_INVOICE_INFO_PAGE;
        uploadUrl: string = this.$CONFIG.BASE_API_URL + this.$API_ENUM.INVOICE_INVOICE_EXPRESS_IMPORT;
        headers: object = {
            'citic-token': this.$getSession('citic-token')
        };
        editPath:string = "detail";
        selectionIds:Array<any> = []
        selectItems: Array<any> = [];  // 用于导出发票信息按钮（表格中选中了哪项）
        confirmCheckModal = false  // 确认复核弹窗
        modalTitle = "确认复核"
        modalText = "是否复核"
        hasCheckableFlag = false  // 能否点击确认复核标志
        hasInvoiceFlag = false  // 能否点击确认开票标志
        isPostable = true  // 导出邮寄信息模板
        selectionData = []


        created() {
        }

        mounted() {
            // this.$Message.config({
            //     duration: 10
            // });
        }


        mxFormSearchData(searchParam){
            const {startMonth,endMonth,applyStatus,invoiceStatus} = searchParam
            if(startMonth){
                searchParam.startMonth = new Date(startMonth).Format("yyyyMM")
            }
            if(endMonth){
                searchParam.endMonth = new Date(endMonth).Format("yyyyMM")
            }
            if(applyStatus === 'all'){
                delete searchParam.applyStatus
            }
            if(invoiceStatus === 'all'){
                delete searchParam.invoiceStatus
            }
            return searchParam
        }


        upLoadSuccess(response, file, fileList) {
            this.loading = false;
            //上传成功的回调
            if (response.code == '200') {
                this.$Message.success(response.data)
                this.mxDoSearch(this.searchParam)
            } else {
                this.$Message.error(response.message)
            }
        };

        upLoadError(error, file, fileList) {
            //上传失败的回调
            this.$Message.error("上传失败");
            this.loading = false;
            console.log(error, file, fileList);
        };

        beforeUpload() {
            this.loading = true;
        };

        // 上传的格式不正确
        handleFormatError(file) {
            this.$Message.warning('导入文档格式不匹配，仅支持xls和xlsx文档');
        };

        // 导出发票邮寄模版信息
        exportInvoiceExpressTemplate() {
            // 判断是选中表格数据导出，还是通过筛选条件导出（筛选条件为已开票或已邮寄才可以导出）
            // 如果没有选中数据，就判断当前表格数据是否含有不符合条件的
            if (this.selectionData.length == 0) {
                for (let i of this.listData) {
                    if (i.invoiceStatus != '3' && i.invoiceStatus != '4') {
                        this.$Message.warning("有不可导出邮寄信息模板数据");
                        return;
                    }
                }
            }
            if (
                this.isPostable ||
                this.searchParam.invoiceStatus == "3" ||
                this.searchParam.invoiceStatus == "4"
            ) {
                this.export(
                    this.$API_ENUM.INVOICE_INVOICE_EXPRESS_TEMPLATE_EXPORT,
                    this.selectionIds
                );
            } else {
                this.$Message.warning("有不可导出邮寄信息模板数据");
            }

        };

        // 导出发票信息
        exportInvoiceInfo() {
            this.export(
                this.$API_ENUM.INVOICE_INVOICE_INFO_EXPORT,
                this.selectItems
            );
        };

        // 导出发票配置信息
        exportInvoiceConfig() {
            this.$downloadFileByUrl(this.$CONFIG.BASE_API_URL + this.$API_ENUM.INVOICE_INVOICE_CONFIG_EXPORT);
        };

        // 表格复选框事件
        selectionChange(items) {
            this.selectionIds = []; // 初始化选中的id数组
            this.hasCheckableFlag = false; // 可复核的标志变量为false，即不可点击可复核按钮
            this.hasInvoiceFlag = false; // 可开票的标志变量为false，即不可点击可开票按钮
            this.isPostable = false; // 可导出邮寄信息模板标志变量为false，即不可点击导出邮寄信息模板按钮
            this.selectionData = items // 选中数据
            this.selectItems = []; // 用于导出发票信息按钮的数据
            if (items.length == 0) { // 什么都没选中时，标志变量都制为false
                this.hasCheckableFlag = false;
                this.hasInvoiceFlag = false;
                this.isPostable = true; // 如果什么都没选中，默认可以导出邮寄信息模板
            } else {
                // 确认复核和确认开票逻辑
                let selectStatus: Array<any> = []; // 临时数组，判断是否选中的数据都是同一种状态
                for (let i of items) {
                    selectStatus.push(i.invoiceStatus);
                    this.selectItems.push(i.id);
                }
                selectStatus = this.uniq(selectStatus); // 判断选中的是否选中的都是待复核或者待开票状态数据
                if (selectStatus.length == 1) {
                    if (selectStatus[0] == "1") {
                        this.hasCheckableFlag = true;
                        for (let i of items) {
                            this.selectionIds.push(i.id);
                        }
                    } else if (selectStatus[0] == "2") {
                        this.hasInvoiceFlag = true;
                        for (let i of items) {
                            this.selectionIds.push(i.id);
                        }
                    }
                } else {
                    console.log("不可复核或开票");
                }
                // 导出按钮逻辑
                for (let i of items) {
                    // 判断选中的是否是已复核或者已邮寄数据，否则不可导出
                    if (i.invoiceStatus == "3" || i.invoiceStatus == "4") {
                        this.selectionIds.push(i.id);
                    } else {
                        this.isPostable = false;
                        return false;
                    }
                }
                this.isPostable = true;
            }
        };

        // 打开复核或开票弹窗
        openModal(flag) {
            if (flag == 1) {
                this.modalTitle = "确认复核";
                this.modalText = "是否复核";
            } else {
                this.modalTitle = "确认开票";
                this.modalText = "是否开票";
            }
            this.confirmCheckModal = true;
        };

        // 确认复核或开票
        handleCheck() {
            let selectionIds = this.selectionIds.join(",");
            if (this.modalTitle == "确认复核") {
                this.$get(this.$API_ENUM.INVOICE_CHECK_INVOICE_INFO,{ids:selectionIds}
                ).then(res => {
                    if (res.code == "200") {
                        this.$Message.success('确认复核成功');
                        this.mxDoSearch(this.searchParam)
                        this.hasCheckableFlag = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            } else if (this.modalTitle == "确认开票") {
                this.$get(this.$API_ENUM.INVOICE_CONFIRM_INVOICE_INFO,{ids:selectionIds}
                ).then(res => {
                    if (res.code == "200") {
                        this.$Message.success('确认开票成功');
                        this.mxDoSearch(this.searchParam)
                        this.hasInvoiceFlag = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            }
        };

        // 取消
        cancelCheck() {
        };

        // 数组去重，为了判断选中数据是否都是同一个状态的（待开票、待复核）
        uniq(array: Array<any>) {
            var temp:Array<any> = []; // 一个新的临时数组
            for (let i = 0; i < array.length; i++) {
                if (temp.indexOf(array[i]) == -1) {
                    temp.push(array[i]);
                }
            }
            return temp;
        };

        // 导出函数
        export(url, ids) {
            if (
                !this.listData ||
                !this.columns ||
                this.listData.length == 0 ||
                this.columns.length == 0
            ) {
                this.$Message.warning("暂无数据导出");
                return;
            }
            // 判断是选中表格数据导出，还是通过筛选条件导出（筛选条件为已开票或已邮寄才可以导出）
            const {tenantName, startMonth, endMonth, applyStatus, invoiceStatus} = this.searchParam
            let exportUrl = url;
            var ids = ids.join(",");
            this.$downloadFileByUrl(this.$CONFIG.BASE_API_URL + exportUrl+"?tenantName=" +
                tenantName +
                "&startMonth=" +
                startMonth +
                "&endMonth=" +
                endMonth +
                "&applyStatus=" +
                applyStatus +
                "&invoiceStatus=" +
                invoiceStatus +
                "&ids=" +
                ids);

        }

    }
</script>