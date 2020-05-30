/**
 * 在敏感操作上添加防止鼠标快速点击多次，造成多次提交修改
 * waitTime 双击间隔
 */
const prefix = '__last_click_time';

export function Throttle(waitTime: number = 500) {

    return function (target, name, descriptor) {
        const keyName = `${prefix}_${name}`;

        // 保存原始方法
        const originalFunction = descriptor.value;

        // 定义装饰方法
        descriptor.value = function (...args) {

            if(this){
                const lastClickTime = this[keyName] || 0;
                const currentTime = new Date().getTime();

                if(currentTime - lastClickTime < waitTime){
                    return;
                }

                this[keyName] = currentTime;
            }

            return originalFunction.call(this, ...args);
        };

        return descriptor;
    }
}
