/**
 * get请求将参数对象拼接到url
 * @param api
 * @param param
 * @returns {*}
 */
import {Vue} from 'vue/types/vue';

function adjustParam(api: string, param = '') {
    if (param.constructor === String) {
        return `${api}${param}`;
    } else if (param.constructor === Object) {
        const query: Array<string> = [];
        // @ts-ignore
        for (const key in param) {
            query.push(`${key}=${param[key]}`);
        }
        const querySign = api.includes('?') ? '&' : '?';
        return `${api}${querySign}${query.join('&')}`;
    } else {
        return api;
    }
}

function judgeURL(url: string): string {
    if (/:\/\//.test(url)) {
        return url;
    }

    // @ts-ignore
    return this.$CONFIG.BASE_API_URL + url;
}

interface RequestConfig {
    headers: object,
    method: string,
    body?: string,
}

const BASE = function (type: string, api: string, data: object) {

    // @ts-ignore
    this.inRequest = true;

    const config: RequestConfig = {
        // @ts-ignore
        headers: {'Content-Type': 'application/json', 'citic-token': this.$getSession('citic-token')},
        method: type,
    };

    if (['post', 'put'].includes(type)) {
        config.body = JSON.stringify(data);
    }

    // @ts-ignore
    const requestURL = judgeURL.call(this, api);

    // @ts-ignore
    return fetch(requestURL, config).then((response: any) => {
        return response.json();
    }).then((res: any) => {
        if (res.code === '6005') {
            sessionStorage.clear();
            localStorage.clear();
            // @ts-ignore
            this.$router.push('/login');
        }

        console.group(`${type}接口： ${requestURL}`);
        console.info('响应结果：', JSON.parse(JSON.stringify(res)));
        console.groupEnd();
        return res;
    }).catch((e: any) => {
        console.error('接口异常：', e);
    }).finally(() => {
        // @ts-ignore
        this.inRequest = false;
    });
};

const get = function (this: Vue, api: string, params: string) {
    return BASE.call(this, 'get', adjustParam(api, params), {});
};

const post = function (this: Vue, api: string, data = {}) {
    return BASE.call(this, 'post', api, data);
};

const put = function (this: Vue, api: string, data = {}) {
    return BASE.call(this, 'put', api, data);
};

const del = function (this: Vue, api: string) {
    return BASE.call(this, 'delete', api, {});
};


export default {
    get,
    post,
    put,
    del,
};
