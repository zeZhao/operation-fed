<style lang="scss" scoped>
    .billBox {
        overflow: hidden;
        padding: 20px;
        box-sizing: border-box;
        border: 1px solid #dddee1;
        border-top: none;
    }

    .billBox ul {
        float: right;
        margin-top: 20px;
    }

    .billBox ul li label {
        display: inline-block;
        width: 110px;
        text-align: right;
        margin-right: 15px;
    }

    .btnBox {
        text-align: right;
        margin-top: 20px;
    }

    .btnBox button {
        margin-right: 20px;
    }

    .btnBox button:last-child {
        margin-right: 0;
    }

    .successText {
        padding: 9px 20px;
        color: #fff;
        background-color: #19be6b;
        border-color: #19be6b;
        border-radius: 4px;
        font-size: 12px;
        line-height: 1.5;
        font-weight: 400;
        margin-right: 20px;
    }

    .clearfix:after {
        display: block;
        content: "";
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }

    ul,
    ol {
        list-style: none;
    }

    .infoTitle {
        display: block;
        border-bottom: 1px solid #e9eaec;
        font-size: 16px;
        color: #1c2438;
        margin: 10px 0;
        font-weight: bold;
    }

    .noFooter .ivu-modal-footer {
        display: none;
    }

    .infoMoadlContainer ul li {
        padding: 10px 0;
    }

    .infoMoadlContainer ul li label {
        display: inline-block;
        width: 110px;
        text-align: right;
        margin-right: 15px;
    }

    .addRemarkModal .ivu-modal-footer {
        border-top: none;
    }
    .addRemarkModal .ivu-modal-close {
        display: none;
    }
    /deep/.table-last-row{
        height: 200px;
    }
</style>

