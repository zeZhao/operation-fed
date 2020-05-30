<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            现金账户总览
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
        };

        searchFormConfig = [
            {
                type: 'input',
                key: 'tname',
                label: '租户名称',
                placeholder: '请输入',
            }
        ];

        columns = [
            {
                title: '租户名称',
                key: 'tname'
            },
            {
                title: '账户入账总额',
                key: 'incomeTotalAmt'
            },
            {
                title: '账户支出总额',
                key: 'expendTotalAmt'
            },
            {
                title: '账户余额',
                key: 'balance',
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

        searchAPI: string = this.$API_ENUM.CITIC_ACCOUNT_CASH;
        editPath: string = '/frame/cost/cash-payment-detail';

        created() {

        }

        //调整日期格式
        mxFormSearchData(searchParam) {
            if (searchParam.startOperatorDateTime && searchParam.endOperatorDateTime) {
                searchParam.startOperatorDateTime = new Date(new Date(searchParam.startOperatorDateTime).Format("yyyy-MM-dd 00:00:00")).getTime();
                searchParam.endOperatorDateTime = new Date(new Date(searchParam.endOperatorDateTime).Format("yyyy-MM-dd 23:59:59")).getTime();
            }
        }

        preview(id, serviceName) {
            window.open(`#/legal-preview?id=${id}&serviceName=${serviceName}`);
        }
    }

</script>