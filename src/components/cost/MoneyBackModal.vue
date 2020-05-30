<style lang="scss" scoped>

    /deep/.ivu-modal-footer{
        display: none;
    }

    /deep/ .ivu-input[disabled] {
        color: #7e7d7d !important;
    }

</style>

<template>
    <Modal v-model="moneyBack" title="申请资金回退" @on-cancel="cancel" :mask-closable="false">
        <Form ref="form" :model="form" :label-width="100">
            <FormItem label="租户名称：">
                <Input v-model="form.userName" disabled></Input>
            </FormItem>
            <FormItem label="回退金额：">
                <Input v-model="form.money" disabled></Input>
            </FormItem>
            <FormItem label="添加备注：">
                <Input v-model="form.memo" type="textarea" :maxlength="100" placeholder="请添加备注信息"></Input>
            </FormItem>
            <FormItem label="上传回退凭证：">
                <ci-file-upload :files="files"
                                :fileMaxLen="5"
                                :format="format"
                                :tipText="tipText"
                                :size="2048"
                                @addFile="addFile($event,files)"
                                @removeFile="removeFile($event,files)"
                ></ci-file-upload>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="sumbit">确认</Button>
                <Button style="margin-left: 10px" @click="cancel">取消</Button>
            </FormItem>

        </Form>
    </Modal>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends Vue {

        @Prop({default: () => {}}) value;
        @Prop({default: () => {}}) paramsRow;

        files: any = []
        format: Array<string> = ['png', 'jpg', 'bmp']
        tipText: string = '上传格式：仅支持图片上传。上传文件支持jpg/png/bmp格式，上传最小尺寸不低于80px*80px。上传文件不能超过2M。'
        form: any = {
            cashAccountDetailId:this.paramsRow.id,
            userName:this.paramsRow.tname,
            money:this.paramsRow.incomeAmt,
            memo:'',
            voucherUrls:''
        }
        moneyBack: boolean = this.value;
        submitAPI:string = this.$API_ENUM.CITIC_ACCOUNT_CASH_DETAIL_REFUND_REFUND

        created() {
        }
        sumbit(){

            let formData = Object.assign({},this.mxArrangeSubmitData(this.form))
            this.$put(this.submitAPI,formData).then(res=>{
                if(this.$resOk(res)){
                    this.$emit('input',false)
                    this.$Message.success('操作成功')
                    this.$emit('mxDoSearch')

                }else{
                    this.$Message.error(`${res.message || '操作失败'}`)
                }

            })

        }
        cancel(){
            this.$emit('input',false)
        }
        mxArrangeSubmitData(form){
            let arr:Array<any> = []
            this.files.forEach(item=>{
                arr.push(item.url)
            })
            delete form.money
            delete form.userName
            form.voucherUrls = `${arr}`
            return form
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
        removeFile(val, files: Array<object>) {
            files.splice(files.findIndex((item: any) => {
                return item.uid === val.uid
            }), 1);
        }


        @Watch('value')
        monitorValue(val: boolean) {
            this.moneyBack = val
        }
        @Watch('paramsRow')
        monitorParamsRow(val: any) {

            const {tname, incomeAmt,id} = val
            this.form.userName = tname
            this.form.cashAccountDetailId = id
            this.form.money = incomeAmt

        }
    }
</script>