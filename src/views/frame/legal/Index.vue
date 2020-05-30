<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            服务条款
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
            serviceId: 0,
            supplierId: -1,
            operatorUserName: 0,
            startOperatorDateTime: "",
            endOperatorDateTime: "",
        };

        searchFormConfig = [
            {
                type: 'select',
                key: 'supplierServiceId',
                label: '服务名称',
                clearable: true,
                api: `${this.$API_ENUM.SUPPLIER_SERVICES}?available=1&pageIndex=1&pageSize=9999`,
                formatOption(res) {
                    return res.data.content.map(item => {
                        return {
                            key: item.id,
                            value: item.name
                        }
                    })
                }
            },
            {
                type: 'select',
                key: 'supplierId',
                label: '服务商名称',
                clearable: true,
                api: `${this.$API_ENUM.SUPPLIER_SUPPLIERS}?pageIndex=1&pageSize=10000`,
                formatOption(res) {
                    return res.data.content.map(item => {
                        return {
                            key: item.id,
                            value: item.name
                        }
                    })
                }
            },
            {
                type: 'input',
                key: 'operatorUserName',
                label: '最后操作人',

            },
            {
                type: 'daterange',
                keys: ['_effectiveTime_', 'startOperatorDateTime', 'endOperatorDateTime'],
                label: '最后操作时间',
            }
        ];

        columns = [
            {
                title: '服务名称',
                key: 'serviceName'
            },
            {
                title: '服务商简称',
                key: 'supplierShortName'
            },
            {
                title: '服务商名称',
                key: 'supplierName'
            },
            {
                title: '最后操作人',
                key: 'operatorUserName',
            },
            {
                title: '最后操作时间',
                key: 'uploadTime',
            },
            {
                title: '操作',
                align: 'center',
                width: 320,
                render: (h, params) => {

                    const btns = [
                        h('Button', {
                            props: {
                                size: 'small',
                            },

                            style: {
                              marginRight: '10px'
                            },

                            on: {
                                click: ()=>{

                                    const {id, serviceName, supplierServiceId} = params.row;

                                    this.mxToDetail({
                                        id,
                                        supplierServiceId,
                                        serviceName,
                                    });
                                }
                            }
                        }, '上传服务条款'),
                    ];

                    if (params.row.id) {
                        btns.push(
                            h('Button', {
                                props: {
                                    size: 'small',
                                },
                                on: {
                                    click: () => this.preview(params.row.id, params.row.serviceName)
                                }
                            }, '查看当前服务条款')
                        )
                    }
                    return btns;
                }
            }
        ];

        searchAPI: string = this.$API_ENUM.TERMS_OF_CONDITIONS;
        editPath: string = 'legal/form';

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