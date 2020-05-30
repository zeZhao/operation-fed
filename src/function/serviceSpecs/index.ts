let index = 0;

function createUniqueId() {
    // return Symbol("id")
    return `${new Date().getTime()}_${index++}`;
}

/**
 * 深拷贝
 */
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * 广度遍历
 * 查找第一层选中的子节点
 */
function breadthErgodic(node): Array<TreeNode> {

    // 当前层没有选中的节点，记录当前层的所有子节点作为下一次扫描的根
    const record: Array<TreeNode> = [];
    // 距离根节点最近的被选中的节点集合
    const nodeArr: Array<TreeNode> = [];

    node.forEach(item => {
        // 当前节点被选中则退出
        if (item.select) {
            nodeArr.push(item)
        } else {
            if (item.child) {
                record.push(...item.child);
            }
        }
    });

    if (nodeArr.length === 0) {

        if (record.length === 0) {
            return [];
        }

        return breadthErgodic(record);
    } else {
        return nodeArr;
    }
}

/**
 * 工具方法
 * 深度遍历
 * 遍历树子节点，并对子节点执行回调函数
 */
function ergodicNode(node: TreeNode, cb, skipRoot = true, parent?: TreeNode): undefined {
    if (!skipRoot) {
        const isBreak = cb(node, parent);
        if (isBreak === true) {
            return;
        }
    }

    if (node.child) {
        node.child.forEach(item => ergodicNode(item, cb, false, node))
    }
}

/**
 * 使用深度遍历
 * 查找当前节点的全部父级 key 类型 id
 */
function collectionParentKeyId(keyIds: Array<string>, root, node): boolean {
    // 从顶部开始遍历找到到达当前节点的唯一路径，使用 uniqueId 做唯一性比较

    if (node && root) {

        // 当前节点为key类型，路径中加入当前节点
        if (root.isKey) {
            keyIds.unshift(root.id);
        }

        // 找到指定节点返回 true 结束遍历
        // node.uniqueId === root.uniqueId
        if (node === root) {
            return true;
        }

        // 包含子节点继续遍历子节点查找
        if (root.child) {
            let findRes = false;
            for (const item of root.child) {
                findRes = collectionParentKeyId(keyIds, item, node);

                // 找到结果终断循环
                if (findRes) {
                    break;
                }
            }

            if (!findRes && root.isKey) {
                // 当前key下没有找到路径，则退出当前路径
                keyIds.shift();
            }

            return findRes;
        }else{
            if (root.isKey) {
                // 当前key下没有找到路径，则退出当前路径
                keyIds.shift();
            }
        }

        return false;
    } else {
        return false;
    }
}

/**
 * 查找当前节点的全部子节点 key 类型 id
 */
function collectionChildKeyId(root: Array<TreeNode>, keyList: Array<string> = []): Array<string> {
    root.forEach(item => {
        ergodicNode(item, (itemNode: TreeNode) => {
            if (itemNode.isKey) {
                keyList.push(itemNode.id);
            }
        }, false);
    });

    return keyList;
}

/**
 * 迭代扩展树节点属性
 */
function structureTreeNode(data: Array<TreeData>, parent?: TreeData): Array<TreeNode> {
    return data.map(item => {

        // value节点需要记录归属的key节点id
        let belongKeyId;
        if (!item.isKey && !item.isRoot && parent) {
            belongKeyId = parent.id;
        }

        let obj: TreeNode = {
            // 继承原始属性
            ...item,

            // 添加扩展属性
            uniqueId: createUniqueId(),
            child: item.child ? structureTreeNode(item.child, item) : undefined,
            select: false,
            choose: false,
            fold: false,
            belongKeyId,
        };
        return obj
    });
}

interface Callback<T> {
    (item: T): any;
}

/**
 * 操作记录栈
 * @constructor
 */
class ActionStack<T> {
    private readonly max: number = 0;
    private pointer: number = 0;
    private stack: Array<T> = [];

    constructor(max: number = 20) {
        this.max = max;
    }

    do(record: T) {
        // 当前在栈顶操作
        if (this.pointer !== 0) {
            this.stack = this.stack.splice(this.pointer);
        }

        record = deepCopy(record);

        this.stack.unshift(record);
        this.pointer = 0;

        if (this.stack.length > this.max) {
            this.stack = this.stack.splice(0, this.max);
        }
    }

    revoke(callback: Callback<T>, fail?: Callback<undefined>) {
        if (this.pointer < this.stack.length - 1) {
            let item = this.stack[++this.pointer];
            item = deepCopy(item);

            return callback(item);
        }

        if (fail) {
            fail(undefined);
        }
    }

    redo(callback: Callback<T>, fail?: Callback<undefined>) {
        if (this.stack.length !== 0 && this.pointer > 0) {
            let item = this.stack[--this.pointer];
            item = deepCopy(item);

            return callback(item);
        }

        if (fail) {
            fail(undefined);
        }
    }

    getStatus() {
        console.debug(`当前栈长：${this.stack.length},当前指针位置：${this.pointer}`);
    }
}

export {
    breadthErgodic,
    ergodicNode,
    collectionParentKeyId,
    collectionChildKeyId,
    structureTreeNode,
    createUniqueId,
    deepCopy,

    ActionStack,
}