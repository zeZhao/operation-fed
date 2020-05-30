<style lang="scss" scoped>

</style>

<template>
    <Card>
        <p slot="title">
            实例列表
        </p>

        <ci-search-panel :add="false" @add="mxToDetail" @search="mxDoSearch"
                         :searchFormConfig="searchFormConfig">
            <Button icon="ios-cloud-download-outline" @click="download">下载列表</Button>
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
    import ExpandRow from '../../../components/instance/ExpandRow.vue';

    import {Component} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        searchParam = {};

        searchFormConfig = [

            {
                type: 'select',
                key: 'providerId',
                label: '供应商',
                clearable: true,
                influence: 'serviceId',
                api: this.$API_ENUM.SUPPLIER_SUPPLIERS_GETAVAILABLETRUE,
                formatOption(res) {
                    return res.data.map(item => {
                        return {
                            key: item.id,
                            value: item.name
                        }
                    })
                }
            },
            {
                type: 'select',
                key: 'serviceId',
                label: '供应商服务',
                clearable: true,
                dependent: 'providerId',
                ignoreDependentEmpty: true,
                api: `${this.$API_ENUM.SUPPLIER_SERVICES_SUPPLIER}?supplierId=#{0}`,
                formatOption: function (res) {
                    return res.data.map(item => {
                        return {
                            key: item.id,
                            value: item.name
                        }
                    })
                },
            },
            {
                type: 'input',
                key: 'serviceInfo',
                placeholder: '请输入关键字',
                label: '实例属性搜索',
            },
            {
                type: 'input',
                key: 'supplyInstanceId',
                placeholder: '供应商实例ID',
                label: '供应商实例ID',
            },
            {
                type: 'input',
                key: 'instanceId',
                placeholder: '云平台实例ID',
                label: '云平台实例ID',
            },
            {
                type: 'select',
                key: 'tenantId',
                label: '租户查询',
                clearable: true,
                api: this.$API_ENUM.CITIC_USER_GET_TENANT_LIST,
                formatOption(res) {
                    return res.data.filter(item => item.available).map(({id, name}) => {
                        return {
                            key: id,
                            value: name
                        }
                    })
                }
            },
            {
                type: 'daterange',
                keys: ['_data1_', 'startCreateTime', 'endCreateTime'],
                label: '创建时间'
            },
            {
                type: 'daterange',
                keys: ['_data2_', 'startUpdateTime', 'endUpdateTime'],
                label: '最后修改时间'
            },
        ];

        columns = [
            {
                type: 'expand',
                width: 50,
                render: (h, params) => {
                    return h(ExpandRow, {
                        props: {
                            row: params.row,
                            search: this.searchParam
                        }
                    })
                }
            },
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

        searchAPI: string = this.$API_ENUM.SRVMGT_GET_COST_CENTER_OFFICE_LIST;
        editPath: string = '';

        created() {

        }

        // 调整请求参数格式
        mxFormSearchData(searchParam) {
            if (searchParam.startCreateTime && searchParam.endCreateTime) {
                searchParam.startCreateTime = new Date(searchParam.startCreateTime).Format("yyyy-MM-dd 00:00:00");
                searchParam.endCreateTime = new Date(searchParam.endCreateTime).Format("yyyy-MM-dd 23:59:59");
            }
            if (searchParam.startUpdateTime && searchParam.endUpdateTime) {
                searchParam.startUpdateTime = new Date(searchParam.startUpdateTime).Format("yyyy-MM-dd 00:00:00");
                searchParam.endUpdateTime = new Date(searchParam.endUpdateTime).Format("yyyy-MM-dd 23:59:59");
            }
        }

        /**
         * 导出实例列表
         */
        async download() {
            let searchParam = {
                startCreateTime: '',
                endCreateTime: '',
                startUpdateTime: '',
                endUpdateTime: '',

                ...this.searchParam
            };


            let {startCreateTime, endCreateTime, startUpdateTime, endUpdateTime} = searchParam;

            if (startCreateTime && endCreateTime) {
                startCreateTime = new Date(startCreateTime).Format("yyyy-MM-dd 00:00:00");
                endCreateTime = new Date(endCreateTime).Format("yyyy-MM-dd 23:59:59");
            }
            if (startUpdateTime && endUpdateTime) {
                startUpdateTime = new Date(startUpdateTime).Format("yyyy-MM-dd 00:00:00");
                endUpdateTime = new Date(endUpdateTime).Format("yyyy-MM-dd 23:59:59");
            }

            searchParam = {
                ...searchParam,

                startCreateTime,
                endCreateTime,
                startUpdateTime,
                endUpdateTime,
            };

            for (const key in searchParam){
                if(!searchParam[key]){
                    delete searchParam[key];
                }
            }

            const res = await this.$get(this.$API_ENUM.INSTANCE_DOWNLOAD, searchParam);

            if(this.$resOk(res)){
                this.$Message.success(res.message);
            }else {
                this.$Message.error(res.message);
            }
        }
    }

</script>