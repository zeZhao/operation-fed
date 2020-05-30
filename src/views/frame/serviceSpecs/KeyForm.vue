<style scoped lang="scss">
</style>

<template>
    <div class="key-form">
        <Card>
            <p slot="title">
                <Icon type="ios-arrow-dropleft" size="22" @click="()=>this.$router.back()" />
                key编辑
            </p>

            <Form ref="form" :model="form" :rules="ruleValidate" :label-width="150">
                <FormItem label="编码：" prop="code">
                    <i-input v-model="form.code"></i-input>
                </FormItem>

                <FormItem label="显示名称：" prop="displayName">
                    <i-input v-model="form.displayName"></i-input>
                </FormItem>

                <FormItem label="是否必填：" prop="required">
                    <RadioGroup v-model="form.required">
                        <Radio
                            v-for="(item, index) of enumConfig.code"
                            :key="index"
                            :label="item.label"
                        >
                            <span>{{item.value}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="类型：" prop="valueType">
                    <Select v-model="form.valueType">
                        <Option
                            v-for="item in enumConfig.type"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.name }}</Option>
                    </Select>
                </FormItem>

                <FormItem label="前端编辑组件：" prop="editComponent">
                    <Select v-model="form.editComponent">
                        <Option
                            v-for="item in componentsList"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.label }}</Option>
                    </Select>
                </FormItem>

                <FormItem label="静态校验的正则表达式：" prop="expression">
                    <i-input v-model="form.expression"></i-input>
                </FormItem>

                <FormItem label="是否有动态校验：" prop="dynamicCheck">
                    <RadioGroup v-model="form.dynamicCheck">
                        <Radio
                            v-for="(item, index) of enumConfig.code"
                            :key="index"
                            :label="item.label"
                        >
                            <span>{{item.value}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="提示说明：" prop="tips">
                    <i-input v-model="form.tips" type="textarea"></i-input>
                </FormItem>

                <FormItem label="校验失败后的提示信息：" prop="alertText">
                    <i-input v-model="form.alertText"></i-input>
                </FormItem>

                <FormItem label="顺序：" prop="sort">
                    <i-input v-model="form.sort"></i-input>
                </FormItem>

                <FormItem label="是否初始值：" prop="initKey">
                    <RadioGroup v-model="form.initKey">
                        <Radio
                            v-for="(item, index) of enumConfig.code"
                            :key="index"
                            :label="item.label"
                        >
                            <span>{{item.value}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="是否计费字段：" prop="billingKey">
                    <RadioGroup v-model="form.billingKey">
                        <Radio
                            v-for="(item, index) of enumConfig.code"
                            :key="index"
                            :label="item.label"
                        >
                            <span>{{item.value}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="是否具有关联关系：" prop="relationKey">
                    <RadioGroup v-model="form.relationKey">
                        <Radio
                            v-for="(item, index) of enumConfig.code"
                            :key="index"
                            :label="item.label"
                        >
                            <span>{{item.value}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="备注：" prop="relationKey">
                    <Input type="textarea" v-model="form.remark"></Input>
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
import { FormMixin } from "../../../mixin/index";
import { Component } from "vue-property-decorator";
import { Base64 } from "../../../util/base64";

@Component({})
export default class extends FormMixin {
    submitAPI: string = this.$API_ENUM.CITIC_SERVICE_OPTIONSKEY;

    form: any = {
        code: "",
        displayName: "",
        required: "true",
        valueType: "",
        editComponent: "",
        expression: "",
        dynamicCheck: "false",
        tips: "",
        alertText: "",
        sort: 0,
        initKey: "false",
        billingKey: "",
        available: 1,
        relationKey: "",
        remark: '',
    };

    // 页面固定选项值
    enumConfig: any = {
        type: [],
        code: [
            {
                label: "true",
                value: "是"
            },
            {
                label: "false",
                value: "否"
            }
        ]
    };

    ruleValidate: any = {
        code: [{ required: true, min: 1, message: "请填写编码" }],
        displayName: [{ required: true, min: 1, message: "请填写显示名称" }],
        valueType: [{ required: true, message: "请选择类型" }],
        editComponent: [{ required: true, message: "请选择前端编辑组件" }]
    };

    listAPI: string = this.$API_ENUM.CITIC_OPTIONSKEY_TYPELIST;

    created() {
        this.$get(this.listAPI).then(res => {
            this.enumConfig.type = res.data;
        });
    }

    mxArrangeFormInfo(data) {
        data.expression = Base64.decode(data.expression);
        return data;
    }

    /**
     * 调整表单数据
     */
    mxArrangeSubmitData(formData) {
        formData.expression = Base64.encode(formData.expression);
        let { id, serviceId } = this.$route.query;
        let obj = { id, serviceId };
        let data = Object.assign(formData, obj);
        return data;
    }

    get componentsList() {
        let list;
        let type = this.form.valueType;
        if (type === "normal") {
            list = [
                {
                    value: "inputNum",
                    label: "inputNum"
                },
                {
                    value: "inputSingleLine",
                    label: "inputSingleLine"
                },
                {
                    value: "inputText",
                    label: "inputText"
                },
                {
                    value: "password",
                    label: "password"
                }
            ];
        } else if (type === "staticEnum" || type === "dynamicEnum") {
            list = [
                {
                    value: "select",
                    label: "select"
                },
                {
                    value: "tabSelect",
                    label: "tabSelect"
                },
                {
                    value: "searchSelect",
                    label: "searchSelect"
                }
            ];
        }
        return list;
    }
}
</script>
