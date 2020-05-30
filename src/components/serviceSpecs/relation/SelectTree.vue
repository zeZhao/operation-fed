<style scoped lang="scss">

    .content {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        flex-grow: 1;

        .relation-tree {
            height: 100%;
            overflow: auto;
            flex-grow: 1;
            margin-right: 10px;

            .tree-group {
                padding: 20px 0 10px 0;
            }
        }

        .edit-panel {
            height: 100%;
            padding-left: 16px;
        }
    }

</style>

<template>
    <div class="content" v-if="tree.length">

        <Split v-model="split">
            <div slot="left" class="relation-tree">
                <!--关系树-->
                <ci-select-tree-node class="tree-group"
                                     :node="tree[0]"
                                     @chooseChange="nodeChooseStatusChange"
                                     @selectChange="treeChange"
                                     @foldChange="treeChange"
                ></ci-select-tree-node>
            </div>
            <div slot="right" class="edit-panel">
                <ci-relation-edit-panel :root="tree[0]"
                                        :node="chooseNode"
                                        @deleteChooseNode="deleteChooseNode"
                                        @treeChange="treeChange"
                                        @revoke="revoke"
                                        @redo="redo"
                                        @loadTree="loadTree"
                                        @saveTree="saveTree"
                                        @fold="fold"
                                        @spread="spread"
                ></ci-relation-edit-panel>

                <!--选择其他操作的树-->
                <Modal v-model="selectModal"
                       title="选择一个操作的关联关系"
                       @on-ok="loadTreeData">
                    <label>
                        <Select v-model="loadActionId" style="margin: 30px 0;">
                            <OptionGroup v-for="(actionGroup, index) in actionList" :key="index" :label="actionGroup.name">
                                <Option v-for="action in actionGroup.actions" :value="action.id" :key="action.id">
                                    {{action.actionName}}
                                </Option>
                            </OptionGroup>
                        </Select>
                    </label>
                </Modal>
            </div>
        </Split>
    </div>
</template>

