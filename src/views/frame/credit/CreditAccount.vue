<style lang="scss" scoped>

</style>

<template>
    <div class="creditAccount">
        <Card>
            <p slot="title">
                信用账户
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

        </Card>

        <div v-if="adjust">
            <ci-credit-modal v-model="adjust" :params="params" @DoSearch="mxDoSearch(searchParam)"></ci-credit-modal>
        </div>


    </div>
</template>

<script lang="ts">
    import {ListMixin} from '../../../mixin';
    import CreditModal from '../../../components/credit/CreditModal.vue';

    import {Component,Watch} from 'vue-property-decorator';

    @Component({
        components: {
            'ci-credit-modal': CreditModal
        },
    })
    export default class extends ListMixin {

        searchParam = {
            tname: '',
            status: '0',
            outfulFlag: '0',
            startCreditLines: '',
            endCreditLines: '',
            usableStartCreditLines: '',
            usableEndCreditLines: '',
            outfulStartCreditLines: '',
            outfulEndCreditLines: '',
        };

        user:any = this.$getSession('citic-user');

        searchFormConfig: Array<SearchConfigItem> = [
            {
                type: 'input',
                key: 'tname',
                label: '租户名称',
                placeholder: '请输入',
            }, {
                type: 'select',
                key: 'status',
                label: '状态',
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
            }, {
                key: '_credit_',
                type: 'numberRange',
                keys: ['_credit_', 'startCreditLines', 'endCreditLines'],
                label: '信用额度',
            }, {
                key: '_creditAble_',
                type: 'numberRange',
                keys: ['_creditAble_', 'usableStartCreditLines', 'usableEndCreditLines'],
                label: '可用额度',
            }, {
                type: 'select',
                key: 'outfulFlag',
                label: '是否超额',
                defaultValue: '0',
                clearable: false,
                constValue: [
                    {
                        key: '0',
                        value: '全部',
                    }, {
                        key: 'true',
                        value: '是',
                    }, {
                        key: 'false',
                        value: '否',
                    },
                ]
            }, {
                key: '_creditExceed_',
                type: 'numberRange',
                keys: ['_creditExceed_', 'outfulStartCreditLines', 'outfulEndCreditLines'],
                label: '超出额度',
            },
        ];

        columns = [
            {
                title: '租户名称',
                width: '150',
                key: 'tname'
            },
            {
                title: '信用额度',
                width: '150',
                key: 'creditLines'
            },
            {
                title: '现金余额',
                width: '150',
                key: 'cashAccountBalance'
            },
            {
                title: '未结清金额',
                width: '150',
                key: 'outstandingAmt',
            },
            {
                title: '已消耗信用额度',
                width: '150',
                key: 'consumedCreditLines',
            },
            {
                title: '可用信用额度',
                width: '200',
                key: 'usableCreditLines',
            },
            {
                title: '账户状态',
                width: '150',
                key: 'statusStr',
            },
            {
                title: '是否超额',
                width: '100',
                key: 'outfulFlagStr',
            },
            {
                title: '超出额度',
                width: '150',
                key: 'outfulCreditLines',
            },
            {
                title: '最后更新时间',
                width: '150',
                key: 'statisticsTime',
            },
            {
                title: '操作',
                align: 'center',
                width: '200',
                render: (h, params) => {

                    // 按钮可点击
                    let click = true;
                    let amount = true

                    // 已经冻结 -- 一定是不可操作
                    if(params.row.status === 'freeze'){
                        click = false;
                    }else {
                        // 没冻结，有超额 或者 有逾期 其中一种情况则可以操作
                        // 否则不可操作

                        // 有超额 或者 有逾期
                        click = params.row.outfulFlag || params.row.overdueFlag;
                    }
                    params.row.applyAdjustCreditLinesFlag ? amount = false : amount = true

                    const {email} = this.user
                    if(email === 'liyi5@citic.com' || email === 'mengxl1@citic.com'|| email === 'zhangwl1@citic.com'|| email === 'wuyue@citic.com'){
                        return [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: !click
                                },

                                on: {
                                    click: () => {

                                        const {id} = params.row;

                                        this.freezeAccount(id);
                                    }
                                }
                            }, '冻结账户'),
                            h('Button', {
                                style:{
                                    'margin-left':'20px'
                                },
                                props: {
                                    size: 'small',
                                    disabled: !amount
                                },
                                on: {
                                    click: () => {
                                        this.$nextTick(()=>{
                                            const {row} = params;
                                            this.adjusts(row)
                                        })
                                    }
                                }
                            }, amount?'申请调额':'待审批'),
                        ];
                    }else{
                        return [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: !click
                                },

                                on: {
                                    click: () => {

                                        const {id} = params.row;

                                        this.freezeAccount(id);
                                    }
                                }
                            }, '冻结账户')
                        ]
                    }

                }
            }
        ];

        searchAPI: string = this.$API_ENUM.CITIC_ACCOUNT_CREDIT;

        adjust: boolean = false;
        params: string = ''


        created() {

        }


        mxFormSearchData(searchParam) {
            if (searchParam.status === '0') {
                delete searchParam.status;
            }

            if (searchParam.outfulFlag === '0') {
                delete searchParam.outfulFlag;
            }
        }

        mxFormListData(list) {
            return list.map(item => {
                const {status, outfulFlag} = item;

                let statusStr = "";

                if (status === "normal") {
                    statusStr = "正常";
                } else if (status === "freeze") {
                    statusStr = "冻结";
                }

                let outfulFlagStr = outfulFlag ? "是" : "否";

                return {
                    statusStr,
                    outfulFlagStr,
                    ...item
                };
            })
        }

        adjusts(params){
            this.$nextTick(()=>{
                this.params = params
                this.adjust = true
            })

        };
        // isAdjust(){
        //     return this.adjust
        // }
        //校验查询参数
        mxCheckInput(searchParam) {
            const {
                startCreditLines,
                endCreditLines,
                usableStartCreditLines,
                usableEndCreditLines,
                outfulStartCreditLines,
                outfulEndCreditLines
            } = searchParam;

            if(!this.numberRangeCheck(startCreditLines, endCreditLines)){
                throw Error("信用额度查询参数错误");
            }

            if(!this.numberRangeCheck(usableStartCreditLines, usableEndCreditLines)){
                throw Error("可用额度查询参数错误");
            }

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

        /**
         * 冻结信用账户
         */
        freezeAccount(id){

            this.$Modal.confirm({
                title: '提示',
                content: '<p>是否冻结当前租户账号？</p>',
                onOk: async () => {
                   const res = await this.$put(this.$API_ENUM.CITIC_ACCOUNT_CREDIT_FREEZE.Format(id))

                    if(this.$resOk(res)){
                        this.$Message.success("操作成功");
                        this.mxGetList();
                    }else {
                        this.$Message.error(res.message || "操作失败");
                    }
                },
            });
        }

        @Watch('adjust',{deep:true,immediate:true})
        monitorAdjust(val: boolean, oldVal: boolean) {
            this.$nextTick(()=>{
                this.adjust = val
            })


        }
    }

</script>