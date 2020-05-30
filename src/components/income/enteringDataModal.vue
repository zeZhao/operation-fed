<style lang="scss" scoped>
    /deep/ .ivu-modal-footer {
        display: none;
    }

    /deep/ .ivu-select .ivu-select-dropdown {
        width: inherit;
    }

    /deep/ .ivu-input[disabled] {
        color: #7e7d7d !important;
    }

</style>

<template>
    <div class="entering">
        <Modal
                title="添加收入数据"
                v-model="entering"
                @on-cancel="cancel"
                :mask-closable="false"
                :styles="{top: '20px'}">
            <Form ref="form" :model="form" :rules="formRulesList" :label-width="120">
                <FormItem label="租户名称：" prop="tenementName">
                    <Select v-model="form.tenementName" placeholder="请输入租户名称" filterable @on-change="accountNameChange"
                            :label-in-value='true'>
                        <Option v-for="(item,index) in accountsAll"
                                :value="`${item.accountCode}&&${item.matchedId}`"
                                :key="index">{{item.accountName}}
                        </Option>
                    </Select>
                    <!--                <Input v-model="form.tenementName" placeholder="请输入租户名称"></Input>-->
                </FormItem>
                <FormItem label=" 收款账户名称：" prop="accountName">
                    <Input v-model="form.accountName" placeholder="请输入收款账户名称" disabled></Input>
                </FormItem>
                <FormItem label="收款账号：" prop="accountNo">
                    <Input v-model="form.accountNo" placeholder="请输入收款账号" disabled></Input>
                </FormItem>
                <FormItem label="金额：" prop="tranAmount">
                    <Input v-model="form.tranAmount" placeholder="请输入金额"></Input>
                </FormItem>
                <FormItem label="添加备注：" prop="manualMemo">
                    <Input v-model="form.manualMemo" type="textarea" placeholder="请添加备注信息" :maxlength="50"></Input>
                </FormItem>
                <FormItem label="上传录入凭证:">
                    <ci-file-upload
                            @addFile="addFile($event,files)"
                            @removeFile="removeFile($event,files,form.manualVoucherUrl)"
                            :fileMaxLen="5"
                            :format="format"
                            :tipText="tipText"
                            :files="files">
                    </ci-file-upload>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="okBtn">确认</Button>
                    <Button @click="cancel">取消</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>


</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {FormMixin} from '@/mixin'

    const validateMoney = (rule, value, callback) => {
        if (value) {
            let reg = /^\d+\.?\d{0,2}$/
            if (!reg.test(value)) {
                callback(new Error('仅支持数字及小数点后两位'))
                return
            } else {
                callback()
                return
            }
        } else {
            callback(new Error('金额不能为空'))
            return;
        }
    }

    interface Form {
        matchedId: string,
        accountName: string,
        accountNo: string,
        tranAmount: string | number,
        manualMemo?: string,
        manualVoucherUrl?: string,
    }

    @Component({
        components: {},
    })
    export default class extends FormMixin {

        @Prop({
            default: () => {
            }
        }) value;

        submitAPI: string = this.$API_ENUM.CITIC_BEDC_INCOME_WAIT_CONFIRM

        form: any = {
            matchedId: '',
            accountName: '',
            accountNo: '',
            tranAmount: 0,
            manualMemo: '',
            manualVoucherUrl: '',
        };
        accountsAll: Array<any> = []

        files: any = [];
        format: Array<string> = ['png', 'jpg', 'bmp']
        tipText: string = '上传格式：仅支持图片上传。上传文件支持jpg/png/bmp格式，上传最小尺寸不低于80px*80px。上传文件不能超过2M'

        entering: boolean = this.value
        formRulesList: any = {

            tenementName: [
                {required: true, trigger: 'blur', message: '租户名称不能为空'}
            ],
            accountName: [
                {required: true, trigger: 'blur', message: '收款账户名称不能为空'}
            ],
            accountNo: [
                {required: true, trigger: 'blur', message: '收款账号不能为空'}
            ],
            tranAmount: [
                {required: true, type: 'number', validator: validateMoney, trigger: 'blur'}
            ],
        };

        created() {
            this.getAccountsAll()
        }

        getAccountsAll() {
            this.$get(this.$API_ENUM.CITIC_BEDC_BANK_ACCOUNTS_ALL).then(res => {
                if (this.$resOk(res)) {
                    this.accountsAll = res.data
                }
            })
        }

        accountNameChange(data) {
            const arr = data.value.split("&&")
            this.$nextTick(() => {
                this.form.accountName = data.label
                this.form.accountNo = arr[0]
                this.form.matchedId = arr[1]
            })
        }

        mxArrangeSubmitData(formData) {
            let arr: any = []
            this.files.forEach(item => {
                arr.push(item.url)
            })
            formData.manualVoucherUrl = `${arr}`
            return formData
        }

        okBtn() {
            (this.$refs.form as Vue).validate((valid) => {
                if (valid) {
                    this.mxHandleSubmit(valid)
                } else {
                    this.$Message.error('表单校验失败!');
                }
            })

        }

        mxSuccess(res) {
            if (this.$resOk(res)) {
                // this.files = [];
                this.$Message.success('操作成功!');
                this.$emit('input', false)
                this.$emit('DoSearch');
                // this.mxHandleReset()
            } else {
                this.$Message.error(res.msg || res.message);
            }
        }

        /*
       * 上传文件
       * */
        addFile(val: object, files: Array<any>): Array<object> {
            files.push(val)
            return files
        }

        /*
        * 删除文件
        * */
        removeFile(val, files: Array<object>, str: string) {
            files.splice(files.findIndex((item: any) => {
                return item.uid === val.uid
            }), 1);
        }

        cancel() {
            this.$emit('input', false)
        }

        @Watch('value', {immediate: true, deep: true})
        onPersonChanged(val: boolean, oldVal: boolean) {
            this.entering = val
        }
    }
</script>