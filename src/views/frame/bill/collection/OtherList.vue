<style lang="scss" scoped>
    .btn-group{
        margin-bottom: 10px;
    }
</style>

<template>
    <Card>
        <p slot="title">
            查看其他数据
        </p>
        <ci-search-panel :add="false" @search="mxDoSearch"
                         :searchFormConfig="searchFormConfig">
        </ci-search-panel>
        <div class="btn-group">
            <Button @click='$router.back()'>返回付款通知列表</Button>
        </div>
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
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {ListMixin} from '../../../../mixin';

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        columns = [
            {
                title: '租户名称',
                key: 'tenantName'
            },
            {
                title: '账期月',
                key: 'period'

            },
            {
                title: '当前调整金额',
                render: (h, params) => {
                    return h('span',{},(Number(params.row.currentAmount) / 1000).toFixed(2))
                }
            },
            {
                title: '上期未减免优惠金额/上期应收调整金额',
                    render: (h, params) => {
                    return h('span',{},(Number(params.row.totalAmount) / 1000).toFixed(2))
                }
            }
        ]
        searchFormConfig = [

            {
                type: 'select',
                key: 'tenantIds',
                label: '租户名称',
                placeholder: '请输入租户名称',
                api:this.$API_ENUM.CITIC_USER_GET_TENANT_LIST,
                formatOption: function (res) {
                    let hash = {};
                    const data2 = res.data.reduce((preVal, curVal) => {
                        hash[curVal.citicId] ? '' : hash[curVal.citicId] = true && preVal.push(curVal);
                        return preVal
                    }, [])
                    return data2.map(item => {
                        return {
                            key: item.citicId,
                            value: item.name
                        }
                    })
                },
            },
            {
                type: 'monthrange',
                key:'_month_',
                keys: ['_month_', 'periodStart', 'periodEnd'],
                label: '按年/月查询',
                dateOptions:[
                    {
                        disabledDate: (date) => this.mxGetTimeOperation('periodStart', 'periodEnd', true, date)
                    }, {
                        disabledDate: (date) => this.mxGetTimeOperation('periodStart', 'periodEnd', false, date)
                    }
                ]
            }
        ];
        searchAPI: string = this.$API_ENUM.CITIC_ACCOUNT_ELEDISCOUNT_PAGE_LIST;

        created() {}

        mxFormSearchData(searchParam){
            const {periodStart,periodEnd} = searchParam

            if(periodStart){
                searchParam.periodStart = new Date(periodStart).Format("yyyyMM")
            }
            if(periodEnd){
                searchParam.periodEnd = new Date(periodEnd).Format("yyyyMM")
            }

            return searchParam
        }
    }
</script>