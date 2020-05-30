<style scoped lang="scss">

</style>

<template>
    <div class="value-form">
        <Card>
            <p slot="title">
                <Icon type="ios-arrow-dropleft" size="22" @click="()=>this.$router.back()"/>
                value{{detailType}}
            </p>

            <Form ref="form" :model="form" :rules="ruleValidate" :label-width="140">
                <FormItem label="类型：" prop="valueType">
                    <RadioGroup v-model="form.valueType">
                        <Radio v-for="(item, index) of valueType" :key="index" :label="item.value">
                            <span>{{item.name}}</span>
                        </Radio>
                        <br>
                    </RadioGroup>
                </FormItem>

                <FormItem label="编码：" prop="code" v-if="form.valueType === 'staticEnum'">
                    <i-input v-model="form.code" ></i-input>
                </FormItem>

                <FormItem label="接口名称：" prop="dynamicApi" v-if="form.valueType === 'dynamicEnum'">
                    <i-input v-model="form.dynamicApi" ></i-input>
                </FormItem>
                <FormItem label="显示名称：" prop="displayName">
                    <i-input v-model="form.displayName" ></i-input>
                </FormItem>
                <FormItem label="排序：" prop="sort">
                     <InputNumber :min="0" v-model="form.sort" style="width: 200px"></InputNumber>
                </FormItem>



                <FormItem label="是否默认值：" prop="valueType">
                    <RadioGroup v-model="form.defaultValue">
                        <Radio v-for="(item, index) of defaultValue" :key="index" :label="item.code">
                            <span>{{item.name}}</span>
                        </Radio>
                        <br>
                    </RadioGroup>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="mxHandleSubmit" style="margin-right: 30px">确定</Button>
                    <Button type="error" @click="mxHandleReset">重置</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script lang="ts">
    import {FormMixin} from '../../../mixin/index';
    import {Component} from "vue-property-decorator";

    @Component({
    })
    export default class extends FormMixin {
        submitAPI: string = this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONS_VALUE

        form: any = {
            valueType: "staticEnum",
            code: "",
            displayName: "",
            dynamicApi: "",
            defaultValue: 'false',
            available:true,
            optionsKeyId:'',
            sort:0
        }

        valueType: any = []

        defaultValue: any = [
            {
                name: '否',
                code: 'false'
            },
            {
                name: '是',
                code: 'true'
            }
        ]



        ruleValidate: any = {
            code: [{
                required: true, trigger: 'blur', message: '此项不能为空', pattern: /([^\s])/
            }],
            displayName: [{
                required: true, trigger: 'blur', message: '此项不能为空', pattern: /([^\s])/
            }],
            dynamicApi: [{
                required: true, trigger: 'blur', message: '此项不能为空', pattern: /([^\s])/
            }],
             sort: [{
                required: true, trigger: 'blur', message: '此项不能为空', pattern: /([^\s])/
            }],
        }

        created(){
            this.getValueEnum()
            const { id, optionsKeyId } = this.$route.query
            if(id) this.form.id = id
            if(optionsKeyId) this.form.optionsKeyId = optionsKeyId
        }

        /*
        * 获取value类型
        * */
        getValueEnum(){
            this.$get(this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONS_VALUE_ENUM).then(res=>{
                this.valueType = res.data
            })
        }
        /*
        * 提交表单前调整表单内数据
        * */
        mxArrangeSubmitData(formData){
            if(formData.valueType === 'staticEnum'){
                formData.dynamicApi = ''
            }else{
                formData.code = ''
            }
            return formData
        }
        /*
        * 判断新建还是编辑
        * */
        get detailType(){
            const {type} = this.$route.query
            return type ? '新建' : '编辑'
        }
    }
</script>
