<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            支付管理
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
            tname: '',
            status: '-1',
            overdueFlag: '-1',
        };

        searchFormConfig = [
            {
                type: 'input',
                key: 'tname',
                placeholder: '请输入租户全称',
                label: '按租户名称',

            },
            {
                type: 'select',
                key: 'status',
                label: '按账户状态',
                clearable: false,
                defaultValue: '-1',
                constValue: [
                    {
                        key: "-1",
                        value: '全部'
                    },
                    {
                        key: 'normal',
                        value: '正常'
                    }, {
                        key: 'freeze',
                        value: '冻结'
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
                title: '累计未支付金额',
                key: 'unpaidAmt'
            },
            {
                title: '是否逾期',
                key: 'overdueFlag'
            },
            {
                title: '信用账户状态',
                key: 'status',
            },
            {
                title: '操作',
                align: 'center',
                width: 320,
                render: (h, params) => {
                    return [
                        h('Button', {
                            props: {
                                size: 'small',
                            },

                            on: {
                                click: () => {

                                    const {tid, tname} = params.row;

                                    this.mxToDetail({
                                        tid,
                                        tname,
                                    });
                                }
                            }
                        }, '查看详情'),
                    ];
                }
            }
        ];

        searchAPI: string = this.$API_ENUM.CITIC_ACCOUNT_BILL;
        // 为了正常清空详情页面查询缓存，需要配置为详情页面全路径
        editPath: string = '/frame/cost/payment-detail';

        created() {

        }

        //调整日期格式
        mxFormSearchData(searchParam) {
            if (searchParam.status === '-1') {
                delete searchParam.status;
            }

            if (searchParam.overdueFlag === '-1') {
                delete searchParam.overdueFlag;
            }
        }

        mxFormListData(row) {
            return row.map(item => {

                item.overdueFlag = item.overdueFlag ? '是' : '否';
                item.status = item.status === 'normal' ? '正常' : '冻结';

                return item;
            });
        }
    }

</script>