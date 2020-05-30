<style scoped lang="scss">
    .select-tenant {
        /deep/ .row-selected {
            td {
                background: #209ce2;
                color: #fff;
            }
        }

        .select-btn {
            width: 100px;
        }

        .count {
            padding: 0 10px;
        }

        .footer {
            text-align: center;
            margin: 40px 0 20px 0;

            button {
                width: 200px;
                margin: 0 10px;
            }
        }
    }
</style>

<template>
    <Row class="  select-tenant">
        <ci-search-panel :add="false" @search="(data) => mxDoSearch(data)" :searchFormConfig="searchFormConfig">
            <Button type="primary" @click="selectAllRow" class="select-btn">{{selectAll ? '取消全选' : '全选'}}</Button>

            <span>已选择:
                <span class="count">{{selectedCount}}/{{total}}</span>
            </span>
        </ci-search-panel>
        <Table :columns="columns" :data="listData" :loading="loading" @on-row-click="selectRow"
               :row-class-name="getRowClassName"></Table>
        <br>
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


        <div class="footer">
            <Button type="primary" @click="submit">确认</Button>
            <Button type="error" @click="cancel">取消</Button>
        </div>
    </Row>
</template>
<script lang="ts">
    import {ListMixin} from '../../mixin/index';

    import {Component, Prop, Watch} from 'vue-property-decorator';

    @Component({})
    export default class extends ListMixin {
        @Prop({default: []}) selectTenantList?: Array<any>;

        searchFormConfig: Array<any> = [
            {
                type: 'input',
                key: 'name',
                label: '租户名称',
                placeholder: '输入名称',
            }
        ];

        columns: Array<any> = [
            {
                title: '租户名称',
                key: 'companyName'
            }, {
                title: '备注',
                key: 'description'
            }];


        searchAPI: string = this.$API_ENUM.TENANTS_PAGE;

        selectedIds: any = {};

        selectedCount: number = 0;

        selectAll: boolean = false;

        useRecord: boolean = false;

        mounted() {

        }

        selectAllRow() {
            if (!this.selectAll) {
                (this.$Spin as any).show();
                this.$get(this.searchAPI, {
                    pageIndex: 1,
                    pageSize: this.total,
                    ...this.searchParam
                }).then(res => {
                    res.data.content.forEach(item => {

                        item.id = item.citicId;

                        const company = {
                            id: '',
                            companyName: item.fullname,
                            ...item
                        };
                        this.selectedIds[company.id] = company;
                    });

                    this._updateSelectedStatus();

                    this.selectAll = this._checkSelectedAll();
                    (this.$Spin as any).hide();
                });
            } else {
                this.clearALL();
            }
        }

        selectRow(row, index) {
            const data = this.listData[index];

            if (!data._selected) {
                this.selectedIds[row.id] = row;
            } else {
                delete this.selectedIds[row.id];
            }
            this._updateSelectedStatus();

            this.selectAll = this._checkSelectedAll();
        }

        getRowClassName(row, index) {
            if (this.selectedIds[row.id]) {
                return "row-selected";
            }
            return "";
        }

        _checkSelectedAll() {
            return this._getSelectedCount() === this.total;
        }

        _getSelectedCount() {
            let count = 0;
            for (const id in this.selectedIds) {
                count++;
            }
            this.selectedCount = count;
            return count;
        }

        _updateSelectedStatus() {
            this.listData = this.listData.map(item => {
                item._selected = !!this.selectedIds[item.id];
                return item;
            });
        }

        mxFormListData(row) {
            return row.map(item => {

                item.id = item.citicId;

                const company = {
                    id: '',
                    _selected: false,
                    companyName: item.fullname,
                    ...item
                };
                company._selected = !!this.selectedIds[company.id];
                return company;
            })
        }

        submit() {
            const resList: Array<any> = [];
            const selectedIds = this.selectedIds;
            for (const id in selectedIds) {
                resList.push(selectedIds[id]);
            }
            this.$emit('submit', resList);
        }

        cancel() {
            this.clearALL();

            this.$emit('submit', this.selectTenantList);
        }

        clearALL() {
            this.selectedIds = {};
            this._updateSelectedStatus();
            this.selectAll = this._checkSelectedAll();
        }

        @Watch('selectTenantList')
        //外部修改过的列表数据,外部数据修改,内部需要更新选中数据
        tenantListChange(array) {
            const selectedIds = {};

            array.forEach(item => {
                selectedIds[item.id] = item;
            });
            this.selectedIds = selectedIds;

            this.$nextTick(this._updateSelectedStatus);
        }

    }
</script>
