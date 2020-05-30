import {overwrite} from './annotation/index'

import {Component, Vue} from 'vue-property-decorator';

@Component({
    components: {},
})
export default class extends Vue {
    submitAPI: string = '';
    form: any = {};

    mounted() {
        this.mxGetFormInfo();
        this.mxInitOpinion();
    }

    /**
     * 初始化表单数据
     */
    mxGetFormInfo() {
        const {id} = this.$route.query;
        if (this.submitAPI && id) {
            this.$get(`${this.submitAPI}/${id}`).then(res => {
                for (const key in res.data) {
                    const item = res.data[key];
                    if (typeof item === 'boolean') {
                        res.data[key] = `${item}`;
                    }
                }
                Object.assign(this.form, this.mxArrangeFormInfo(res.data));

                this.mxFormLoaded();
            })
        }
    }

    /**
     * 调整表单初始化数据
     * @param data      状态中的form对象
     * @returns {*}
     * @private
     */
    @overwrite("调整表单初始化数据")
    mxArrangeFormInfo(data) {
        return data;
    }

    /**
     * 表单数据加载完成
     * @private
     */
    @overwrite("表单数据加载完成")
    mxFormLoaded() {

    }

    /**
     * 初始化下拉菜单数据
     * @private
     */
    @overwrite('初始化下拉菜单数据')
    mxInitOpinion() {

    }

    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    @overwrite("提交表单前调整表单内数据")
    mxArrangeSubmitData(formData) {
        return formData;
    }

    /**
     * 提交表单操作
     * @param validate    是否需要验证表单
     * @param name        表单的ref
     * @private
     */
    mxHandleSubmit(validate = true, name = 'form') {
        const submit = () => {
            try {
                const submitData = this.mxArrangeSubmitData(Object.assign({}, this.form));

                if (this.form.id) { //修改
                    this.$put(this.submitAPI, submitData).then((res: Res) => this.mxSuccess(res));
                } else { //新增
                    this.$post(this.submitAPI, submitData).then((res: Res) => this.mxSuccess(res));
                }
            } catch (e) {
                console.error(e)
            }
        };

        if (validate) {
            (this.$refs[name] as Vue).validate((valid) => {
                if (valid) {
                    submit();
                } else {
                    this.$Message.error('表单校验失败!');
                }
            })
        } else {
            submit()
        }
    }

    /**
     * 提交成功后执行
     * @param res
     */
    mxSuccess(res: Res) {
        if (this.$resOk(res)) {
            this.$Message.success('操作成功!');
            this.$router.back();
        } else {
            // this.$Message.error(res.msg || res.message);
        }
    }

    /**
     * 重置表单数据
     * @param name
     * @private
     */
    mxHandleReset(name: string = 'form') {
        (this.$refs[name] as Vue).resetFields();
    }
}
