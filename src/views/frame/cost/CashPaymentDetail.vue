<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            现金收支明细
        </p>

        <ci-search-panel :add="false" @add="mxToDetail" @search="mxDoSearch"
                         :searchFormConfig="searchFormConfig" ref="searchPanel">

            <Button v-if="hasGoback" @click="goback">返回</Button>
            <Button slot="right" v-if="permission" type="primary" @click="goMoneyBack">查看回退详情</Button>

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
        <div v-if="moneyBack">
            <money-back-modal v-model="moneyBack" :paramsRow="paramsRow" @mxDoSearch="mxDoSearch(searchParam)"></money-back-modal>
        </div>
    </Card>
</template>

<script lang="ts">
    import {ListMixin} from '../../../mixin';

    import moneyBackModal from '@/components/cost/MoneyBackModal.vue'

    import {Component, Watch} from 'vue-property-decorator';

    @Component({
        components: {
            'money-back-modal': moneyBackModal
        },
    })
    export default class extends ListMixin {

        searchParam = {
            tname: '',
            startTranDate: '',
            endTranDate: '',
            tranType: '0',
        };

        userEmail:string = this.$getSession('citic-user').email

        searchFormConfig = [
            {
                type: 'input',
                key: 'tname',
                label: '租户名称',
                placeholder: '请输入',
            }, {
                key: '_data_',
                type: 'daterange',
                separate: true,
                keys: ['_data_', 'startTranDate', 'endTranDate'],
                label: '支付时间',
                dateOptions: [
                    {
                        disabledDate: (date) => this.mxGetTimeOperation('startTranDate', 'endTranDate',true, date)
                    }, {
                        disabledDate: (date) => this.mxGetTimeOperation('startTranDate', 'endTranDate',false, date)
                    }
                ]
            }, {
                type: 'select',
                key: 'tranType',
                label: '交易类型',
                defaultValue: '0',
                clearable: false,
                constValue: [
                    {
                        key: '0',
                        value: '全部',
                    }, {
                        key: 'expend',
                        value: '消费',
                    }, {
                        key: 'income',
                        value: '充值',
                    },
                ]
            }
        ];

        columns = [
            {
                title: '流水号',
                key: 'id'
            },
            {
                title: '租户名称',
                key: 'tname'
            },
            {
                title: '支付时间',
                key: 'tranTime'
            },
            {
                title: '交易类型',
                key: 'tranType',
            },
            // {
            //     title: '交易单号',
            //     key: 'externalSerialNum',
            // },
            {
                title: '账户支出/入账',
                key: 'moneyStr',
            },
            {
                title: '操作',
                render: (h,params)=>{
                    if(this.userEmail === 'fengcm@citic.com' || this.userEmail === 'p-yuwj@tech.citic'){
                        if(params.row.tranType === '充值'){
                            return[
                                h('Button',{
                                    props:{
                                        type:'success'
                                    },
                                    on: {
                                        click:()=>{
                                            this.moneyBackModal(params.row)
                                        }
                                    }
                                },'资金回退')
                            ]
                        }
                    }
                }
            }
        ];

        searchAPI: string = this.$API_ENUM.CITIC_ACCOUNT_CASH_DETAIL;
        moneyBack: boolean = false
        paramsRow: Object = {};

        created() {
            const {tname} = this.$route.query;

            if (tname) {
                this.searchParam.tname = `${tname}`;
                this.setTnameReadonly(`${tname}`);
            }
        }

        moneyBackModal(val:any){
            this.moneyBack = true;
            this.paramsRow = val;
        }
        //调整日期格式
        mxFormSearchData(searchParam) {
            if (searchParam.tranType === '0') {
                delete searchParam.tranType;
            }

            if (searchParam.startTranDate) {
                let str = new Date(searchParam.startTranDate).Format("yyyy-MM-dd") + " 00:00:00";
                searchParam.startTranDate = new Date(str).getTime();
            }

            if (searchParam.endTranDate) {
                let str = new Date(searchParam.endTranDate).Format("yyyy-MM-dd") + " 23:59:59";
                searchParam.endTranDate = new Date(str).getTime();
            }
        }

        mxFormListData(list) {
            return list.map(item => {
                const {incomeAmt, expendAmt} = item;
                let moneyStr = "";

                if (Number(incomeAmt) !== 0) {
                    moneyStr = "+" + incomeAmt;
                } else if (Number(expendAmt) !== 0) {
                    moneyStr = "-" + expendAmt;
                }

                return {
                    moneyStr,
                    ...item
                };
            })
        }

        goback(){
            this.$router.back();
        }
        goMoneyBack(){
            this.$router.push({
                path: './money-back-detail'
            })
        }

        /**
         * 设置 tname 字段是否只读
         * @param tname
         */
        setTnameReadonly(tname: string = ''){
            const item: SearchConfigItem = this.searchFormConfig[0];
            item.defaultValue = `${tname}`;
            item.clearable = !tname;
            item.readonly = !!tname;
        }

        get hasGoback(){
            const {tname} = this.$route.query;
            return !!tname;
        }

        get permission(){
            return this.userEmail === 'fengcm@citic.com' || this.userEmail === 'p-yuwj@tech.citic'

        }

        @Watch('$route.query')
        routerChange() {
            const {tname} = this.$route.query;

            // 查询条件清空
            if(!tname){
                this.setTnameReadonly('');
                if(this.$refs.searchPanel){
                    (this.$refs.searchPanel as any).resetCondition();
                }
            }
        }
    }

</script>