import {overwrite} from './annotation/index'

import {Vue, Component} from 'vue-property-decorator';
import {Res} from "@/interface";

/**
 * 记录当前页面的查询信息
 */
function storageSearchData() {
    // @ts-ignore
    if (!this.useRecord) {
        return;
    }

    // store记录当前页码及查询条件
    //@ts-ignore
    this.$store.commit('recordSearch', {
        // @ts-ignore
        path: this.$route.path,
        //调用查询时默认跳转到第一页
        // @ts-ignore
        pageIndex: this.pageIndex,
        // @ts-ignore
        pageSize: this.pageSize,
        //查询条件参数
        searchParam: {
            // @ts-ignore
            ...this.searchParam

        }
    });
}

/**
 * 默认格式化表格项目，根据vuex中数据勾选中默认数据
 * @param data
 * @returns {*}
 */
function defaultFormList(data) {
    // @ts-ignore
    let ids = this.information.selectIds;

    if (!data.map) {
        return data;
    }

    return data.map(item => {
        item.selected = ids.has(item.id);
        return item;
    })
}

/**
 * 防抖动，requestFrequency间隔内只有最后一次操作有效
 * 判断接口请求频率是否超出设定的限制
 */
function debounce() {
    //@ts-ignore
    const lastRequestTimeStamp = this.lastRequestTimeStamp;
    //@ts-ignore
    const requestFrequency = this.requestFrequency;
    const nowTimeStamp = new Date().getTime();
    //@ts-ignore
    this.lastRequestTimeStamp = nowTimeStamp;
    const timeDifference = nowTimeStamp - lastRequestTimeStamp;

    //时间差小于限定值
    if (timeDifference < requestFrequency) {
        //@ts-ignore
        if (this.queryTask != null) {
            //@ts-ignore
            clearTimeout(this.queryTask)
        }
    }

    //@ts-ignore
    this.loading = true;
    //@ts-ignore
    this.queryTask = setTimeout(queryData.bind(this), requestFrequency);
}

/**
 * 调用接口查询数据
 */
function queryData() {
    //@ts-ignore
    this.loading = true;

    //记录查询数据
    //@ts-ignore
    storageSearchData.call(this);

    //@ts-ignore
    const searchParam = Object.assign({}, this.searchParam);
    for (const key in searchParam) {
        //1.传递查询参数时清除空条件
        //2.将无用字段移除不参与请求(无用字段以“_”开头和结束)
        const reg = /^_[\S]*_$/;
        if (!searchParam[key] || reg.test(key)) {
            delete searchParam[key];
            continue;
        }

        //将时间对象转为时间戳
        if (searchParam[key] instanceof Date) {
            searchParam[key] = new Date(searchParam[key]).getTime();
        }
    }

    //@ts-ignore
    this.mxFormSearchData(searchParam);

    try {
        //@ts-ignore
        this.mxCheckInput(searchParam);
    } catch (error) {
        //@ts-ignore
        this.$Message.error(error.message || "查询参数错误");
        //@ts-ignore
        this.loading = false;
        return;
    }

    //@ts-ignore
    this.$get(this.searchAPI, {
        //@ts-ignore
        pageIndex: this.pageIndex,
        //@ts-ignore
        pageSize: this.pageSize,
        ...searchParam
    }).then(res => {
        //兼容性处理
        //@ts-ignore
        this.loading = false;
        let listData = [];

        if (res.datas) {
            listData = res.datas;
            //@ts-ignore
            this.total = res.total;
        } else if (res.data.content) {
            listData = res.data.content;
            //@ts-ignore
            this.total = res.data.totalElements;
        } else if (res.data.data) {
            listData = res.data.data;
            //@ts-ignore
            this.total = res.data.totalCount;
        } else if (res.data.records) {
            listData = res.data.records;
            //@ts-ignore
            this.total = res.data.total;
        } else {
            listData = res.data;
        }

        //默认处理一次列表数据
        //@ts-ignore
        listData = defaultFormList.call(this, listData);
        //@ts-ignore
        this.listData = this.mxFormListData(listData);

        //初始化选中的个数
        //@ts-ignore
        this.selectedNum = this.information.selectIds.size;
        //@ts-ignore
        this.mxJudgeSelectAll();

        return res
        //@ts-ignore
    }).then(this.mxListUpdate);
}

interface Information {
    selectIds: Set<any>
}

const INIT_PAGE_SIZE = 20;

@Component({
    components: {},
})
export default class extends Vue {
    pageIndex: number = 1;
    pageSize: number = INIT_PAGE_SIZE;

    //查询条件参数
    searchParam: any = {};

    listData: Array<any> = [];
    total: number = 0;
    pageSizeOpts: Array<number> = [INIT_PAGE_SIZE, 40, 60, 100];
    loading: boolean = false;

    searchAPI: string = '';
    delAPI: string = '';
    editPath: string = '';

    //是否记录列表查询信息
    useRecord: boolean = true;

    //列表切换需要恢复的数据
    information: Information = {
        selectIds: new Set()
    };

    //是否勾中全选
    selectAll: boolean = false;
    //总共选中条目数量
    selectedNum: number = 0;

    //增加请求接口防抖动
    //防抖动-最后一次请求的时间戳
    lastRequestTimeStamp: number = 0;
    //防抖动-接口请求频率限制(ms)
    requestFrequency: number = 300;
    //防抖动-查询接口任务
    queryTask: any = null;

