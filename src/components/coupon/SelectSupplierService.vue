<style scoped lang="scss">
    .select-supplier-service {
        /deep/ .row-selected {
            td {
                background: #209ce2;
                color: #fff;
            }
        }
    }
</style>

<template>
    <Row class="  select-supplier-service">
        <ci-search-panel :add="false" @search="(data) => mxDoSearch(data)" :searchFormConfig="searchFormConfig"/>
        <Table :columns="columns" :data="listData" :loading="loading" @on-row-click="selectRow"
               :row-class-name="getRowClassName"></Table>
        <Page
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
    </Row>
</template>
<script lang="ts">
    import {ListMixin} from '../../mixin/index';

    import {Component, Prop} from 'vue-property-decorator';

    @Component({})
    export default class extends ListMixin {
        @Prop({default: ''}) id: string = '';

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

        columns: Array<any> = [
            {
                title: '服务名称',
                key: 'name',
                align: 'center',
            },
            {
                title: '供应商',
                key: 'supplierName',
                align: 'center',
            },

        ];

        searchAPI: string = `${this.$API_ENUM.SUPPLIER_SERVICES}?available=1`;

        useRecord: boolean = false;

        mounted() {

        }

        mxFormListData(rows) {
            return rows.map(item => {
                const {supplier: {name: supplierName, id: supplierId}, citicService: {name: citicServiceName, id: citicServiceId}} = item;
                item.supplierName = supplierName;
                item.supplierId = supplierId;
                item.citicServiceName = citicServiceName;
                item.citicServiceId = citicServiceId;
                return item
            })
        }

        selectRow(row, index) {
            this.$emit("submit", row);
        }

        getRowClassName(row, index) {
            if (row.id === this.selectedId) {
                return "row-selected";
            }
            return "";
        }

        get selectedId() {
            return this.id;
        }

    }
</script>
