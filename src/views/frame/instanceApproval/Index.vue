<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            线下实例审批
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
</template>

<script lang="ts">
    import {ListMixin} from '../../../mixin';

    import {Component} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        searchParam = {
            serviceName: '',
            statusCode: '0',
            createTime: '',
        };

        searchFormConfig = [

            {
                type: 'select',
                key: 'statusCode',
                label: '交付状态',
                defaultValue: '0',
                clearable: false,
                constValue: [{
                    value: '全部',
                    key: '0'
                }, {
                    value: '交付成功',
                    key: '1'
                }, {
                    value: '交付中',
                    key: '2'
                },{
                    value: '已取消',
                    key: '5'
                }]
            },

            {
                type: 'date',
                key: 'createTime',
                label: '服务创建时间',
            },

            {
                type: 'input',
                key: 'serviceName',
                label: '查询',
                placeholder: '输入服务名称/供应商实例ID/订单ID/租户名称'
            }
        ];

        columns = [
            {
                title: '云平台实例ID',
                key: 'cloudInsId'
            },
            {
                title: '供应商实例ID',
                key: 'id'
            },
            {
                title: '订单ID',
                key: 'orderId'
            },
            {
                title: '服务名称',
                key: 'serviceName',
            },
            {
                title: '租户名称',
                key: 'tenantName'
            },
            {
                title: '服务创建时间',
                key: 'createTime',
            },
            {
                title: '服务交付时间',
                key: 'updateTime',
            },
            {
                title: '操作人',
                key: 'confirmUserName',
                width: 100
            },
            {
                title: '交付状态',
                key: 'statusName',
                width: 100,
                align: 'center'
            },
            {
                title: '操作',
                align: 'center',
                width: 150,
                render: (h, params) => {
                    return [h('Button', {
                        props: {
                            size: 'small',
                        },
                        on: {
                            click: () => {
                                const {id, orderId, tenantName, statusCode, cloudInsId} = params.row;
                                this.mxToDetail({
                                    id,
                                    orderId,
                                    tenantName,
                                    statusCode,
                                    cloudInsId
                                });
                            }
                        }
                    },  params.row.statusCode === 1 || params.row.statusCode === 5 ? '查看详情': '交付')];
                }
            }
        ];

        searchAPI: string = this.$API_ENUM.CITIC_GENERAL_ADAPTER_QUERY_INSTANCE_PAGE;
        editPath: string = 'approval/form';

        created() {

        }

        //调整请求参数格式
        mxFormSearchData(searchParam) {
            if (searchParam.createTime) {
                searchParam.createTime = new Date(searchParam.createTime).Format("yyyy-MM-dd");
            }

            if (searchParam.statusCode === '0') {
                searchParam.statusCode = '';
            }
        }
    }

</script>