<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            服务规格配置
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
    // @ts-ignore
    import ServiceTableExtends from '../../../components/serviceSpecs/ServiceTableExtends.vue';

    import {Component} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        searchParam = {
            name: '',
            supplierId: '',
        };

        searchFormConfig: Array<any> = [
            {
                type: 'input',
                key: 'name',
                label: '服务名称',
                placeholder: '输入名称',
            }, {
                type: 'select',
                key: 'supplierId',
                label: '供应商',
                api: `${this.$API_ENUM.SUPPLIER_SUPPLIERS}?pageIndex=1&pageSize=10000`,
                formatOption(res) {
                    return res.data.content.map(item => {
                        return {
                            key: item.id,
                            value: item.name
                        }
                    })
                }
            }
        ];
        delAPI: string = this.$API_ENUM.CITIC_SERVICE_CONFIG_ACTION_DELETEID;

        columns = [
            {
                type: 'expand',
                width: 50,
                render: (h, params) => {
                    return h(ServiceTableExtends, {
                        props: {
                            row: params.row,
                        },
                        // on: {
                        //     mxDeleteItem: id =>{
                        //         // console.log(this._events)
                        //         this.mxDeleteItem(id)
                        //     }
                        // }
                    })
                }
            },
            {
                title: '服务名称',
                key: 'serviceName'
            },
            {
                title: '供应商',
                key: 'supplierName'
            },
            {
                title: '操作',
                width: '500',
                align: 'center',
                render: (h, params) => {
                    return [
                        h('ButtonGroup', {
                            props: {
                                shape: 'circle',
                                size: 'small'
                            },

                        }, [
                            h('Button', {
                                props: {
                                    icon: 'md-add',
                                    type: 'info'
                                },
                                on: {
                                    click: () => this.addAction(params.row)
                                }
                            }, '添加服务操作'),

                            h('Button', {
                                props: {
                                    icon: 'ios-construct',
                                },
                                on: {
                                    click: () => this.mxToDetail(params.row.id)
                                }
                            }, '配置key'),

                            // 不使用 actionId 加载树，树配置在service上
                            h('Button', {
                                props: {
                                    icon: 'md-git-compare',
                                },
                                on: {
                                    click: () => this.editRelation(params.row.id)
                                }
                            }, '关联关系'),
                        ]),
                    ]
                }
            }
        ];

        searchAPI: string = `${this.$API_ENUM.SUPPLIER_SERVICES}?available=1`;
        editPath = '/frame/service-specs/key/list';

        created() {

        }

        mxFormListData(rows) {
            return rows.map(item => {

                const {id, name: serviceName, supplier: {name: supplierName}} = item;

                return {
                    id, serviceName, supplierName
                }
            });
        }

        /**
         * 添加实例可用操作
         */
        addAction(row) {
            console.log("当前服务数据", row);
            this.$router.push({
                path:"/frame/service-specs/action/form",
                query:{
                    serverId: row.id,
                    type: 'new'
                }
            })
        }

        /**
         * 配置关联关系
         */
        // 不使用 actionId 加载树，树配置在service上
        editRelation(serviceId: string) {
            this.$router.push(`/frame/service-specs/relation/form?serviceId=${serviceId}`);
        }
    }

</script>