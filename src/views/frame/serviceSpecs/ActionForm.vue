<style scoped lang="scss" type="text/scss">
.action-form{
    .action-title{
        width: 100%;
        line-height: 40px;
        border-bottom: 1px solid #e5e5e5;
        margin-bottom: 20px;
        span{
            padding-left: 10px;
            border-left: 2px solid #00b8ec;
        }
    }
    /deep/.ivu-table-wrapper{
        width: 90%;
        margin: 0 auto;
        overflow: visible;
        /deep/.ivu-table{
            width: 100%;
        }
    }
}
</style>

<template>
    <div class="action-form">
        <Card>
            <p slot="title">
                <Icon type="ios-arrow-dropleft" size="22" @click="()=>this.$router.back()" />{{operateType}}
            </p>
            <div>
                <p class="action-title"><span>操作信息</span></p>
                <Form ref="form" :model="form" :rules="ruleValidate" :label-width="140">

                    <FormItem label="操作类型：" prop="actionType">
                        <RadioGroup v-model="form.actionType">
                            <Radio v-for="(item, index) of enumConfig" :key="index" :label="item.value">
                                <span>{{item.name}}</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="操作名称：" prop="actionName">
                        <i-input v-model="form.actionName"></i-input>
                    </FormItem>

                    <FormItem label="操作编码：" prop="code">
                        <i-input v-model="form.code"></i-input>
                    </FormItem>

                     <FormItem label="计费类型：" prop="chargeType">
                         <RadioGroup v-model="form.chargeType">
                            <Radio label="package">包费</Radio>
                            <Radio label="usage">按量</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="mxHandleSubmit" style="margin-right: 30px">确定</Button>
                        <Button type="error" @click="mxHandleReset('form')" style="margin-right: 30px">重置</Button>
                    </FormItem>
                </Form>
            </div>
            <div>
                <p class="action-title"><span>配置key</span></p>
                <ci-key-select :formDisabled="formDisabled" :service-id="form.serviceId" :action-id ="form.id" v-model="keyIds"></ci-key-select>
                <Button type="primary" :disabled="formDisabled" @click="keySubmit" style="margin: 20px 48px;">确定</Button>
            </div>
        </Card>
    </div>
</template>

<script lang="ts">
    import {FormMixin} from '../../../mixin/index';
    // @ts-ignore
    import KeySelect from '../../../components/serviceSpecs/KeySelect.vue';
    import {Component} from "vue-property-decorator";

    @Component({
        components: {'ci-key-select': KeySelect,},
    })
    export default class extends FormMixin {
        //操作类型
        type: string = '';
        //禁用
        formDisabled: boolean = true
        // 选中的keyId列表
        keyIds: Array<string> = [];

        submitAPI: string = this.$API_ENUM.CITIC_SERVICE_CONFIG_ACTION

        form: any = {
            code: "",
            actionType: "create",
            actionName: "",
            available: true,
            serviceId: '',
            chargeType:""
        }
        formKey: any = {}



        // 页面固定选项值
        enumConfig: any = {};

        ruleValidate: any = {
            actionName: [{
                required: true, message: '操作名称不能为空', trigger: 'blur', pattern: /([^\s])/
            }],
            code: [{
                required: true, message: '操作编码不能为空', trigger: 'blur', pattern: /([^\s])/
            }]
        };


        created(){
            const { serverId, type, id } = this.$route.query;

            this.form.serviceId = `${serverId}`
            this.type = `${type}`

            if(id) {
                this.form.id = `${id}`;
                this.formDisabled = false
                this.getKey()
            }

            this.actionTypeEnum()
        }

        /*
        * 获取操作类型
        * */
        actionTypeEnum(){
            this.$get(this.$API_ENUM.CITIC_SERVICE_CONFIG_ACTION_TYPE_ENUM).then(res=>{
                this.enumConfig = res.data
            })
        }
        /*
        * 配置key回显
        * */

        getKey(){
            if(this.type == 'edit'){
                this.$get(`${this.$API_ENUM.CITIC_SERVICE_CONFIG_ACTION_OPTIONS_ACTION_ID}/${this.form.id}`).then(res=>{
                    this.$nextTick(()=>{
                        this.keyIds = res.data
                    })

                })
            }

        }
        /*
       * 提交配置Key
       * */
        keySubmit(){
            this.$post(this.$API_ENUM.CITIC_SERVICE_CONFIG_ACTION_OPTIONS,{
                actionId:this.form.id,
                actionOptionsList:this.keyIds
            }).then(res=>{
                this.$router.back()
            })
        }

        /*
        * 提交成功后执行
        * */
        mxSuccess(res: Res){
            if(this.type === 'new'){
                if (this.$resOk(res)) {
                    if(res.data){
                        this.$Modal.confirm({
                            title: 'Title',
                            okText: '需要',
                            cancelText: '不需要',
                            content: '<p>是否需要绑定Key值？</p>',
                            onOk: () => {
                                this.form.id = res.data.id
                                this.formDisabled = false
                            },
                            onCancel: () => {
                                this.$Message.success('创建成功！')
                                this.$router.back()
                            }
                        });

                    }
                }
            }else{
                this.$Message.success('修改成功！')
            }

        }
        /*
        * 判断是新建还是编辑
        * */
        get operateType(){
            return this.type === "new" ? '新建操作' : '编辑操作'
        }
    }
</script>
