import Vue from 'vue';
import VueRouter, {Route} from 'vue-router';
import {Res} from '@/interface';
import {APIInterface} from './config/apiEnum';
import {ConfigInterface} from './config/index';

declare module "*.vue" {
    import Vue from 'vue'
    export default Vue
}

// 扩展原有对象上的方法
declare global {
    interface Date {
        Format(...args: any[]): any;
    }

    interface String {
        Format(...args: any[]): any;

        HTMLDecode(): string;
    }

    interface Window {
        ENV: any;
    }
}

// 扩充vue原型上的属性
declare module 'vue/types/vue' {

    interface Vue {
        $router: VueRouter;
        $route: Route;

        validate: any;
        resetFields: Function;

        $API_ENUM: APIInterface;
        $CONFIG: ConfigInterface;

        $get: (url: string, param?: object) => Promise<Res>;
        $post: (url: string, data?: object) => Promise<Res>;
        $put: (url: string, data?: object) => Promise<Res>;
        $del: (url: string) => Promise<Res>;
        $md5: any;

        $getSession(key: string): any

        $setSession(key: string, value?: any): any

        $getStorage(key: string): any

        $setStorage(key: string, value?: any): any

        $resOk(res: Res): boolean;

        $downloadFileByUrl(url: string, fileName?: string): any
    }
}