<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            信息安全审核
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
            companyOrUserName: '',
            auditStatus: '0',
            providerStartTime: "",
            providerEndTime: "",
        };

        searchFormConfig = [

            {
                type: 'input',
                key: 'companyOrUserName',
                label: '搜索',
                placeholder: '请输入公司名称/申请人名称'
            },

            {
                type: 'select',
                key: 'auditStatus',
                label: '审核状态',
                defaultValue: '0',
                clearable: false,
                constValue: [{
                    value: '全部',
                    key: '0'
                }, {
                    value: '审核中',
                    key: 'wait_audit'
                }, {
                    value: '审核通过',
                    key: 'audit_pass'
                }, {
                    value: '审核不通过',
                    key: 'audit_refuse'
                }]
            },


            {
                type: 'daterange',
                keys: ['_effectiveTime_', 'providerStartTime', 'providerEndTime'],
                label: '申请时间',
            }
        ];

        columns = [
            {
                title: '公司全称',
                key: 'tenantName'
            },
            {
                title: '渠道类型',
                key: 'authTypeDesc'
            },
            {
                title: '申请人',
                key: 'userName'
            },
            {
                title: '申请日期',
                key: 'createTimeStr',
            },
            {
                title: '审批状态',
                key: 'authStatusDesc',
            },
            {
                title: '操作人',
                key: 'operateUserName',
            },
            {
                title: '操作时间',
                key: 'operateTimeStr',
            },
            {
                title: '操作',
                align: 'center',
                width: 160,
                render: (h, params) => {

                    return [h('Button', {
                        props: {
                            size: 'small',
                        },

                        style: {
                            marginRight: '10px'
                        },

                        on: {
                            click: () => {

                                const {id} = params.row;

                                this.mxToDetail({
                                    id,
                                });
                            }
                        }
                    }, '查看详情')];
                }
            }
        ];

        searchAPI: string = this.$API_ENUM.CITIC_AUTH_GET_AUTH_INSTANCE_LIST;
        editPath: string = 'authentication/form';

        created() {

        }

        //调整请求参数格式
        mxFormSearchData(searchParam) {
            if (searchParam.providerStartTime && searchParam.providerEndTime) {
                searchParam.providerStartTime = new Date(searchParam.providerStartTime).Format("yyyy-MM-dd");
                searchParam.providerEndTime = new Date(searchParam.providerEndTime).Format("yyyy-MM-dd");
            }

            if (searchParam.auditStatus === '0') {
                delete searchParam.auditStatus;
            }
        }
    }

</script>