<template>
    <Card>
        <p slot="title">
            发票管理
        </p>

        <Row>
            <Col span="8" style="height: 30px;line-height: 30px">
                <span class='label'>租户名称：</span>
                <span class='value'>{{tenantName}}</span>
            </Col>
            <Col span="8" style="height: 30px;line-height: 30px">
                <span class='label'>收款账期月：</span>
                <span class='value'>{{searchParam.accountPeriod}}</span>
            </Col>
            <Col span="8" style="text-align: right">
                <Button @click="viewInvoiceInfo">查看开票信息</Button>
            </Col>
            <Modal v-model="showModel1" class-name="noFooter">
                <div class="infoMoadlContainer">
                    <span class="infoTitle">开票信息</span>
                    <ul>
                        <li v-for="(item, index) in infoData" :key="index">
                            <label>{{item.label}}:</label>
                            <span>{{item.value}}</span>
                        </li>
                    </ul>
                    <span class="infoTitle">联系人信息</span>
                    <ul>
                        <li v-for="(item, index) in infoData2" :key="index">
                            <label>{{item.label}}:</label>
                            <span>{{item.value}}</span>
                        </li>
                    </ul>
                </div>
                <div slot="footer"></div>
            </Modal>
            <Modal v-model="showModel2" class-name="addRemarkModal" title="添加备注">
                <Input type="textarea" autofocus :maxlength="300" placeholder="请添加备注信息"
                         v-model="remarksVal">
                </Input>
                <div slot="footer">
                    <Button type="primary" :disabled="!remarksVal" @click="saveRemark">确认保存</Button>
                    <Button @click="handelRemarkMoadl(false)">取消</Button>
                </div>
            </Modal>
            <Modal v-model="confirmCheck" :title="modalTitle" @on-ok="handleCheck" @on-cancel="cancelCheck">
                <p>{{modalText}}</p>
            </Modal>
        </Row>
        <Table :row-class-name="rowClassName" :columns="columns" :data="listData" max-height="680" :loading='loading'
                 class='mt-20' style="margin-top: 20px"></Table>
        <div class="btnBox">
            <Button type="primary" style="float: left;" @click="handelRemarkMoadl(true)">备注信息</Button>
            <Button type="primary" v-if="invoiceStatus == '1'" @click="openModal(1)">确认复核</Button>
            <Button type="primary" v-if="invoiceStatus == '2'" @click="openModal(2)">确认开票</Button>
            <span v-if="invoiceStatus == '3' || invoiceStatus == '4'" class="successText">已复核</span>
            <span v-if="invoiceStatus == '3' || invoiceStatus == '4'" class="successText">已开票</span>
            <Button @click="goBack">返回</Button>
        </div>
    </Card>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {ListMixin} from '../../../mixin'

    @Component({
        components: {},
    })
    export default class extends ListMixin {
        searchParam:any ={
            tenantId:'',
            accountPeriod:''
        }
        tenantName:any = '';
        invoiceStatus:any= '';
        applyStatus:any= '';
        id:any= '';


        loading:boolean = false
        dataUrl:string = ''
        listDataUrl:string = '';
        params = {

        };
        columns = [
            {
                title: '序号',
                key: "index"
            },
            {
                title: '服务名称',
                key: "serviceName"
            },
            {
                title: '账期月',
                key: "accountPeriod"
            },
            {
                title: '发票金额',
                render: (h, params) => {

                    if(params.row.type != 'total') {
                        return h("span", {}, (Number(params.row.totalPrice) / 1000).toFixed(2))
                    }

                    function textCreatde(title, value, fontWeight = 'normal', otherFix = '') {
                        return h("p", {
                            style: {
                                fontWeight: fontWeight,
                                fontSize: '14px',
                                marginTop: '4px'
                            }
                        }, `${title}：${otherFix}${(Number(value) / 1000).toFixed(2)}`)
                    }

                    let {billAmount, discountAmount, actualAmount} = params.row.totalObj
                    let discountAmountText = ''
                    if (discountAmount > 0) {
                        discountAmountText = '+'
                    }

                    return h("span", [
                        textCreatde('总计金额', billAmount, 'bold'),
                        textCreatde(discountAmount > 0 ? '调整金额' : '优惠金额', discountAmount, 'normal', discountAmountText),
                        textCreatde('实际开票金额', actualAmount, 'bold'),
                    ])
                }
            }
        ]
        listData:Array<any> = [];
        remarksVal:string = "";
        showModel1:boolean = false; // 开票信息弹窗
        showModel2:boolean = false; // 备注信息弹窗
        confirmCheck:boolean = false// 确认复核弹窗
        modalTitle:string = "确认复核";
        modalText:string = "是否复核"
        infoData:Array<any> = [];
        infoData2:Array<any> = [];
        billData = {
                billAmount: 0,
                discountAmount: 0,
                actualAmount: 0
            }
        hasCheckableFlag:boolean = false;
        hasInvoiceFlag:boolean = false;
        searchAPI:string = this.$API_ENUM.INVOICE_PAYMENT_SERVICE_BILL_LIST;

    created() {
        this.$nextTick(()=>{
            const {tenantId,tenantName,billMonth,invoiceStatus,applyStatus,id} = this.$route.query
            this.searchParam.tenantId = tenantId
            this.searchParam.accountPeriod = billMonth
            this.tenantName = tenantName
            this.invoiceStatus = invoiceStatus
            this.applyStatus = applyStatus
            this.id = id
        })

        this.mxGetList()
    }

    mxListUpdate(){
        const {tenantId,accountPeriod} = this.searchParam
        if (this.listData.length == 0) {
            return
        }
        // 表格底部数据
        this.$get(`${this.$API_ENUM.INVOICE_PAYMENT}/${tenantId}/${accountPeriod}`).then((res:any) => {
            // debugger;
            if (res.code = 200) {
                if (res.data) {
                    let newObj = {
                        type: 'total',
                        totalObj: res.data
                    }
                    this.$nextTick(()=>{
                        this.listData.push(newObj)
                        this.rowClassName(newObj,this.listData.length-1)
                    })
                }
            } else {
                this.$Message.error(res.message)
            }
        })
    }
        rowClassName(row, index){
            if (this.listData.length > 1) {
                if (index == this.listData.length - 1) {
                    return 'table-last-row'
                }
            }
        }
    // 查看开票信息
    viewInvoiceInfo() {
        const {tenantId} = this.searchParam
        this.$get(this.$API_ENUM.INVOICE_INVOICE_CONFIG,{tenantId:tenantId}).then(res => {
            if (res.data) {
                let data = res.data;
                this.infoData = [
                    {
                        label: "发票抬头",
                        value: data.invoiceTitle
                    },
                    {
                        label: "开户账号",
                        value: data.bankNo
                    },
                    {
                        label: "开户银行名称",
                        value: data.bankName
                    },
                    {
                        label: "注册电话",
                        value: data.companyTelephone
                    },
                    {
                        label: "公司注册地址",
                        value: data.companyAddr
                    },
                    {
                        label: "统一社会信用代码",
                        value: data.identificationNo
                    }
                ];
                this.infoData2 = [
                    {
                        label: "联系人姓名",
                        value: data.contactsName
                    },
                    {
                        label: "联系地址",
                        value: data.contactsAddr
                    },
                    {
                        label: "联系电话1",
                        value: data.contactsTelephone
                    },
                    {
                        label: "联系电话2",
                        value: data.contactsExtTelophone
                    },
                    {
                        label: "邮箱地址",
                        value: data.email
                    }
                ];
                this.showModel1 = true;
            } else {
                this.$Message.warning("暂无开票信息");
            }
        });
    }
    // 打开或者关闭备注信息对话框
    handelRemarkMoadl(flag) {
        if (flag) {
            let id = this.id;
            this.$get(this.$API_ENUM.INVOICE_GET_INVOICE_INFO_BYID,{id:id}
            ).then(res => {
                this.remarksVal = res.data.remarks ? res.data.remarks : ''
            });
        }
        this.showModel2 = flag;
    }
    // 保存备注
    saveRemark() {
        let id = this.id
        let remarks = this.remarksVal
        this.$get(this.$API_ENUM.INVOICE_SUBMIT_INVOICE_REMARKS,{id:id,remarks:remarks}
        ).then(res => {
            this.$Message.success(res.data);
        });
        this.showModel2 = false;
    }
    
    // 返回
    goBack() {
        window.history.go(-1);
    }
    
    // 打开复核或开票弹窗
    openModal(flag) {
        if (flag == 1) {
            this.modalTitle = "确认复核";
            this.modalText = "是否复核";
        } else {
            this.modalTitle = "确认开票";
            this.modalText = "是否开票";
        }
        this.confirmCheck = true;
    }
    
    // 确认复核或开票
    handleCheck() {
        let id = this.id;
        if (this.modalTitle == "确认复核") {
            this.$get(this.$API_ENUM.INVOICE_CHECK_INVOICE_INFO,{ids:id}
            ).then(res => {
                if (res.code == "200") {
                    this.$Message.success('确认复核成功');
                    this.invoiceStatus = '2'
                } else {
                    this.$Message.error(res.message)
                }
            });
        } else if (this.modalTitle == "确认开票") {
            this.$get(this.$API_ENUM.INVOICE_CONFIRM_INVOICE_INFO,{ids:id}
            ).then(res => {
                if (res.code == "200") {
                    this.$Message.success('确认开票成功');
                    this.invoiceStatus = '3'
                } else {
                    this.$Message.error(res.message)
                }
            });
        }
    }
    // 取消
    cancelCheck() {}
    }
</script>