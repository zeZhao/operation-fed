import httpRequest from './httpRequest';
import {Vue} from 'vue/types/vue';
import {API} from '@/config/apiEnum';
import {config} from '@/config';
import {Res} from "@/interface";
import MD5 from "@/util/md5";
// @ts-ignore
import SearchPanel from "../components/public/SearchPanel.vue";
// @ts-ignore
import ImagePreview from "../components/public/ImagePreview.vue";
// @ts-ignore
import FileUpload from "../components/public/FileUpload.vue";
// @ts-ignore
import FinanceNumberInput from "../components/public/FinanceNumberInput.vue";

class plugin {

    constructor() {

    }

    public install(Vue: Vue, options: any) {
        this.installExtendsFunction();

        this.installComponent(Vue);

        this.installPrototype(Vue);

        this.installFilter(Vue);

        this.installDirective(Vue);

        this.installMixin(Vue);
    }

    /*------------------安装扩展方法------------------*/
    public installExtendsFunction() {
        /**
         * 扩展时间对象，增加Format方法
         */
        {
            /*对Date的扩展，将 Date 转化为指定格式的String
             月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
             年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
             例子：
             (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
             (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
             支持时间格式化*/

            Date.prototype.Format = function (fmt: string) { // author: meizz
                const o = {
                    'M+': this.getMonth() + 1, // 月份
                    'd+': this.getDate(), // 日
                    'h+': this.getHours(), // 小时
                    'm+': this.getMinutes(), // 分
                    's+': this.getSeconds(), // 秒
                    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
                    'S': this.getMilliseconds(), // 毫秒
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                for (const k in o) {
                    if (new RegExp('(' + k + ')').test(fmt)) {
                        // @ts-ignore
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                    }
                }
                return fmt;
            };
        }

        /**
         * 字符串增加format方法，替换字符串中的#{\d}元素，从0开始
         */
        {
            /**
             * @return {string}
             */
            String.prototype.Format = function (...arr: any[]) {
                let value = this.toString();
                arr.forEach((item, index) => {
                    value = value.replace(`#{${index}}`, item);
                });
                return value;
            };
        }

        /**
         * 字符串做解析html转义
         */
        {
            String.prototype.HTMLDecode = function () {
                let temp = document.createElement("div");
                temp.innerHTML = this.toString();
                const output = temp.innerText || temp.textContent || "";
                temp.remove();
                (temp as any) = null;
                return output;
            }
        }
    }

    /*------------------添加vue组件------------------*/
    public installComponent(Vue: Vue) {
        (Vue as any).component('ci-search-panel', SearchPanel);
        (Vue as any).component('ci-image-preview', ImagePreview);
        (Vue as any).component('ci-file-upload', FileUpload);
        (Vue as any).component('ci-finance-number-input', FinanceNumberInput);

    }

    /*------------------添加vue过滤器------------------*/
    public installFilter(Vue: Vue) {

    }

    /*------------------添加vue实例方法------------------*/
    public installPrototype(Vue: Vue) {
        (Vue as any).prototype.$API_ENUM = API;
        (Vue as any).prototype.$CONFIG = config;
        (Vue as any).prototype.$get = httpRequest.get;
        (Vue as any).prototype.$post = httpRequest.post;
        (Vue as any).prototype.$put = httpRequest.put;
        (Vue as any).prototype.$del = httpRequest.del;

        (Vue as any).prototype.$resOk = function (res?: Res) {
            if (res) {
                return res.code === '200';
            } else {
                return false;
            }
        };

        (Vue as any).prototype.$md5 = new MD5();

        /**
         * 获取session中的对象
         * @param key
         */
        (Vue as any).prototype.$getSession = function (key: string) {
            let value = window.sessionStorage.getItem(key);

            if (value) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    return value;
                }
            }

            return value;
        };

        /**
         * 设置、清空session中的对象
         * @param key
         * @param value
         */
        (Vue as any).prototype.$setSession = function (key: any, value?: any) {
            if (value === undefined) {
                window.sessionStorage.removeItem(key);
            } else {
                if (typeof value === "object") {
                    value = JSON.stringify(value)
                }
                window.sessionStorage.setItem(key, value);
            }
        };

        /**
         * 获取storage中的对象
         * @param key
         */
        (Vue as any).prototype.$getStorage = function (key: string) {
            let value = window.localStorage.getItem(key);

            if (value) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    return value;
                }
            }
            return value;
        };

        /**
         * 设置、清空Storage中的对象
         * @param key
         * @param value
         */
        (Vue as any).prototype.$setStorage = function (key: any, value?: any) {
            if (value === undefined) {
                window.localStorage.removeItem(key);
            } else {
                if (typeof value === "object") {
                    value = JSON.stringify(value)
                }
                window.localStorage.setItem(key, value);
            }
        };

        /**
         * 下载文件
         * @param url
         * @param fileName
         */
        (Vue as any).prototype.$downloadFileByUrl = function (url: string, fileName: string = "") {
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.indexOf('chrome') > -1 || userAgent.indexOf('safari') > -1) {

                let link = document.createElement('a');
                link.href = url;
                link.target = '_blank';

                if (link.download !== undefined) {
                    link.download = fileName;
                } else {
                    link.download = url;
                }

                if (document.createEvent) {
                    let e = document.createEvent('MouseEvents');
                    e.initEvent('click', true, true);
                    link.dispatchEvent(e);
                    return;
                }
                return;
            }

            window.open(url, '_blank');
        };
    }

    /*------------------安装指令方法------------------*/
    public installDirective(Vue: Vue) {

    }

    /*------------------安装mixin方法------------------*/
    public installMixin(Vue: Vue) {

    }
}

export default new plugin();
