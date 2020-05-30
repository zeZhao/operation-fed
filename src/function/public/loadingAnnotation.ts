/**
 * 在方法上添加loading效果
 * 加在耗时计算上,自动添加加载效果
 *
 * waitTime（ms） 延后加载效果展示，能快速执行完毕的不添加加载效果
 */
export function Loading(waitTime: number = 200) {

    return function (target, name, descriptor) {
        // 保存原始方法
        const originalFunction = descriptor.value;

        // 定义装饰方法
        descriptor.value = function (...args) {
            // 标记方法是否已经执行完毕
            let finish = false;

            setTimeout(() => {
                // 等待一段时间，还没执行完成则开启加载效果
                if (!finish) {
                    (this as any).$Spin.show();
                }
            }, waitTime);

            return new Promise(async (resolve, reject)  => {

                try{
                    const res = await originalFunction.call(this, ...args);
                    resolve(res);
                }catch (e) {
                    reject(e);
                }

            }).catch(reason => {
                    console.warn(`添加loading注解的方法【${name}】捕获异常：`, reason);
                    throw reason;
                }).finally(() => {
                    (this as any).$Spin.hide();
                    finish = true;
                });
        };

        return descriptor;
    }
}
