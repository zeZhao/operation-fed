declare global {

    interface TreeData {
        // keyId/valueId
        id: string,
        label: string,
        code: string,
        child?: Array<TreeData>,
        isKey: boolean,
        isRoot?: boolean,
        remark?: string,
    }

    interface TreeNode extends TreeData{
        // key唯一Id 复制key节点时，标记当前key的唯一性
        uniqueId: string,

        // keyId/valueId
        id: string,
        label: string,
        code: string,
        child?: Array<TreeNode>,
        isKey: boolean,
        isRoot?: boolean,
        remark?: string,

        // value 节点会记录自身归属的key
        belongKeyId?: string,

        // 是否勾选
        select: boolean,
        // 是否选中
        choose: boolean,
        // 节点是否折叠
        fold: boolean,

    }
}

export {TreeNode, TreeData};