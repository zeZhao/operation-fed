<style lang="scss" scoped>
    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal {
            top: 0;
        }

        .limit {
            width: 60%;
        }
    }

    /deep/ .ivu-modal-footer {
        display: none;
    }
</style>

<template>
    <Modal
            title="申请调整信用额度"
            v-model="adjust"
            @on-cancel="cancel"
            :mask-closable="false"
            class-name="vertical-center-modal">
        <Form ref="form" :model="form" :rules="ruleValidate" :label-width="120">
            <FormItem label="租户名称:">
                <p>{{name}}</p>
            </FormItem>
            <FormItem label="额度调至:" prop="targetCreditLines">
                <Input class="limit" number v-model="form.targetCreditLines" placeholder="请输入调额后目标额度，精确到0.00"></Input> 元
            </FormItem>
            <FormItem label="是否临时调额:" prop="temporaryAdjustFlag">
                <RadioGroup v-model="form.temporaryAdjustFlag">
                    <Radio label="1">是</Radio>
                    <Radio label="0">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="选择额度有效期:" v-if="form.temporaryAdjustFlag === '1'" required>
                <Row>
                    <Col span="11">
                        <FormItem prop="effectiveStartDate">
                            <DatePicker type="date" placeholder="请选择时间范围起始"
                                        :options="optionsStart"
                                        @on-change="startDateChange"
                                        v-model="form.effectiveStartDate"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <FormItem prop="effectiveEndDate">
                            <DatePicker type="date" placeholder="请选择时间范围结束"
                                        :options="optionsEnd"

                                        v-model="form.effectiveEndDate"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="调额原因:" prop="reasons">
                <Input v-model="form.reasons" type="textarea" :maxlength="100" :autosize="{minRows: 2,maxRows: 5}"
                       placeholder="请简要说明调额原因，最多100字。"></Input>
            </FormItem>
            <FormItem label="上传附件:">
                <ci-file-upload
                        @addFile="addFile($event,files)"
                        @removeFile="removeFile($event,files,form.attachmentUrl)"
                        :fileMaxLen="3"
                        :files="files">
                </ci-file-upload>
            </FormItem>
            <FormItem>
                <Button type="error" @click="mxHandleSubmit" style="margin-left: 100px">提交</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {FormMixin} from '@/mixin'


    const validatorLimit = (rule, value, callback) => {
        let reg = /^\d+\.?\d{0,2}$/;
        if (value) {
            if (!reg.test(value)) {
                callback(new Error('仅支持数字和小数点后两位'));
                return;
            }
            callback();
            return;
        } else if (value === 0) {
            callback(new Error('请输入大于0的数值。'));
            return;
        } else {
            callback(new Error('此项不能为空'));
            return;
        }
    }

    interface Form {
        attachmentUrl?: string,
        creditAccountId: string,
        effectiveEndDate?: string | number,
        effectiveStartDate?: string | number,
        reasons?: string,
        targetCreditLines: number | string | null,
        temporaryAdjustFlag: string | boolean,
    }

    @Component({
        components: {},
    })

    export default class extends FormMixin {


        @Prop({
            default: () => {
            }
        }) value;
        @Prop({
            default: () => {
            }
        }) params;

        adjust: boolean = this.value;
        files: any = [];
        name: string = ''

        optionsStart:any = {
            disabledDate: date => {
                return date && date.valueOf() < Date.now() - 86400000;
            }
        }
        optionsEnd:any = {
            disabledDate: date => {
                if(this.form.effectiveStartDate){
                    return date < this.form.effectiveStartDate
                }else{
                    return date && date.valueOf() < Date.now() - 86400000;
                }

            }
        }

        form: Form = {
            creditAccountId: '',
            targetCreditLines: '',
            temporaryAdjustFlag: '1',
            reasons: '',
            effectiveStartDate: '',
            effectiveEndDate: '',
            attachmentUrl: ''
        };

        ruleValidate = {
            targetCreditLines: [
                {required: true, trigger: 'change', validator: validatorLimit}
            ],
            temporaryAdjustFlag: [
                {required: true, trigger: 'change'}
            ],
            effectiveStartDate: [
                {required: true, type: 'date', message: '请选择时间', trigger: 'change'}
            ],
            effectiveEndDate: [
                {required: true, type: 'date', message: '请选择时间', trigger: 'change'}
            ],
            reasons: [
                {required: true, message: '此项不能为空', trigger: 'blur'}
            ],
        }
        submitAPI:string = this.$API_ENUM.CITIC_ACCOUNT_CREDIT_ADJUST

        created() {
        }

        cancel() {
            this.$emit('input', false)
        }

        startDateChange(val){
            const {effectiveStartDate,effectiveEndDate} = this.form
            if(effectiveEndDate && effectiveStartDate){

                const start = new Date(effectiveStartDate).getTime()
                const end = new Date(effectiveEndDate).getTime()

                if(start > end){
                    this.$nextTick(()=>{
                        this.form.effectiveEndDate = ''
                    })
                }
            }
        }

        /*
        * 提交前修改表单数据
        * */
        mxArrangeSubmitData(form) {
            let {temporaryAdjustFlag, effectiveStartDate, effectiveEndDate} = form

            form.temporaryAdjustFlag = temporaryAdjustFlag === '1' ? true : false

            if (temporaryAdjustFlag === '1') {
                form.effectiveStartDate = new Date(new Date(effectiveStartDate).Format('yyyy-MM-dd 00:00:00')).getTime()
                form.effectiveEndDate = new Date(new Date(effectiveEndDate).Format('yyyy-MM-dd 23:59:59')).getTime()
            }else{
                delete form.effectiveStartDate
                delete form.effectiveEndDate
            }

            if (this.files.length) {
                let arr: Array<any> = []
                this.files.forEach(item => {
                    arr.push(item.url)
                })
                form.attachmentUrl = `${arr}`
            }

            return form
        }

        mxSuccess(res){

            if (this.$resOk(res)) {
                this.$emit('DoSearch')
                this.$emit('input', false)
                this.$Message.success('请您前往调额管理页查看调额进度。');
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

        @Watch('value', {immediate: true, deep: true})
        monitorValue(val) {
            this.$nextTick(()=>{
                this.adjust = val
            })

        }

        @Watch('params', {immediate: true, deep: true})
        monitorParams(val: any) {
            this.name = val.tname
            this.form.creditAccountId = val.id
        }
    }
</script>