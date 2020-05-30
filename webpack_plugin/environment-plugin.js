const path = require('path');
const fs = require('fs');

const TOOLS = {
    /**
     * 将数组数据转换为Map结构
     * @param array
     */
    arrayConvertToMap(array) {
        const map = {};
        array.map(item => {
            const [key, value] = item.split("=");
            map[key] = value;
        });
        return map;
    },
};

function EnvironmentPlugin(options = {}) {
    this.options = Object.assign({
        filename: "index.html",
        envs: [],
    }, options);
}

EnvironmentPlugin.prototype.apply = function (compiler) {
    const self = this;

    console.log("===========查看全部环境变量============>process.env\n", process.env, "\n=========================================");
    console.log("===========查看命令行参数============>process.argv\n", process.argv, "\n=========================================");

    const configArgv = process.argv.slice(2);
    const CONFIG_MAP = TOOLS.arrayConvertToMap(configArgv);

    console.log("查看命令行启动参数", "CONFIG_MAP", CONFIG_MAP);

    compiler.plugin('done', function (compilation, callback) {
        const envs = self.options.envs;
        const filename = self.options.filename;

        const filePath = path.join(compiler.options.output.path, filename);
        const file = fs.readFileSync(filePath);

        let fileText = file.toString();

        let fileTextArray = fileText.split("</head>");
        // 如果已经设置了 ENV 变量防止覆盖原有变量
        let global_variable = " window.ENV ? 0 : window.ENV = {}; ";

        envs.forEach(function (item) {
            let value = process.env[item] || "";

            const argvValue = CONFIG_MAP[`env.${item}`];

            if (argvValue) {
                console.log("=========================>启动参数覆盖环境变量：", item, "envValue = ", value, " argvValue = ", argvValue);
                value = argvValue;
            }

            console.log("=========================>打包生成环境变量：", item, "=", value);
            if (value) {
                global_variable += ` window.ENV.${item} = '${value}'; `;
            }
        });

        let insertScript = `<script>${global_variable}</script></head>`;
        fileTextArray.splice(1, 0, insertScript);
        fs.writeFileSync(filePath, fileTextArray.join(""));
    });
};

module.exports = EnvironmentPlugin;
