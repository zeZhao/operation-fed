<style lang="scss" scoped>
    .marginLeft{
        margin-left: 10px;
    }
    /deep/.ivu-modal-wrap{
        display: flex;
        align-items: center;
        justify-content: center;

        /deep/.ivu-modal{
            top: 0 !important;
        }
    }
    /deep/.modal{
        .ivu-modal-header{
            text-align: center;
            border-bottom: none;
        }
        /deep/.ivu-modal-body{
            display: none;
        }
        .ivu-modal-footer{
            width: 190px;
            margin: 0 auto;
            border-top:none;
            text-align: center;
            overflow: hidden;
            .ivu-btn-primary{
                float: left;
            }
            .ivu-btn-text{
                float: right;
                border: 1px solid #cccccc;
            }

        }
    }
</style>

<template>
    <div class="quotaManagement">
        <Card>
            <p slot="title">
                信用额度管理
            </p>

            <ci-search-panel :add="false" @add="mxToDetail" @search="mxDoSearch"
                             :searchFormConfig="searchFormConfig">
            </ci-search-panel>

            <Table :columns="columns" :data="listData" :loading="loading"></Table>

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

            <Modal v-model="approve"
                   title="调额审批"
                   class-name="vertical-center-modal">
                <span>备注：</span>
                <Input type="textarea" v-model="approveTxt" placeholder="请输入注意事项或驳回原因等，最多100字。" :maxlength="100"></Input>
                <div slot="footer" style="text-align: center">
                    <Button type="primary" @click="passBtn">通过</Button>
                    <Button @click="cancelBtn">驳回</Button>
                </div>
            </Modal>
            <Modal title="您确定要撤回调额申请吗？" v-model="withdraw" @on-ok="withdrawBtn" class-name="modal"></Modal>
            <Modal title="您确定要审批【通过】吗？" v-model="transit" @on-ok="transitBtn" class-name="modal"></Modal>
            <Modal title="您确定要审批【驳回】吗？" v-model="reject" @on-ok="rejectBtn" class-name="modal"></Modal>
        </Card>
    </div>

</template>

