<style scoped lang="scss">

    .shuttle-select {
        padding-bottom: 60px;

        .btn-group {
            text-align: center;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 25px;
            z-index: 99;
        }

        .search-input{
            margin-bottom: 15px;
        }

      /deep/  table{
          .ivu-table-cell-with-selection{
              padding-left: 5px;
              padding-right: 5px;
          }

            .ivu-checkbox-inner{
                width: 30px;
                height: 30px;

                &::after{
                    width: 8px;
                    height: 16px;
                    top: 4px;
                    left: 10px;
                }
            }
        }
    }


</style>
<template>
    <div class="shuttle-select">
        <i-input class="search-input" v-model="searchName" placeholder="code/名称搜索"></i-input>

        <Table :columns="columns" :data="listData" :loading="loading"
               @on-selection-change="selectKeyChange"
        ></Table>

        <div class="btn-group">
            <Button type="primary" long :disabled="selectIds.length === 0" @click="submit">添加节点({{`${selectIds.length}/${listData.length}`}})</Button>
        </div>
    </div>
</template>
<script lang="ts">

    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Loading} from "@/function/public/loadingAnnotation";

    @Component({
        name: 'ci-shuttle-select'
    })
    export default class extends Vue {
        @Prop() node!: TreeNode;
        @Prop() parentKeyIds!: Array<string>;

        searchName: string = "";

        serviceId: string = '';
        actionId: string = '';

        selectIds: Array<string> = [];

        optionsList: Array<TreeData> = [];

        loading: boolean = false;

        columns = [
            {
                type: 'selection',
                width: 40,
                align: 'center',
                fixed: 'left'
            },
            {
                title: 'code',
                key: 'code',
                align: 'center',
                minWidth: 200,
                sortable: true
            },
            {
                title: '名称',
                key: 'label',
                align: 'center',
                minWidth: 200,
                sortable: true
            },
            {
                title: '备注',
                minWidth: 300,
                key: 'remark',
            },
        ];

        created() {
            const {serviceId, actionId} = this.$route.query;
            this.serviceId = `${serviceId}`;
            this.actionId = `${actionId}`;

            this.updateOptions();
        }

        /**
         * 节点选中状态改变
         */
        selectKeyChange(value) {
            const selectIds: Array<string> = [];
            value.forEach(item => selectIds.push(item.id));
            this.selectIds = selectIds;
        }

        /**
         * 提交选中的节点列表
         */
        submit() {
            this.$emit("submit", this.optionsList.filter(item => this.selectIds.includes(item.id)));
            this.selectIds = [];
        }

        /**
         * 节点切换更新可选项
         */
        updateOptions() {
            if (this.node.isKey) {
                this.getValueOptions();
            } else {
                this.getKeyOptions();
            }
        }

        /**
         * 根据当前节点获取对应的key选项列表
         */
        @Loading()
        async getKeyOptions() {
            this.optionsList = [];
            // 不使用 actionId 加载树，树配置在service上
            // const res = await this.$get(this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONS_KEY_ACTION_ID.Format(this.actionId));
            const res = await this.$get(`${this.$API_ENUM.CITIC_SERVICE_OPTIONSKEY_LIST}?available=1&pageSize=999&serviceId=${this.serviceId}`);

            this.optionsList = res.data.records.map(item => {

                const {id, code, displayName: label, remark} = item;

                return {
                    isKey: true,
                    id,
                    code,
                    label,
                    remark,
                }
            });
        }

        /**
         * 根据当前节点获取对应的value选项列表
         */
        @Loading()
        async getValueOptions() {
            this.optionsList = [];
            const res = await this.$get(this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONS_VALUE_KEY_ID.Format(this.node.id));

            this.optionsList = res.data.map(item => {

                const {id, code, displayName: label} = item;

                return {
                    isKey: false,
                    id,
                    code,
                    label,
                }
            });
        }

        /**
         * 生成选项列表，过滤掉已经选过的选项
         */
        get listData() {
            this.selectIds = [];
            const node = this.node;
            const childList = (node ? node.child || [] : []);
            const exitNode: Array<string> = childList.map(item => item.id);

            const searchName = this.searchName.toLocaleLowerCase() || '';

            // 将已经选中过的节点过滤掉
            return this.optionsList
            // 过滤掉当前节点下已经存在的选项
                .filter(item => !exitNode.includes(item.id))
                // 选项为key列表时，过滤掉当前节点的父节点已经出现过的key,防止出现key嵌套的关联配置
                .filter(item => !this.parentKeyIds.includes(item.id))
                // 按照搜索名模糊查询
                .filter(item => {
                    return item.label.toLocaleLowerCase().includes(searchName) ||
                        item.code.toLocaleLowerCase().includes(searchName);
                });
        }

        @Watch("node")
        nodeChange() {
            this.updateOptions()
        }
    }

</script>
