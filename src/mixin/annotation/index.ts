export function overwrite(describe = '', require = false) {
    return function (target, name, descriptor) {
        if (require) {
            descriptor.value = function () {
                console.warn(`未实现指定方法${name}：${describe}`);
            };
        } else {
            const old = descriptor.value;
            descriptor.value = function () {
                console.info(`使用默认方法${name}：${describe}`);
                return old(...arguments);
            };
        }
        return descriptor;
    }
}
