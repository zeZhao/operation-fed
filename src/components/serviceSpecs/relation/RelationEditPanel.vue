<style scoped lang="scss">
    .relation-edit-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;

        .title {
            text-align: center;
        }

        .public-action-panel {

        }

        .node-action-panel {
            flex-grow: 1;
            overflow: auto;
            padding-right: 16px;
        }
    }
</style>

<template>
    <div class="relation-edit-panel">

        <div class="public-action-panel">
            <Form ref="form" :label-width="80">
                <h3 class="title">全局操作</h3>
                <br>
                <FormItem label="">
                    <ButtonGroup shape="circle">
                        <Button @click="clearSelectStatus" icon="md-link">清空选中</Button>
                        <Button @click="copySelectNode" icon="ios-copy-outline">复制</Button>
                        <Button @click="cutSelectNode" icon="ios-cut-outline">剪切</Button>
                        <Button type="error" @click="deleteSelectNode" icon="ios-trash">删除选中</Button>
                    </ButtonGroup>
                </FormItem>

                <FormItem label="">
                    <ButtonGroup shape="circle">
                        <Button @click="fold(root)" icon="md-remove">折叠</Button>
                        <Button @click="spread(root)" icon="md-add">展开</Button>
                        <Button @click="revoke" icon="ios-redo">撤销</Button>
                        <Button @click="redo" icon="ios-undo">重做</Button>
                        <!--不使用 actionId 加载树，树配置在service上-->
                        <!--<Button @click="loadTree" icon="md-cloud-download">加载</Button>-->
                        <Button @click="saveRelation" icon="md-cloud-upload">保存</Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
        </div>

        <div class="node-action-panel" v-if="node">
            <h3 class="title">编辑节点</h3>
            <br>
            <Form ref="form" :label-width="80">

                <FormItem label="节点操作：">
                    <ButtonGroup shape="circle">
                        <Button @click="fold(node)" icon="md-remove">折叠</Button>
                        <Button @click="spread(node)" icon="md-add">展开</Button>

                        <Button @click="selectChild" :disabled="selectChildBtnDisabled" icon="md-checkbox-outline">
                            选中子节点
                        </Button>
                        <Button @click="stickNode" icon="ios-copy">
                            粘贴
                        </Button>
                        <Button type="error" @click="deleteChooseNode" :disabled="deleteChooseNodeBtnDisabled" icon="ios-trash">
                            删除节点
                        </Button>
                    </ButtonGroup>
                </FormItem>

                <FormItem label="节点：">
                    {{node.label}}({{node.code}})
                </FormItem>

                <!--<FormItem label="节点id：">
                    {{node.id}}
                </FormItem>

                <FormItem label="节点code：">
                    {{node.code}}
                </FormItem>

                <FormItem label="节点名称：">
                    {{node.label}}
                </FormItem>

                <FormItem label="节点类型：">
                    {{nodeType}}
                </FormItem>-->

                <ci-shuttle-select :node="node" :parentKeyIds="parentKeyIds" @submit="submitNodes"></ci-shuttle-select>
            </Form>
        </div>

    </div>
</template>

