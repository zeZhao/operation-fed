<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            优惠券审批
        </p>

        <ci-search-panel :add="false" @search="mxDoSearch"
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


        <Modal v-model="approvalDialog">
            <p slot="header" style="color:#f60;text-align:center;  font-size: 16px;">
                <Icon type="ios-information-circle"></Icon>
                <span>操作提示</span>
            </p>
            <div style="text-align:center; font-size: 14px;">
                <p>审核通过该优惠券审批？</p>
            </div>
            <div slot="footer">
                <Button type="error" @click="approvalSubmit(false)">驳回</Button>
                <Button type="primary" @click="approvalSubmit(true)">通过</Button>
            </div>
        </Modal>
    </Card>
</template>

<script lang="ts">
    import {ListMixin} from '../../../mixin';
    import ApprovalTableExtends from '../../../components/coupon/ApprovalTableExtends.vue';

    import {Component} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        //根据查询条件修改字段名称
        searchParam = {
            couponType: 0,
            approveStatus: -1,
            searchStr: '',

            effectiveDate: '',
            expiryDate: '',
        };

        //根据查询条件修改key
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
                    }, {
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
                type: 'input',
                key: 'name',
                label: '查询条件',
                placeholder: '优惠券名称/提交人',

            },
            {
                type: 'daterange',
                keys: ['_effectiveTime_', 'effectiveDate', 'expiryDate'],
                label: '生效时间',
            }
        ];

        //修改列表字段key
        columns = [
            {
                type: 'expand',
                width: 50,
                render: (h, params) => {
                    return h(ApprovalTableExtends, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
            {
                title: '序号',
                key: 'id'
            },
            {
                title: '提交人',
                key: 'operatorName',
            },
            {
                title: '优惠券名称',
                key: 'name'
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
                title: '赠送数量',
                key: 'allNums'
            },
            {
                title: '审批状态',
                key: 'appResultName'
            },
            {
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
                            }, '审核')
                        ]
                    }
                }
            }
        ];

        //添加查询接口
        searchAPI: string = this.$API_ENUM.CITIC_COUPON_APPROVE_QUERY;

        approvalId: string = "";
        approvalDialog: boolean = false;

        created() {

        }

        //调整日期格式
        mxFormSearchData(searchParam) {
            if (searchParam.effectiveDate && searchParam.expiryDate) {
                searchParam.effectiveDate = new Date(searchParam.effectiveDate).Format("yyyy-MM-dd");
                searchParam.expiryDate = new Date(searchParam.expiryDate).Format("yyyy-MM-dd");
            }
        }

        approval(row) {
            //修改需要进行审批的数据id
            this.approvalId = row.id;
            this.approvalDialog = true;
        }

        //调用审批接口，添加审批接口，修改提交参数
        approvalSubmit(adopt) {
            this.$put(this.$API_ENUM.CITIC_COUPON_APPROVE_APPROVE, {
                result: adopt ? 1 : 2,
                templateIds: [this.approvalId],
            }).then(res => {
                if (this.$resOk(res)) {
                    this.$Message.success("操作成功");
                    this.mxGetList();
                    this.approvalDialog = false;
                } else {
                    this.$Message.error("操作失败");
                }
            });
        }
    }

</script>