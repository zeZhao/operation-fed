<style scoped lang="scss">
    .select-supplier {
        /deep/ .row-selected {
            td {
                background: #209ce2;
                color: #fff;
            }
        }
    }
</style>

<template>
    <Row class="  select-supplier">
        <ci-search-panel :add="false" @search="(data) => mxDoSearch(data)" :searchFormConfig="searchFormConfig"/>
        <Table :columns="columns" :data="listData" :loading="loading" @on-row-click="selectRow"
               :row-class-name="getRowClassName"></Table>
        <Page :total="total"
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
                label: '供应商名称',
                placeholder: '输入名称',
            }
        ];

        columns: Array<any> = [
            {
                title: '供应商名称',
                key: 'name',
                align: 'center',
            },
            {
                title: '短名称',
                key: 'shortname',
                align: 'center',
            },
        ];

        searchAPI: string = `${this.$API_ENUM.SUPPLIER_SUPPLIERS}?available=1`;

        useRecord: boolean = false;

        selectRow(row) {
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
