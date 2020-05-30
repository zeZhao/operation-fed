<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            <Icon type="ios-arrow-dropleft" size="22" @click="()=>this.$router.back()"/>
            value列表
        </p>

        <ci-search-panel :add="true" @add="mxToDetail({optionsKeyId:id,type:'new'})" @search="mxDoSearch"
                         :searchFormConfig="searchFormConfig">
        </ci-search-panel>

        <Table :columns="columns" :data="listData" :loading="loading"></Table>

        <!--<Page class="list-page"
              :total="total"
              :current="pageIndex"
              :pageSize="pageSize"
              :page-size-opts="pageSizeOpts"
              show-total
              show-sizer
              show-elevator
              @on-change="mxChangePage"
              @on-page-size-change="mxChangePageSize"
        ></Page>-->
    </Card>
</template>

<script lang="ts">
    import {ListMixin} from '../../../mixin';

    import {Component} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        id: string = '';

        searchParam = {
            couponType: 0,
            approveStatus: -1,
            useStaus: 0,
            name: "",
            effectiveDate: "",
            expriyDate: "",
        };

        searchFormConfig = [];

        columns = [
            {
                type: 'index',
            },
            {
                title: '类型',
                key: 'valueType'
            },
            {
                title: '名称',
                key: 'code'
            },
            {
                title: '显示名称',
                key: 'displayName'
            },
            {
                title: '接口名称',
                key: 'dynamicApi'
            },
            {
                title: '是否默认值',
                key: 'defaultValue'
            },
             {
                title: '排序',
                key: 'sort'
            },
            {
                title: '操作',
                align: 'center',
                width: '200',
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
                                    icon: 'ios-cog-outline',
                                    type: 'info'
                                },
                                on: {
                                    click: () => this.mxToDetail(this.paramKeyId(params))
                                }
                            }, '编辑'),

                            h('Button', {
                                props: {
                                    icon: 'ios-cog-outline',
                                    type: 'error'
                                },
                                on: {
                                    click: () => this.mxDeleteItem(params.row.id)
                                }
                            }, '删除'),
                        ]),
                    ]
                }
            }
        ];

        searchAPI: string = '';
        editPath: string = '/frame/service-specs/value/form';
        delAPI: string = this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONS_VALUE;

        created() {
            const {id} = this.$route.query;
            this.id = `${id}`;
            this.searchAPI = `${this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONS_VALUE_KEY_ID}`.Format(this.id)
        }

        mxFormListData(rows) {
            return rows.map((item: any) => {
                return {
                    ...item,
                    defaultValue: item.defaultValue ? '是' : '否',
                    valueType: item.valueType === 'staticEnum' ? '静态类型': '动态类型'
                };
            })
        }

        paramKeyId(params: any){
            return {id:params.row.id,optionsKeyId:this.id}
        }
    }

</script>