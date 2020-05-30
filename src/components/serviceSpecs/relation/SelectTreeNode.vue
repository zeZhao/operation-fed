<style scoped lang="scss">
    .select-tree-node {
        font-size: 14px;
        color: #333;
        padding-left: 20px;

        .select-item {
            margin-bottom: 10px;
            font-size: 14px;
            color: #333;
            display: flex;
            flex-direction: row;
            align-items: center;

            .fold-btn {
                margin-right: 5px;
                cursor: pointer;
            }

            .empty-placeholder {
                width: 14px;
                height: 14px;
                margin-right: 5px;
                display: inline-block;
            }

            .check-box {
                cursor: pointer;
                transition: .3s;
                display: inline-block;
                min-width: 20px;
                height: 20px;
                background: url("../../../assets/svg/public/check-box-empty.svg") no-repeat center;
                background-size: contain;

                &.select {
                    background: url("../../../assets/svg/public/check-box-active.svg") no-repeat center;
                    background-size: contain;
                }
            }

            .label {
                margin-left: 10px;
                display: inline-block;
                cursor: pointer;
                transition: .3s;
                color: #666;
                word-break: break-all;
                padding-right: 10px;

                &.root-node {
                    color: #000;
                }

                &.key-node {
                    font-weight: bold;
                    color: #333;
                }

                &.choose {
                    color: #2d8cf0;
                    text-decoration: #2d8cf0 underline;
                    font-weight: bold;
                }

                .remark {
                    font-weight: normal;
                    color: #999999;
                }
            }
        }
    }
</style>

<template>
    <div class="select-tree-node">

        <div class="select-item">
            <template v-if="!node.isRoot">
                <Icon v-if="hasChild"
                      :type="showChild ? 'md-remove':'md-add'"
                      class="fold-btn"
                      @click="singleNodeFoldChild"></Icon>
                <span v-else class="empty-placeholder"></span>
            </template>

            <span v-if="!node.isRoot"
                  class="check-box"
                  :class="{'select': node.select}"
                  @click="singleNodeSelectChange"></span>

            <label class="label" :class="{'choose': node.choose, 'key-node': node.isKey, 'root-node': node.isRoot}"
                   @click="singleNodeChooseChange">{{node.label}}{{ node.isRoot ? '' : `(${node.code})`}}
                <em class="remark">{{nodeRemark}}</em></label>
        </div>

        <ci-select-tree-node v-if="showChild"
                             v-for="nodeItem of node.child"
                             :node="nodeItem"
                             :key="nodeItem.uniqueId"
                             @selectChange="groupNodeSelectChange"
                             @chooseChange="groupNodeChooseChange"
                             @foldChange="groupNodeFoldChange"
        ></ci-select-tree-node>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";

    @Component({
        name: 'ci-select-tree-node'
    })
    export default class extends Vue {
        @Prop() node!: TreeNode;
        @Prop() choose!: Boolean;

        /**
         * 单个节点改变选中状态
         */
        singleNodeSelectChange() {
            this.node.select = !this.node.select;
            this.$emit("selectChange");
        }

        groupNodeSelectChange() {
            this.$emit("selectChange");
        }

        /**
         * 当前节点选中状态变化
         */
        singleNodeChooseChange() {
            this.node.choose = !this.node.choose;
            this.$emit('chooseChange', this.node);
        }

        /**
         * 当前分组中某个节点选中状态变化，将事件向上抛出，传递到SelectTree组件统一处理
         * @param node
         */
        groupNodeChooseChange(node) {
            this.$emit('chooseChange', node);
        }

        /**
         * 单个节点展开，收起状态改变
         */
        singleNodeFoldChild() {
            this.node.fold = !this.node.fold;
            this.$emit("foldChange");
        }

        groupNodeFoldChange() {
            this.$emit("foldChange");
        }

        get hasChild() {
            return this.node.child && this.node.child.length !== 0;
        }

        get showChild() {
            return !this.node.fold;
        }

        get nodeRemark() {
            return this.node.remark ? `(${this.node.remark})` : '';
        }
    }
</script>