    created() {
        const recordParam = this.$store.state.searchParam.paramMap[this.$route.path];
        if (recordParam) {
            const {pageIndex, pageSize} = recordParam;

            this.pageIndex = pageIndex;
            this.pageSize = pageSize;
        }
    }

    /***
     * 获取表格数据
     * @private
     */
    mxGetList() {
        //接口请求防抖动
        debounce.call(this)
    }

    /***
     * 页码改变触发
     * @private
     */
    mxChangePage(pageIndex) {
        this.pageIndex = pageIndex;
        this.mxGetList();
    }

    /***
     * 每页数据条数改变触发
     * @private
     */
    mxChangePageSize(pageSize) {
        this.pageSize = pageSize;
        this.mxGetList();
    }

    // @ts-ignore
    /**
     * 列表查询操作
     * @param param
     * @param pageIndex
     * @param pageSize
     * @private
     */
    mxDoSearch(param) {
        //调用查询时默认跳转到第一页
        this.pageIndex = 1;
        this.searchParam = {
            ...param
        };
        this.mxGetList();
    }

    /**
     * 进入详情/编辑页面
     * @param param
     * @private
     */
    mxToDetail(param) {
        //判断是不是字符串，字符串直接当做id传递，
        //对象当query传递

        let query = {};
        if (!param) {

        } else if (param.constructor === String) {
            query = {id: param}
        } else if (param.constructor === Object) {
            query = param;
        }

        // 跳转到详情页面时清空详情页的查询缓存，避免查询缓存数据覆盖了链接上的查询参数
        // 只会影响到详情页为列表的情况
        // 正常清空详情页查询缓存需要配置完整的path到this.editPath
        this.$store.commit('resetSingleSearch', {path: this.editPath});

        this.$router.push({
            path: this.editPath,
            query
        });
    }

    /**
     * 删除列表中项目
     * @param id
     * @param method    兼容性处理condition列表删除接口更新后可以删除
     * @private
     */
    mxDeleteItem(id, method = 'delete') {
        this.$Modal.confirm({
            title: '确认框',
            content: '<p>确认删除该条数据吗？</p>',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                // @ts-ignore
                this.$del(`${this.delAPI}/${id}`).then((res: Res) => {
                    if (this.$resOk(res)) {
                        this.$Message.info('删除成功！');
                        this.mxGetList();
                    } else {
                        // this.$Message.info('删除失败！');
                    }
                });
            }
        })
    }

    /**
     * 对表格数据进行调整
     * @param rows
     * @returns {*}
     * @private
     */
    // @overwrite('对表格数据进行调整')
    mxFormListData(rows) {
        return rows;
    }

    /**
     * 列表数据拉取完成
     * @param res
     * @returns {*}
     * @private
     */
    // @overwrite('列表数据拉取完成')
    mxListUpdate(res) {

    }

    /**
     * 对列表查询参数进行调整
     * @param searchParam
     * @private
     */
    // @overwrite('对列表查询参数进行调整')
    mxFormSearchData(searchParam) {

    }

    /**
     * 校验表单查询参数
     * 校验失败需要抛出Error
     *
     * @param searchParam
     * @private
     */
    // @overwrite('校验查询参数')
    mxCheckInput(searchParam) {

    }

    /**
     * 选中全部
     */
    mxSelectAllItem(value) {
        this.listData.forEach(item => {
            item.selected = value;
            this.mxSelectOne({id: item.id, value: value})
        })
    }

    /**
     * 切换单个订单是否选中
     * @param id
     * @param value
     */
    mxSelectOne({id, value}) {
        if (value) {
            this.information.selectIds.add(id);
        } else {
            this.information.selectIds.delete(id);
        }
        this.selectedNum = this.information.selectIds.size;

        this.mxJudgeSelectAll();
    }

    /**
     * 判断是否全选中
     */
    mxJudgeSelectAll() {
        //默认状态为全选中
        let selectAllFlag = !!this.listData.length;
        //判断是否当前页面所有的项目都已经选中
        this.listData.forEach(item => {
            if (!item.selected) {
                selectAllFlag = false;
            }
        });
        this.selectAll = selectAllFlag;
    }

    /**
     * 批量删除已选中项目
     * @param ids
     * @private
     */
    mxRemoveSelectIds(ids: any = '') {
        let removeList = [];
        if (ids.constructor === String || ids.constructor === Number) {
            // @ts-ignore
            removeList.push(ids)
        } else if (ids.constructor === Array || ids.constructor === Set) {
            // @ts-ignore
            removeList.push(...ids);
        } else {
            return
        }

        removeList.forEach(id => {
            this.information.selectIds.delete(id);
        });

        this.selectedNum = this.information.selectIds.size;
    }

    /**
     * 获取时间选择限制配置
     * @param startKey 起始日期key
     * @param endKey 结束日期key
     * @param start 是否是开始日期
     * @param date iview组件时间参数
     */
    mxGetTimeOperation(startKey, endKey, start: boolean, date: Date): boolean {
        if (start) {
            if (this.searchParam[endKey]) {
                return date > new Date(this.searchParam[endKey]);
            }
            return date > new Date();
        } else {
            if (this.searchParam[startKey]) {
                return date < new Date(this.searchParam[startKey]) || date > new Date();
            }
            return date > new Date();
        }
    }
}
