<style scoped lang="scss">
    .coupon-form {

        .label {
            margin: 0 20px;
        }

        .coupon-type-name {
            padding: 0 20px;
        }

        .add-btn {
            margin-left: 30px;
        }

        .delete-btn {
            color: #ed3f14;
            font-size: 14px;
            margin-left: 15px;
            cursor: pointer;
        }
    }

    .form-model {
        /deep/ .ivu-modal-footer {
            display: none;
        }
    }
</style>

<template>
    <div class="coupon-form">
        <Card>
            <p slot="title">
                优惠券
            </p>

            <p style="margin-bottom: 20px;">请配置优惠券生成规则 <span style="margin-left: 20px;">备注:优惠券不适用于按量付费的服务</span></p>

            <Form ref="form" :model="form" :rules="ruleValidate" :label-width="140" class="form">

                <FormItem label="优惠券类型：" prop="type">
                    <RadioGroup v-model="form.type" @on-change="couponTypeChane">
                        <Radio :label="1">
                            <span>通用券</span>
                        </Radio>
                        <br>

                        <Radio :label="2">
                            <span>服务商优惠券</span>

                            <span v-show="form.type === 2">
                                <span class="coupon-type-name">{{form.typeName}}</span>
                                <Button class="add-btn" type="primary" size="small" icon="android-add"

                                        @click="supplierModal = true">请选择服务商
                                </Button>
                            </span>
                        </Radio>
                        <br>

                        <Radio :label="3">
                            <span>服务优惠券</span>

                            <span v-show="form.type === 3">
                                <span class="coupon-type-name">{{form.typeName}}</span>
                                <Button class="add-btn" type="primary" size="small" icon="android-add"
                                        @click="serviceModal = true">请选择服务
                                </Button>
                            </span>
                        </Radio>
                    </RadioGroup>
                </FormItem>

                <!--<FormItem label="优惠券有效期：">
                    <FormItem prop="effectDate" style="width: 200px; display: inline-block;">
                        <DatePicker type="date" placement="bottom-end" placeholder="优惠券有效期"
                                    v-model="form.effectDate" :options="startTimeOption"></DatePicker>
                    </FormItem>

                    <span class="label">至</span>

                    <FormItem prop="expiryDate" style="width: 200px; display: inline-block;">
                        <DatePicker type="date" placement="bottom-end" placeholder="优惠券有效期"
                                    v-model="form.expiryDate" :options="endTimeOption"></DatePicker>
                    </FormItem>
                </FormItem>-->

                <FormItem label="优惠券名称：" prop="name">
                    <i-input v-model="form.name" :maxlength="8" style="width: 200px;"></i-input>
                    <span style="margin-left: 10px;">注:最多8个字符</span>
                </FormItem>

                <FormItem label="优惠券数量：" prop="allNums">
                    <InputNumber :min="1" v-model="form.allNums" style="width: 200px"></InputNumber>
                </FormItem>

                <FormItem label="优惠方式：" prop="isDiscount">

                    <RadioGroup v-model="form.isDiscount">
                        <Radio :label="1">
                            <span>无门槛</span>
                        </Radio>
                        <!-- <Radio :label="2">
                             <span>满减</span>
                         </Radio>-->
                    </RadioGroup>

                </FormItem>

                <FormItem label="优惠面值（元）：" prop="money">
                    <InputNumber :min="1" v-model="form.money" style="width: 200px"></InputNumber>
                </FormItem>

                <FormItem label="优惠券发送对象：" prop="rentUserList">
                    <p class="select-target" v-for="(item, index) in form.rentUserList" :key="index">
                        <span>{{item.userName}}</span>

                        <Icon class="delete-btn" type="md-close-circle" @click="deleteRentUser(item, index)"></Icon>
                    </p>
                    <Button type="primary" size="small" icon="md-add" @click="rentUserModal = true"></Button>
                </FormItem>

                <FormItem label="新建原因：" prop="remark">
                    <i-input type="textarea" class="textarea" v-model="form.remark" :maxlength="200" style="width: 500px;"></i-input>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="handleSubmit()" style="margin-right: 30px">确定</Button>
                    <Button type="error" @click="mxHandleReset()">重置</Button>
                </FormItem>
            </Form>
        </Card>

        <Modal v-model="supplierModal" width="1200" class="form-model" title="品牌服务商">
            <ci-select-supplier @submit="(data)=> submitSupplier(data)" :id="form.typeValue"/>
            <div slot="footer"></div>
        </Modal>

        <Modal v-model="serviceModal" width="1200" class="form-model" title="服务列表">
            <ci-select-supplier-service @submit="(data)=> submitSupplierService(data)" :id="form.typeValue"/>
            <div slot="footer"></div>
        </Modal>

        <Modal v-model="rentUserModal" width="1200" class="form-model" title="租户列表">
            <ci-select-tenant @submit="(data)=> submitTenant(data)" :selectTenantList="rentUserList"/>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {FormMixin} from '../../../mixin/index';

    import SelectSupplier from '../../../components/coupon/SelectSupplier.vue';
    import SelectSupplierService from '../../../components/coupon/SelectSupplierService.vue';
    import SelectTenant from '../../../components/coupon/SelectTenant.vue';
    import {Component} from "vue-property-decorator";


    const validateNumber = (rule, value, callback) => {


        if (/^[1-9][0-9]*$/.test(value)) {

            if (value > 100) {
                callback(new Error('优惠券数量最大100张'));
                return
            }

            callback();
            return;
        }

        callback(new Error('数量格式错误'));
    };

    const validateMoney = (rule, value, callback) => {

        if (/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {

            if (value > 10000000) {
                callback(new Error('优惠面值最大1千万'));
                return
            }

            if (value > 0) {
                callback();
                return;
            }
        }
        callback(new Error('优惠面值格式错误'));
    };

    const validateDate = (rule, value, callback) => {
        if (value) {
            callback();
            return;
        }
        callback(new Error('请选择优惠券有效日期'));
    };

    @Component({
        components: {
            'ci-select-supplier': SelectSupplier,
            'ci-select-supplier-service': SelectSupplierService,
            'ci-select-tenant': SelectTenant
        }
    })
    export default class extends FormMixin {

        startTimeOption: Object = {
            disabledDate: (date) => {
                if (this.form.expiryDate) {
                    return date > this.form.expiryDate;
                }

                return date < new Date(new Date().getTime() - 24 * 3600 * 1000);
            }
        };

        endTimeOption: Object = {
            disabledDate: (date) => {
                if (this.form.effectDate) {
                    return date < this.form.effectDate;
                }

                return date < new Date(new Date().getTime() - 24 * 3600 * 1000);
            }
        };

        form: any = {
            allNums: 1,
            condition: false,
            // effectDate: '',
            // expiryDate: '',
            //1：满减 2：满打折 默认满减
            isDiscount: 1,
            money: 1,
            name: '',
            remark: '',
            rentUserList: [],
            //1：通用券 2：服务商优惠券 3：服务优惠券
            type: 1,
            typeName: '',
            typeValue: '',
            supplierId: '',
        }

        ruleValidate: any = {
            type: [{
                required: true,
            }],
            isDiscount: [{
                required: true,
            }],
            allNums: [{required: true, validator: validateNumber, trigger: 'change'}],
            // effectDate: [{required: true, validator: validateDate, trigger: 'change'}],
            // expiryDate: [{required: true, validator: validateDate, trigger: 'change'}],
            money: [{
                required: true, validator: validateMoney, trigger: 'change'
            }],
            name: [{required: true, message: '优惠券名称不能为空', trigger: 'change'}],
            rentUserList: [{required: true, type: 'array', min: 1, message: '请选择发送对象'}]
        }

        supplierModal: boolean = false
        serviceModal: boolean = false
        rentUserModal: boolean = false

        submitAPI: string = this.$API_ENUM.CITIC_COUPON_SAVE


        submitSupplier(row) {
            const {id, name} = row;
            this.form.typeName = name;
            this.form.typeValue = id;
            this.form.supplierId = id;
            this.supplierModal = false;
        }

        submitSupplierService(row) {
            const {id, name, supplier: {id: supplierId}} = row;
            this.form.typeName = name;
            this.form.typeValue = id;
            this.form.supplierId = supplierId;
            this.serviceModal = false;
        }

        submitTenant(data) {
            if (data) {
                const rentUserList: Array<any> = [];
                data.forEach(({id, companyName}) => {
                    rentUserList.push({
                        userId: id,
                        userName: companyName,
                    })
                });

                this.form.rentUserList = rentUserList;
            }

            this.rentUserModal = false;

            (this.$refs.form as  any).validateField("rentUserList")
        }

        deleteRentUser(item, index) {
            this.form.rentUserList = this.form.rentUserList.filter(user => {
                return user.userId !== item.userId;
            });
        }

        couponTypeChane() {
            this.form.typeName = '';
            this.form.typeValue = '';
            this.form.supplierId = '';
        }

        mxArrangeSubmitData(form) {
            let couponCount = 0;
            //每个用户的优惠卷数量为页面上的数量
            form.rentUserList.forEach(item => {
                item.couponNum = form.allNums;
                couponCount += form.allNums;
            });

            //表单中的优惠券数量 * 用户数 = 真正提交的数量
            form.allNums = couponCount;

            // form.effectDate = new Date(form.effectDate).Format("yyyy-MM-dd");
            // form.expiryDate = new Date(form.expiryDate).Format("yyyy-MM-dd");

            return form;
        }

        handleSubmit() {
            if (this.form.type > 1 && !this.form.typeValue) {
                this.$Message.error("请选择优惠券服务商");
                return;
            }
            this.mxHandleSubmit();
        }


        get rentUserList() {
            return this.form.rentUserList.map(item => {
                return {
                    id: item.userId,
                    companyName: item.userName,
                }
            });
        }


    }
</script>
