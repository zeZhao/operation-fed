declare global {
    interface SearchPayload {
        pageIndex?: number,
        pageSize?: number,
        searchParam?: any,
        path: string,
    }
}

export default {
    state: {
        //根据路由地址记录对应列表页面的请求参数
        paramMap: {}
    },
    mutations: {
        /**
         * 根据当前路由路径记录查询条件
         * @param state
         * @param payload
         */
        recordSearch(state, payload: SearchPayload) {
            let {pageIndex, pageSize, searchParam, path} = payload;

            if (!searchParam) {
                if (state.paramMap[path]) {
                    searchParam = state.paramMap[path].searchParam;
                } else {
                    searchParam = {};
                }
            }

            state.paramMap[path] = {
                pageIndex,
                pageSize,
                searchParam,
            }
        },

        /**
         * 根据路由路径清空对应的查询条件
         * @param state
         * @param payload
         */
        resetSingleSearch(state, payload: SearchPayload) {
            const {path} = payload;
            delete state.paramMap[path];
        },

        /**
         * 点击菜单项时清空全部查询条件
         * @param state
         * @param payload
         */
        resetAllSearch(state, payload: SearchPayload) {
            for (const key in state.paramMap) {
                delete state.paramMap[key];
            }
        },
    }
}
