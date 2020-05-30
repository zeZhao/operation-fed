interface ConfigInterface {
    //API接口根地址
    BASE_API_URL: string,
}

/**
 * 项目默认的公共配置（不分环境）
 */
const defaultConfig: ConfigInterface = {
    BASE_API_URL: '',
};

/**
 * 环境配置
 */
const configMap = {
    localConfig: {
        hosts: ['localhost',"127.0.0.1"],
        config: {
            // BASE_API_URL: `http://citic-operation-admin.citiccloud-devops.pcloud.citic.com/`,
            // BASE_API_URL: `http://citic-operation-admin.citiccloud-test.pcloud.citic.com/`,
            BASE_API_URL: `http://citic-operation-admin.citic-cloud-dev.pcloud.citic.com/`,
        },
    },

    // 配置文件内容默认使用 EnvironmentDeploy 中的环境变量
    devOps: {
        hosts: ['devops'],
        config: {
            BASE_API_URL: `http://citic-operation-admin.citiccloud-devops.pcloud.citic.com/`,
        },
    },

    test: {
        hosts: ['test'],
        config: {
            BASE_API_URL: `http://citic-operation-admin.citiccloud-test.pcloud.citic.com/`,
        },
    },

    prod: {
        hosts: ['citiccloud-inner.c.citic'],
        config: {
            BASE_API_URL: 'http://citic-operation-admin.citiccloud-inner.c.citic/',
        },
    },
};

/**
 * 获取不同环境下配置数据
 */
function getConfigByHost(){
    const currentHost = window.location.host;

    for (const key in configMap){
        const configItem = configMap[key];
        const {hosts, config} = configItem;

        for (const hostItem of hosts){
            if(currentHost.includes(hostItem)){
                console.info('use ' + key + ' config');
                return config;
            }
        }
    }

    console.info('use local config');
    return configMap.localConfig;
}

/**
 * 根据环境变量合并配置信息
 */
const config = (function () {

    let config;

    // 在容器中配置了接口地址环境变量，使用环境变量中的地址
    if (window.ENV && window.ENV.BASE_API_URL) {
        const BASE_API_URL = window.ENV.BASE_API_URL;

        config = {
            BASE_API_URL,
        };

        console.info('use env config');
    }else {
        // 容器中没有配置接口环境变量，使用域名判断接口地址
        config = getConfigByHost();
    }

    return Object.assign(defaultConfig, config);
})();

export {
    config,
    ConfigInterface,
}