<script lang="ts">
    // @ts-ignore
    import SelectTreeNode from './SelectTreeNode.vue';
    // @ts-ignore
    import RelationEditPanel from '../../../components/serviceSpecs/relation/RelationEditPanel.vue';

    import {Component, Prop, Vue} from "vue-property-decorator";
    import {
        ActionStack,
        deepCopy,
        ergodicNode,
        structureTreeNode,
    } from "@/function/serviceSpecs";
    import {Loading} from "@/function/public/loadingAnnotation";
    import {Throttle} from "@/function/public/throttleAnnotation";

    @Component({
        name: 'SelectTree',
        components: {
            'ci-select-tree-node': SelectTreeNode,
            'ci-relation-edit-panel': RelationEditPanel
        }
    })
    export default class extends Vue {
        // 服务id
        @Prop() serviceId !: string;
        @Prop() actionId !: string;

        split: number = 0.5;

        tree: Array<TreeNode> = [];

        chooseNode?: TreeNode | null = null;

        // 操作记录栈，最多保存20条记录
        redoStack: ActionStack<TreeNode> = new ActionStack<TreeNode>();

        // 选择操作类型的弹窗
        selectModal: boolean = false;
        // 准备加载的操作类型
        loadActionId: string = '';
        // action列表
        actionList: Array<any> = [];
        // 当前操作详情信息
        actionInfo: any = {};

        created() {
            // 不使用 actionId 加载树，树配置在service上
            // this.loadActionInfo().then(()=>{
            //     this.loadActionRelation(this.actionId);
            // })

            this.loadActionRelation(this.actionId);
        }

        /**
         * 加载操作详情
         */
        async loadActionInfo() {
            const res = await this.$get(`${this.$API_ENUM.CITIC_SERVICE_CONFIG_ACTION_ID}/${this.actionId}`);
            this.actionInfo = res.data;
        }

        /**
         * 根据action加载树
         */
        @Loading()
        async loadActionRelation(actionId: string) {
            // 不使用 actionId 加载树，树配置在service上
            const res = await this.$get(`${this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONS_RELATION_TREE}/${this.serviceId}`);
            // 替换根节点名称
            const relationNode = res.data.relationNode;
            // 不使用 actionId 加载树，树配置在service上
            // relationNode.label = this.actionInfo.actionName;
            this.createTree([relationNode]);
        }

        /**
         * 根据初始化数据创建树节点属性
         */
        createTree(data: Array<TreeData>) {
            data = deepCopy(data);
            this.tree = structureTreeNode(data);
            this.treeChange();
            console.log("this.tree", this.tree);
        }

        /**
         * 节点选中状态变化
         * @param node
         */
        nodeChooseStatusChange(node: TreeNode) {
            // 将老的节点选中状态清空
            if (this.chooseNode) {
                this.chooseNode.choose = false;
            }
            // 新节点选中则记录新节点，取消选中则设置“选中节点”为空
            this.chooseNode = node.choose ? node : undefined;

            this.treeChange();
        }

        /**
         * 选中的节点被移除
         */
        deleteChooseNode() {
            this.chooseNode = undefined;
        }

        /**
         * 树状态改变记录一次操作
         */
        treeChange() {
            const record: TreeNode = deepCopy(this.tree[0]);
            this.redoStack.do(record);
            console.log("treeChange record:", record);
        }

        /**
         * 选择一个已有的树加载
         */
        loadTree() {
            this.selectModal = true;
            // 清空上次选项
            this.loadActionId = "";

            this.$get(`${this.$API_ENUM.CITIC_SERVICE_CONFIG_ACTION_SERVICE_ID}/${this.serviceId}?available=true`).then(res => {
                const actions = res.data.actions;

                const actionList: Array<any> = [];

                for (const group in actions) {
                    actionList.push({
                        name: group,
                        actions: actions[group]
                    });
                }

                this.actionList = actionList;
            });
        }

        /**
         * 根据选择的操作加载树结构
         */
        loadTreeData() {
            this.chooseNode = undefined;
            this.loadActionRelation(this.loadActionId);
        }

        /**
         * 撤销一次操作
         */
        @Throttle()
        revoke() {
            this.redoStack.revoke(treeRecord => this.reRenderTree(treeRecord, `撤销成功`), () => this.$Message.info(`没有可撤销记录`));
        }

        /**
         * 重做一次操作
         */
        @Throttle()
        redo() {
            this.redoStack.redo(treeRecord => this.reRenderTree(treeRecord, `重做成功`), () => this.$Message.info(`没有可重做记录`));
        }

        /**
         * 折叠全部节点
         */
        @Throttle()
        fold(node) {
            ergodicNode(node || this.tree[0], (item) => {
                item.fold = true;
                return false;
            }, true);
            this.$Message.success(`操作成功`);
            this.treeChange();
        }

        /**
         * 展开全部节点
         */
        @Throttle()
        spread(node) {
            ergodicNode(node || this.tree[0], (item) => {
                item.fold = false;
                return false;
            }, true);
            this.$Message.success(`操作成功`);
            this.treeChange();
        }

        /**
         * 根据记录将树恢复到一个状态节点
         * @param tree
         * @param msg
         */
        reRenderTree(tree: TreeNode, msg?: string) {
            this.tree = [tree];

            /**
             * 查找记录中被选中的节点，不能直接获取stack中的记录，
             * stack中的记录 chooseNode 和 tree 中真正
             * 被选中的元素已经是不同的引用
             */
            ergodicNode(this.tree[0], (item) => {
                if (item.choose) {
                    this.chooseNode = item;
                    return true;
                }
            }, false);

            this.$Message.success(msg || `操作成功`);
        }

        /**
         * 保存关联关系树
         */
        @Loading()
        // 同时使用防止重复提交注解添加在加载样式之前，作为第一层装饰器
        @Throttle()
        async saveTree() {
            const res = await this.$post(`${this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONS_RELATION_TREE}`, {
                // 不使用 actionId 加载树，树配置在service上
                // actionId: this.actionId,
                serviceId: this.serviceId,
                relationNode: this.tree[0],
            });

            if (this.$resOk(res)) {
                this.$Message.success("保存成功");
            } else {
                this.$Message.error(res.message)
            }
        }
    }

</script>
