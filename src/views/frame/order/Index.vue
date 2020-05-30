<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            订单列表
        </p>

        <ci-search-panel :add="false" @add="mxToDetail" @search="mxDoSearch"
                         :searchFormConfig="searchFormConfig">
        </ci-search-panel>

        <ci-order-item v-for="order in listData"
                       :key="order.id + new Date().getTime()"
                       :order="order"
                       @refreshList="mxGetList"
        />

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

        <Spin size="large" fix v-if="loading"></Spin>
    </Card>
</template>

<script lang="ts">
    //@ts-ignore
    import OrderItem from '../../../components/order/OrderItem.vue';
    import {Component, Watch} from 'vue-property-decorator';
    import {ListMixin} from "@/mixin";

    @Component({
        components: {
            'ci-order-item': OrderItem,
        },
        name: "order-list"
    })
    export default class extends ListMixin {

        searchParam = {
            searchMode: '',
            orderStatus: 'all',
            tenantId: '',
            startTime: '',
            endTime: '',
        };

        searchFormConfig = [
            {
                type: 'input',
                key: 'searchMode',
                label: '查询',
                placeholder: '服务名称/供应商/订单号',
            },
            {
                type: 'select',
                key: 'orderStatus',
                label: '订单状态',
                defaultValue: 'all',
                clearable: false,
                constValue: [
                    {
                        value: '全部',
                        key: 'all',
                    }, {
                        value: '未提交',
                        key: 'unsubmitted',
                    }, {
                        value: '待审核',
                        key: 'waitApproval',
                    }, {
                        value: '交付中',
                        key: 'pending',
                    }, {
                        value: '交付完成',
                        key: 'finished',
                    }, {
                        value: '交付失败',
                        key: 'deliveryFailure',
                    }, {
                        value: '已拒绝',
                        key: 'refused',
                    }
                    , {
                        value: '已取消',
                        key: 'canceled',
                    }
                ]
            },
            {
                type: 'select',
                key: 'tenantId',
                label: '租户查询',
                api: this.$API_ENUM.CITIC_USER_GET_TENANT_LIST,
                formatOption(res) {
                    return res.data.filter(item => item.available).map(({citicId, name}) => {
                        return {
                            key: citicId,
                            value: name
                        }
                    })
                }
            },
            {
                type: 'daterange',
                keys: ['_createTime_', 'startTime', 'endTime'],
                label: '创建时间',
                separate: true,
                dateOptions: [
                    {
                        disabledDate: (date) => this.mxGetTimeOperation('startTime', 'endTime', true, date)
                    }, {
                        disabledDate: (date) => this.mxGetTimeOperation('startTime', 'endTime', false, date)
                    }
                ]
            },
        ];

        columns = [
            {
                title: '租户名称',
                key: 'tenantName'
            },
            {
                title: '服务名称',
                key: 'serviceName'
            },
            {
                title: '供应商名称',
                key: 'providerName'
            },
            {
                title: '云平台实例ID',
                key: 'instanceId',
            },
            {
                title: '供应商实例ID',
                key: 'supplyInstanceId',
            },
            {
                title: '成本中心',
                key: 'costCenterName',
            },
            {
                title: '应用基线',
                key: 'appBaseName',
            },
            {
                title: '创建时间',
                key: 'createTime',
            },
            {
                title: '最后修改时间',
                key: 'updateTime',
            },
        ];

        searchAPI = this.$API_ENUM.ORDER

        mxFormSearchData(searchParam) {
            if (searchParam.orderStatus === 'all') {
                searchParam.orderStatus = '';
            }

            if (searchParam.startTime) {
                searchParam.startTime = `${new Date(searchParam.startTime).Format("yyyy-MM-dd")} 00:00:00`;
            }

            if (searchParam.endTime) {
                searchParam.endTime = `${new Date(searchParam.endTime).Format("yyyy-MM-dd")} 23:59:59`;
            }
        }
    }

</script>