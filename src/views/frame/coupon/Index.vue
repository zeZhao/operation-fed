<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            优惠券
        </p>

        <ci-search-panel :add="true" @add="mxToDetail" @search="mxDoSearch"
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
    import TableExtends from '../../../components/coupon/TableExtends.vue';

    import {Component} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        searchParam = {
            couponType: 0,
            approveStatus: -1,
            useStaus: 0,
            name: "",
            effectiveDate: "",
            expriyDate: "",
        };

        searchFormConfig = [
            {
                type: 'select',
                key: 'couponType',
                label: '优惠券类型',
                clearable: false,
                defaultValue: 0,
                constValue: [
                    {
                        key: 0,
                        value: '全部'
                    },
                    {
                        key: 1,
                        value: '通用券'
                    }, {
                        key: 2,
                        value: '服务商优惠券'
                    }, {
                        key: 3,
                        value: '服务优惠券'
                    }
                ]
            },
            {
                type: 'select',
                key: 'approveStatus',
                label: '审批状态',
                clearable: false,
                defaultValue: -1,
                constValue: [
                    {
                        key: -1,
                        value: '全部'
                    }, {
                        key: 0,
                        value: '待审批'
                    }, {
                        key: 1,
                        value: '审批通过'
                    }, {
                        key: 2,
                        value: '审批不通过'
                    }
                ]
            },
            {
                type: 'select',
                key: 'useStaus',
                label: '使用状态',
                clearable: false,
                defaultValue: 0,
                constValue: [
                    {
                        key: 0,
                        value: '全部'
                    }, {
                        key: 1,
                        value: '未使用'
                    }, {
                        key: 2,
                        value: '已使用'
                    }, {
                        key: 3,
                        value: '已过期'
                    }
                ]
            },
            {
                type: 'input',
                key: 'name',
                label: '查询条件',
                placeholder: '租户名称/操作人/订单号/优惠券名称',

            },
            {
                type: 'daterange',
                keys: ['_effectiveTime_', 'effectiveDate', 'expriyDate'],
                label: '生效时间',
            }
        ];

        columns = [
            {
                type: 'expand',
                width: 50,
                render: (h, params) => {
                    return h(TableExtends, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
            {
                title: '优惠券名称',
                key: 'couponName'
            },
            {
                title: '审批状态',
                key: 'appResultName'
            },
            {
                title: '优惠券类型',
                key: 'couponTypeName'
            },
            {
                title: '优惠方式(元)',
                key: 'money'
            },
            {
                title: '操作人',
                key: 'operatorName',
            },
            {
                title: '赠送租户',
                key: 'userName',
            },
            {
                title: '优惠券编码',
                key: 'uniqueId',
            },
            {
                title: '使用状态',
                key: 'useStatusName',
            },
            {
                title: '订单号',
                key: 'orderId',
            },
            /*{
                title: '操作',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    if (params.row.appResult === 0) {
                        return [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    icon: 'checkmark'
                                },
                                on: {
                                    click: () => this.approval(params.row)
                                }
                            }, '审批')
                        ]
                    }
                }
            }*/
        ];

        searchAPI: string = this.$API_ENUM.CITIC_COUPON_QUERY;
        editPath: string = 'coupon/form';

        created() {

        }

        //调整日期格式
        mxFormSearchData(searchParam) {
            if (searchParam.effectiveDate && searchParam.expriyDate) {
                searchParam.effectiveDate = new Date(searchParam.effectiveDate).Format("yyyy-MM-dd");
                searchParam.expriyDate = new Date(searchParam.expriyDate).Format("yyyy-MM-dd");
            }
        }

       /* approval(row) {
            this.$Modal.confirm({
                title: '操作提示',
                content: '审核通过该优惠券审批？',
                okText: '通过',
                cancelText: '驳回',
                closable: true,
                onOk: () => this.approvalSubmit(row.uniqueId, true),
                onCancel: () => this.approvalSubmit(row.uniqueId, false),
            })
        }

        approvalSubmit(uniqueId, adopt) {
            this.$put(this.$API_ENUM.CITIC_COUPON_APPROVE_APPROVE, {
                result: adopt ? 1 : 2,
                uniqueId: [uniqueId],
            }).then(res => {
                if (this.$resOk(res)) {
                    this.$Message.success("操作成功");
                    this.mxGetList();

                } else {
                    this.$Message.error("操作失败");
                }
            });
        }*/
    }

</script>