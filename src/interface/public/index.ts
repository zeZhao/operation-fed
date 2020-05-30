declare global {

    interface ConstValueItem {
        key: any,
        value: any
    }

    interface SearchConfigItem {
        key: string,
        type: string,
        keys?: Array<string>,
        label?: string,
        placeholder?: string,
        api?: string,
        formatOption?: (item: any) => Array<ConstValueItem>,
        clearable?: boolean,
        defaultValue?: any,
        constValue?: Array<ConstValueItem>,
        influence?: string,
        dependent?: string,
        ignoreDependentEmpty?: boolean
        promise?: Promise<Res>,

        dateOptions?: Array<any>,

        readonly?: boolean,
    }

    interface FileListItem {
        name: string,
        url: string,
    }
}

export {SearchConfigItem, ConstValueItem, FileListItem};