<script lang="ts">
    // @ts-ignore
    import ShuttleSelect from './ShuttleSelect.vue';
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {
        breadthErgodic,
        ergodicNode,
        collectionParentKeyId,
        collectionChildKeyId,
        deepCopy, structureTreeNode, createUniqueId,
    } from "@/function/serviceSpecs";
    import {Loading} from "@/function/public/loadingAnnotation";
    import {Throttle} from "@/function/public/throttleAnnotation";

    @Component({
        name: 'RelationEditPanel',
        components: {
            'ci-shuttle-select': ShuttleSelect,
        }
    })
    export default class extends Vue {
        @Prop() root!: TreeNode;
        @Prop() node?: TreeNode;

        copyNodeArray: Array<TreeNode> = [];

        created() {

        }

        /**
         * 加载其他操作的树
         */
        loadTree() {
            this.$emit('loadTree')
        }

        /**
         * 撤销
         */
        revoke() {
            this.$emit('revoke')
        }

        /**
         * 重做
         */
        redo() {
            this.$emit('redo')
        }

        fold(node){
            this.$emit('fold', node)
        }

        spread(node){
            this.$emit('spread', node)
        }

        /**
         * 清空选中状态
         */
        clearSelectStatus() {
            // 标记此次操作树节点状态是否真的发生了变化
            let changeMark = false;

            ergodicNode(this.root, (item) => {
                if (item.select) {
                    changeMark = true;
                    item.select = false;
                }
            }, false);

            if (changeMark) {
                this.$emit('treeChange');
            }
        }

        /**
         * 全选中子节点
         */
        selectChild() {
            if (!this.node) {
                return
            }

            // 标记此次操作树节点状态是否真的发生了变化
            let changeMark = false;

            ergodicNode(this.node, (item) => {
                if (!item.select) {
                    changeMark = true;
                    item.select = true;
                }
            });

            if (changeMark) {
                this.$emit('treeChange');
            }
        }

        /**
         * 删除节点
         */
        deleteNodeByTarget(target: TreeNode = this.root): boolean {
            // 标记此次操作树节点状态是否真的发生了变化
            let changeMark = false;

            // 判断choose的节点是否被删除了
            ergodicNode(target, (item) => {
                if (item.select && this.node && item === this.node) {
                    this.$emit("deleteChooseNode");
                    return true;
                }
            }, false);

            // 过滤所有被删除的节点
            ergodicNode(target, (item) => {
                if (item.child) {
                    item.child = item.child.filter(son => {
                        // 有选中的元素，说明会被移除
                        if (son.select) {
                            changeMark = true;
                        }
                        return !son.select;
                    });
                }
            }, false);

            if (changeMark) {
                this.$emit("treeChange");
            }

            return changeMark;
        }

        /**
         * 删除选中的子节点
         */
        deleteSelectNode() {
            if (this.deleteNodeByTarget()) {
                this.$Message.success("节点删除成功");
            } else {
                this.$Message.info("没有选中的节点");
            }
        }

        /**
         * 复制、剪切节点的公共方法
         */
        copyNode(cut: boolean = false) {
            if (!this.root) {
                throw `根节点不存在`;
            }

            /**
             * 1.找到最靠近根节点的选中的父节点作为拷贝的起点
             *   使用广度优先遍历 因为可能被选中的节点是两个平级节点
             */
            const res: Array<TreeNode> = breadthErgodic(this.root.child);
            console.log("搜索结果", res);

            if (res.length === 0) {
                throw `没有选中的节点`;
            }

            /**
             * 2.以搜索结果为入口，生成复制结果
             *   深拷贝一次，拷贝完需要重新生成 uniqueId
             */
            const copy: Array<TreeNode> = deepCopy(res);

            /**
             * [检测]复制的入口节点是否存在重复
             */
            const entrySet = new Set(copy.map(entryNode => entryNode.id));
            if (entrySet.size !== copy.length) {
                console.log(`entrySet: ${entrySet.size}, copy: ${copy.length}`);
                throw `节点选择重复`;
            }

            console.log("copy", copy);

            // 复制的节点个数
            let copyNodeCount = 0;
            // 所有选中的节点个数
            let selectNodeCount = 0;
            // 入口节点的所有子节点都选中的标记
            let selectAllChild = true;

            // 将复制后的节点中没有选中的节点过滤掉
            copy.forEach((node: TreeNode) => {
                ergodicNode(node, (item: TreeNode) => {

                    if (!item.select) {
                        selectAllChild = false;
                        // 当前节点没有选中，返回true中断深度遍历
                        return true;
                    }

                    // 入口节点的联通节点自增
                    copyNodeCount++;

                    // 包含子节点首先过滤子节点
                    if (item.child) {
                        item.child = item.child.filter(son => {
                            // 标记不是所有子节点都被选中了，剪切时必须选中所有子节点
                            if (!son.select) {
                                selectAllChild = false;
                            }
                            return son.select;
                        });

                        if (item.child && item.child.length === 0) {
                            delete item.child;
                        }
                    }

                }, false)
            });

            if (cut && !selectAllChild) {
                throw `没有选中入口节点的所有子节点`;
            }

            /**
             * [检测]选中的节点个数 和 目标复制节点个数是否相同
             * 相同则表示没有以下两种情况：
             * 1.作为起点的节点之外还有其他可作为起点的节点存在，只是层级更低所以没有被选为起点
             * 2.入口节点的子节点出现斩断的节点
             */
            // 统计所有选中的节点
            ergodicNode(this.root, (item: TreeNode) => {
                if (item.select) {
                    selectNodeCount++;
                }
            }, false);

            if (copyNodeCount !== selectNodeCount) {
                console.log(`copyNodeCount: ${copyNodeCount}, selectNodeCount: ${selectNodeCount}`);
                throw `节点选择有错误`;
            }

            console.log("copy 过滤后节点", copy);
            this.copyNodeArray = copy;
            this.$emit("copyNode", copy);
        }

        /**
         * 复制全体选中的节点
         *
         * 复制规则：
         * 1.复制时最靠近根层的选中节点作为复制入口，例如选中：根节点下第一层第一个节点，同时选中根节点下第一层第二个节点下的其他节点
         *   拷贝时只拷贝根节点下第一层第一个节点下的节点
         * 2.拷贝时出现断层，则拷贝终止在断层一级，断层以下的子节点不拷贝
         *
         * 复制规则中出现的两种情况在方法内使用统计两种节点（与入口节点联通的节点，所有选中节点）个数的方式校验
         */
        copySelectNode() {
            try {
                this.copyNode();
                this.$Message.success("节点复制成功");
            } catch (e) {
                this.$Message.error(`节点复制错误：${e}`);
            }
        }

        /**
         * 剪切选中的节点
         */
        cutSelectNode() {
            try {
                this.copyNode(true);
                this.deleteNodeByTarget();
                this.$Message.success("节点剪切成功");
            } catch (e) {
                this.$Message.error(`节点剪切错误：${e}`);
            }
        }

        /**
         * 粘贴复制节点的结果
         */
        @Throttle()
        stickNode() {
            if (!this.node) {
                return;
            }

            try {
                this.stickCheck();
            } catch (e) {
                this.$Message.error(e);
                console.log(e)
                return;
            }

            // 深拷贝一次复制节点,防止粘贴后再继续操作，影响到复制的内容
            const copyNodeArray = deepCopy(this.copyNodeArray);

            this.nodeAddChild(copyNodeArray);

            // 复制完成后清空拷贝的对象
            this.$emit("treeChange");
            this.$Message.success("粘贴成功")
        }

        /**
         * 删除当前节点
         */
        deleteChooseNode() {
            ergodicNode(this.root, (item) => {
                if (item.child) {
                    item.child = item.child.filter(son => {

                        // 删除当前选中的节点
                        if (son === this.node) {
                            this.$emit("deleteChooseNode")
                        }

                        return son !== this.node;
                    });
                }
            }, false);

            this.$emit("treeChange");
            this.$Message.success("节点删除成功");
        }

        /**
         * 尽可能在操作中避免出现需要校验的错误
         * 1.是否同一级节点包含了重复的 keyId 或 valueId (已经避免)
         * 2.节点向下遍历检查子节点中是否出现相同的key节点 防止出现key嵌套 (已经避免)
         * 3.根节点下的一级子节点必须包含value子节点，其他层级不校验
         * 4.校验当前树的key节点是否是超出了关联的key范围
         */
        @Loading()
        async checkTree() {
            // 3.根节点下的一级子节点必须包含value子节点，其他层级不校验
            if(this.root && this.root.child){
                const child = this.root.child;
                for(const item of child){
                    if(!item.child || item.child.length === 0){
                        throw '根节点下的一级子节点必须包含value子节点';
                    }
                }
            }

            // 由于 不使用 actionId 加载树，树配置在service上 无法添加校验
            // 4.校验当前树的key节点是否是超出了关联的key范围
            // const keyLimitSet = new Set<string>();
            // const keySet = new Set<string>();
            // ergodicNode(this.root, (item: TreeNode) => {
            //     if (item.isKey) {
            //         keySet.add(item.id);
            //     }
            // }, false);
            //
            // // 查询当前action可以选择的key列表
            // const {actionId} = this.$route.query;
            // const res = await this.$get(this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONS_KEY_ACTION_ID.Format(actionId));
            // res.data.forEach(item => keyLimitSet.add(item.id));
            //
            // console.log("keySet:",keySet, "keyLimitSet:", keyLimitSet);
            //
            // for(const id of keySet){
            //     // 可选列表中不包含key
            //     if(!keyLimitSet.has(id)){
            //         throw `id为：【${id}】,不在当前action配置的key列表中`;
            //     }
            // }
        }

        /**
         * 保存关联关系
         */
        saveRelation() {
            this.checkTree()
                .then(() => this.$emit('saveTree'))
                .catch(e => this.$Message.error(e));
        }

        /**
         * 添加叶子节点
         */
        submitNodes(nodes) {
            if (!this.node) {
                return;
            }

            const res: Array<TreeNode> = structureTreeNode(nodes, this.node);

            console.log(`结构化后的数据：`, res);

            this.nodeAddChild(res);

            this.$emit("treeChange");
        }

        /**
         * 给指定节点添加子节点
         * @param child
         * @param node
         */
        nodeAddChild(child: Array<TreeNode>, node: TreeNode | undefined = this.node) {
            if (!node) {
                return;
            }

            /**
             * 重新为所有节点生成新的 uniqueId
             * 初始化节点属性
             */
            child.forEach((node: TreeNode) => {
                ergodicNode(node, (item: TreeNode) => {
                    item.uniqueId = createUniqueId();
                    item.select = false;
                    item.choose = false;
                }, false)
            });
            console.log("copy 重新生成uniqueId后节点", child);

            if (node.child) {
                node.child.push(...child);
            } else {
                this.$set(node, 'child', child);
            }
        }

        /**
         * 粘贴按钮禁止点击
         * 1.没有选中操作节点
         * 2.复制的节点为空列表
         * 3.复制的节点与当前节点关系不满足 key 下加 value 或 value 下加 key
         * 4.当前选中的节点的直接子节点中是否包含复制结果集中的节点（同一级子节点不能重复）
         * 5.复制节点是value 需要判断 当前value节点是否是属于 选中的 key节点
         * 6.当前choose节点的所有父 key节点 是否包含了 复制结果中的key的id，包含则说明key进行了嵌套关联
         */
        stickCheck() {

            // 1.没有选中操作节点
            if (!this.node) {
                throw '没有选中操作节点';
            }

            // 2.复制的节点为空列表
            if (this.copyNodeArray.length === 0) {
                throw '复制的节点为空列表';
            }

            // 3.复制的节点与当前节点关系不满足 key 下加 value 或 value 下加 key
            const firstCopyNode = this.copyNodeArray[0];
            const isKeyNode = firstCopyNode.isKey;

            // key 下加 value 或 value 下加 key
            if (isKeyNode === this.node.isKey) {
                throw `复制的结果类型为【${isKeyNode ? 'key' : 'value'}】类型,不能粘贴到同类型节点下`
            }

            // 4.当前选中的节点的直接子节点中是否包含复制结果集中的节点
            const currentNodeChild: Array<TreeNode> = this.node.child || [];

            for (const childNode of currentNodeChild) {
                const duplicateNode = this.copyNodeArray.find(item => item.code === childNode.code);
                if (duplicateNode) {
                    throw `复制的结果集与当前选中节点子节点重复,重复节点：${duplicateNode.label}`
                }
            }

            // 5.复制节点是value 需要判断 当前value节点是否是属于 选中的 key节点
            if (!isKeyNode) {
                if (firstCopyNode.belongKeyId !== this.node.id) {
                    throw `当前value节点不属于选中的key节点,belongKeyId:【${firstCopyNode.belongKeyId}】,chooseNodeId:【${this.node.id}】`;
                }
            }

            // 6.当前choose节点的所有父 key节点 是否包含了 复制结果中的key的id，包含则说明key进行了嵌套关联
            // 从选中节点，递归向上查找所有父级key
            // const parentKeyIds: Array<string> = [];
            // collectionParentKeyId(parentKeyIds, this.root, this.node);
            // this.parentKeyIds = parentKeyIds;
            // console.log("parentKeyIds:", parentKeyIds);

            // 从复制节点，递归向下查找所有子集key
            const copyKeyIds: Array<string> = collectionChildKeyId(this.copyNodeArray);
            console.log("copyKeyIds:", copyKeyIds);

            // 选中节点的父级key节点路径中 包含了 需要进行复制的节点，说明出现了嵌套关联
            const duplicate = copyKeyIds.filter((id: string) => this.parentKeyIds.includes(id));
            if (duplicate.length !== 0) {
                throw `选中节点的父级key节点路径中包含了需要进行复制的节点，出现了嵌套关联,嵌套的key列表:${duplicate}`;
            }
        }

        /**
         * 禁用选中当前节点子节点按钮
         */
        get selectChildBtnDisabled(): boolean {
            if (!this.node) {
                return true;
            }

            if (!this.node.child || this.node.child.length === 0) {
                return true;
            }

            return false;
        }

        /**
         * 禁用删除当前选中的节点按钮
         */
        get deleteChooseNodeBtnDisabled(){
            if (!this.node) {
                return true;
            }

            if(this.node.isRoot){
                return true;
            }

            return false;
        }

        /**
         * 返回节点类型
         */
        get nodeType(): string {
            const node = this.node;
            if (node) {
                return node.isRoot ? '根节点' : node.isKey ? 'key节点' : 'value节点'
            }
            return '';
        }

        /**
         * 获取当前节点的父节点列表
         */
        get parentKeyIds() : Array<string> {
            const parentKeyIds: Array<string> = [];
            collectionParentKeyId(parentKeyIds, this.root, this.node);
            console.log(`当前节点父节点列表：【${parentKeyIds}】`);
            return parentKeyIds;
        }
    }

</script>
