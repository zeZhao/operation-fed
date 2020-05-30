<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            租户支付明细
        </p>

        <ci-search-panel :add="false" @add="mxToDetail" @search="mxDoSearch"
                         :searchFormConfig="searchFormConfig" ref="searchPanel">

            <Button v-if="hasGoback" @click="goback">返回</Button>

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
</template>

<script lang="ts">
    import {ListMixin} from '../../../mixin';

    import {Component, Watch} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        searchParam = {
            tname: '',
            paymentFlag: '-1',
            overdueFlag: '-1',
            startAccountPeriod: "",
            endAccountPeriod: "",
        };

        searchFormConfig: Array<SearchConfigItem> = [
            {
                type: 'input',
                key: 'tname',
                placeholder: '请输入租户全称',
                label: '按租户',

            },
            {
                key: '',
                type: 'monthrange',
                keys: ['_accountPeriod_', 'startAccountPeriod', 'endAccountPeriod'],
                label: '按账期月',
                dateOptions: [
                    {
                        disabledDate: (date) => this.mxGetTimeOperation('startAccountPeriod', 'endAccountPeriod', true, date)
                    }, {
                        disabledDate: (date) => this.mxGetTimeOperation('startAccountPeriod', 'endAccountPeriod', false, date)
                    }
                ]
            },
            {
                type: 'select',
                key: 'paymentFlag',
                label: '支付状态',
                clearable: false,
                defaultValue: '-1',
                constValue: [
                    {
                        key: "-1",
                        value: '全部'
                    },
                    {
                        key: 'false',
                        value: '未支付'
                    }, {
                        key: 'true',
                        value: '已支付'
                    }
                ]
            },
            {
                type: 'select',
                key: 'overdueFlag',
                label: '按逾期状态',
                clearable: false,
                defaultValue: '-1',
                constValue: [
                    {
                        key: "-1",
                        value: '全部'
                    },
                    {
                        key: 'true',
                        value: '是'
                    }, {
                        key: 'false',
                        value: '否'
                    }
                ]
            },
        ];

        columns = [
            {
                title: '租户名称',
                key: 'tname'
            },
            {
                title: '账期月',
                key: 'accountPeriod'
            },
            {
                title: '当期应付金额',
                key: 'billAmount'
            },
            {
                title: '有效支付天数',
                key: 'effectivePaymentDays',
            },
            {
                title: '支付状态',
                key: 'paymentFlag',
            },
            {
                title: '支付时间',
                key: 'paymentDate',
            },
            {
                title: '是否逾期',
                key: 'overdueFlag',
            },
            {
                title: '逾期天数',
                key: 'overdueDays',
            },
        ];

        searchAPI: string = this.$API_ENUM.CITIC_ACCOUNT_BILL_DETAIL;
        editPath: string = 'legal/form';

        created() {
            const {tname} = this.$route.query;

            if (tname) {
                this.searchParam.tname = `${tname}`;
                this.setTnameReadonly(`${tname}`);
            }
        }

        //调整日期格式
        mxFormSearchData(searchParam) {
            if (searchParam.paymentFlag === '-1') {
                delete searchParam.paymentFlag;
            }

            if (searchParam.overdueFlag === '-1') {
                delete searchParam.overdueFlag;
            }

            if (searchParam.startAccountPeriod) {
                searchParam.startAccountPeriod = new Date(searchParam.startAccountPeriod).Format("yyyyMM")
            }

            if (searchParam.endAccountPeriod) {
                searchParam.endAccountPeriod = new Date(searchParam.endAccountPeriod).Format("yyyyMM")
            }
        }

        mxFormListData(row) {
            return row.map(item => {

                item.overdueFlag = item.overdueFlag ? '是' : '否';
                item.paymentFlag = item.paymentFlag ? '已支付' : '未支付';

                item.overdueDays = ~~item.overdueDays ? `${item.overdueDays}天` : 0;

                item.paymentDate = item.paymentDate || '-';

                return item;
            });
        }

        goback(){
            this.$router.back();
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