<script lang="ts">
    import {ListMixin} from '../../../mixin';
    import expandRow from '../../../components/credit/table-expand.vue';

    import {Component} from 'vue-property-decorator';

    @Component({
        components: {
            'expandRow': expandRow
        },
    })
    export default class extends ListMixin {

        searchParam = {
            approveStatus: '0',
            tname: '',
            status: '0',
            id: '',
            applyUserName: '',
            outfulStartCreditLines: '',
            outfulEndCreditLines: '',
            applyStartDate: '',
            applyEndDate: '',
        };

        user:any = this.$getSession('citic-user');
        approve:boolean = false
        withdraw:boolean = false
        transit:boolean = false
        reject:boolean = false

        approveTxt:string = ''


        searchFormConfig: Array<SearchConfigItem> = [
             {
                type: 'select',
                key: 'approveStatus',
                label: '审批状态',
                defaultValue: '0',
                clearable: false,
                constValue: [
                    {
                        key: '0',
                        value: '全部',
                    }, {
                        key: 'waitApprove',
                        value: '待审批',
                    }, {
                        key: 'approve',
                        value: '审批通过',
                    },{
                        key: 'disApprove',
                        value: '审批驳回',
                    },
                ]
            },{
                type: 'input',
                key: 'tname',
                label: '租户名称',
                placeholder: '请输入租户名称',
            },
            {
                type: 'select',
                key: 'status',
                label: '账户状态',
                defaultValue: '0',
                clearable: false,
                constValue: [
                    {
                        key: '0',
                        value: '全部',
                    }, {
                        key: 'normal',
                        value: '正常',
                    }, {
                        key: 'freeze',
                        value: '冻结',
                    },
                ]
            },{
                type: 'input',
                key: 'id',
                label: '调额流水号',
                placeholder: '请输入调额流水号',
            }, {
                key: '_creditExceed_',
                type: 'numberRange',
                keys: ['_creditExceed_', 'outfulStartCreditLines', 'outfulEndCreditLines'],
                label: '超出额度',
            }, {
                key: '_application_',
                type: 'daterange',
                keys: ['_application_', 'applyStartDate', 'applyEndDate'],
                label: '申请时间',
            }, {
                type: 'input',
                key: 'applyUserName',
                label: '申请人',
                placeholder: '请输入申请人',
            },
        ];

        columns = [
            {
                type: 'expand',
                width: 50,
                render: (h, params) => {
                    return h(expandRow, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
            {
                title: '调额流水号',
                width: '170',
                key: 'id'
            },
            {
                title: '申请人',
                width: '150',
                key: 'applyUserName'
            },
            {
                title: '租户名称',
                width: '210',
                key: 'tname'
            },
            {
                title: '申请前额度',
                width: '150',
                key: 'sourceCreditLines',
            },
            {
                title: '当前可用额度',
                width: '150',
                key: 'usableCreditLines',
            },
            {
                title: '超出额度',
                width: '150',
                key: 'outfulCreditLines',
            },
            {
                title: '账户状态',
                width: '100',
                key: 'statusStr',
            },
            {
                title: '申请调额至',
                width: '150',
                key: 'targetCreditLines',
            },
            {
                title: '申请时间',
                width: '160',
                key: 'applyDate',
            },
            {
                title: '审批状态',
                width: '100',
                key: 'approveStatusStr',
            },
            {
                title: '操作',
                align: 'center',
                width: '150',
                render: (h, params) => {

                    if(params.row.approveStatus === 'waitApprove'){
                        const {email} = this.user
                        if(email === 'liyi5@citic.com'){
                            return [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                    },
                                    on: {
                                        click: () => {
                                            this.approveRemark(params.row)
                                        }
                                    }
                                }, '审批'),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                    },
                                    style:{
                                        "marginLeft":'10px'
                                    },
                                    // 'class':'marginLeft',
                                    on: {
                                        click: () => {
                                            this.revocation(params.row)
                                        }
                                    }
                                }, '撤回')
                            ];
                        }else if(email === 'fengcm@citic.com'){
                            return [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                    },
                                    on: {
                                        click: () => {
                                            this.approveRemark(params.row)
                                        }
                                    }
                                }, '审批'),
                            ];
                        }else if(email === 'mengxl1@citic.com'|| email === 'zhangwl1@citic.com'|| email === 'wuyue@citic.com'){
                            return [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                    },
                                    on: {
                                        click: () => {
                                            this.revocation(params.row)
                                        }
                                    }
                                }, '撤回'),
                            ];
                        }
                    }
                }
            }
        ];

        searchAPI: string = this.$API_ENUM.CITIC_ACCOUNT_CREDIT_ADJUST;
        id:string = ''

        created() {

        }

        approveRemark(val){
            this.approve = true
            this.id = val.id
        }
        revocation(val){
            this.id = val.id
            this.withdraw = true

        }
        withdrawBtn(){
            this.$put(`${this.$API_ENUM.CITIC_ACCOUNT_CREDIT_ADJUST_CANCEL}/${this.id}`).then(res=>{
                this.$Message.success('调额申请已撤回。')
                this.mxDoSearch(this.searchParam)
            })
        }
        transitBtn(){
            console.log(this.approveTxt)
            this.$put(`${this.$API_ENUM.CITIC_ACCOUNT_CREDIT_ADJUST_APPROVE}/${this.id}`,{
                approveMemo:this.approveTxt,
                approveStatus:'approve',
            }).then(res=>{
                this.$Message.success('操作成功！')
                this.approveTxt = ''
                this.mxDoSearch(this.searchParam)
            })
        }
        rejectBtn(){
            this.$put(`${this.$API_ENUM.CITIC_ACCOUNT_CREDIT_ADJUST_APPROVE}/${this.id}`,{
                approveMemo:this.approveTxt,
                approveStatus:'disApprove',
            }).then(res=>{
                this.$Message.success('操作成功！')
                this.approveTxt = ''
                this.mxDoSearch(this.searchParam)
            })
        }

        passBtn(){
            this.approve = false
            this.transit = true

        }
        cancelBtn(){
            this.approve = false
            this.reject = true
        }

        mxFormSearchData(searchParam) {
            if (searchParam.approveStatus === '0') {
                delete searchParam.approveStatus;
            }

            if (searchParam.status === '0') {
                delete searchParam.status;
            }

            if(searchParam.applyStartDate && searchParam.applyEndDate){
                searchParam.applyStartDate = new Date(new Date(searchParam.applyStartDate).Format("yyyy-MM-dd 00:00:01")).getTime()
                searchParam.applyEndDate = new Date(new Date(searchParam.applyEndDate).Format("yyyy-MM-dd 23:59:59")).getTime()
            }
        }

        mxFormListData(list) {
            return list.map(item => {
                const {status, approveStatus} = item;

                let statusStr = "";

                switch (status) {
                    case 'normal':
                        statusStr = '正常'
                        break
                    case 'freeze':
                        statusStr = '冻结'
                        break
                }

                let approveStatusStr = ''
                switch (approveStatus) {
                    case 'waitApprove':
                        approveStatusStr = '待审批'
                        break
                    case 'approve':
                        approveStatusStr = '审批通过'
                        break
                    case 'disApprove':
                        approveStatusStr = '审批驳回'
                        break
                }

                return {
                    statusStr,
                    approveStatusStr,
                    ...item
                };
            })
        }
        //校验查询参数
        mxCheckInput(searchParam) {
            const {
                outfulStartCreditLines,
                outfulEndCreditLines
            } = searchParam;

            if(!this.numberRangeCheck(outfulStartCreditLines, outfulEndCreditLines)){
                throw Error("超出额度查询参数错误");
            }
        }

        numberRangeCheck(min = '', max = '') {

            if (min && !this.checkMoney(min)) {
                return false;
            }

            if (max && !this.checkMoney(max)) {
                return false;
            }

            if (min && max) {
                if (~~min > ~~max) {
                    return false;
                }
            }

            return true;
        }

        checkMoney(money) {
            return /^\d+\.?\d{0,2}$/.test(money + "");
        }

    }

</script>