<style lang="scss" scoped>
    .recorded {

        /deep/ .iconStyle {
            font-size: 25px;
            color: #1296db;
            margin-left: 10px;
            cursor: pointer;
        }


        /deep/ .ivu-modal-warp {
            .ivu-modal{
                .ivu-modal-content{
                    .ivu-modal-body{
                        .floatLeft {
                            float: left;
                        }

                        .inlineBlock {
                            width: 80%;
                            display: inline-block;
                        }
                    }
                }
            }

        }

    }
</style>

<template>
    <div class="recorded">
        <Card>
            <p slot="title">
                收入管理——查看待确认数据
            </p>

            <ci-search-panel :add="false" :search="false" :reset="false" @add="mxToDetail"
                             @search="mxDoSearch"
                             :searchFormConfig="searchFormConfig">
                <Button slot="right" type="primary" v-if="userEmail === 'fengcm@citic.com' || userEmail === 'p-yuwj@tech.citic'" @click="enteringData">录入收入数据</Button>
            </ci-search-panel>

            <Table :columns="columns" :data="listData" :loading="loading"></Table>

            <Page class="list-page"
                  :total="total"
                  :current="pageIndex"
                  :pageSize="pageSize"
                  :page-size-opts="pageSizeOpts"
                  show-total
                  show-sizer
                  show-elevator
                  @on-change="mxChangePage"
                  @on-page-size-change="mxChangePageSize"
            ></Page>
        </Card>

        <entering-data-modal v-model="entering" @DoSearch="mxDoSearch(searchParam)" v-if="entering"></entering-data-modal>
        <Modal
                v-model="closeBooks"
                title="关闭入账"
                @on-ok="closeAccount"
                class-name="ivu-modal-form">
            <div>
                <span class="floatLeft">添加备注：</span>
                <Input v-model="closeRemark" placeholder="请填写备注信息" type="textarea" :maxlength="100"></Input>
            </div>
            <div style="margin-top: 20px">
                <span class="floatLeft">上传录入凭证：</span>
                <div class="inlineBlock">
                    <ci-file-upload
                            @addFile="addFile($event,manualVoucherUrl)"
                            @removeFile="removeFile($event,manualVoucherUrl)"
                            :fileMaxLen="5"
                            :format="format"
                            :size="2048"
                            :tipText="tipText"
                            :files="manualVoucherUrl">
                    </ci-file-upload>
                </div>
            </div>
        </Modal>

        <ci-image-preview v-model="previewOpen" :images="previewImages" :index="previewIndex" @on-close="closeImg"></ci-image-preview>
    </div>

</template>

<script lang="ts">
    import {ListMixin} from '../../../mixin';
    import enteringDataModal from '../../../components/income/enteringDataModal.vue';

    import {Component} from 'vue-property-decorator';

    @Component({
        components: {
            'entering-data-modal': enteringDataModal
        },
    })
    export default class extends ListMixin {

        searchParam = {
            accountNo: '',
            oppAccountName: '',
            tname: "",
        };
        entering: boolean = false

        closeBooks: boolean = false

        userEmail:any = this.$getSession('citic-user').email

        id:string = ''
        manualMemo: string = ''
        manualVoucherUrl: Array<string> = []
        closeRemark:string = ''

        format: Array<string> = ['png', 'jpg', 'bmp']
        tipText: string = '上传格式：仅支持图片上传。上传文件支持jpg/png/bmp格式，上传最小尺寸不低于80px*80px。上传文件不能超过2M'


        searchFormConfig = [
            {
                type: 'input',
                key: 'tname',
                label: '租户名称',

            }, {
                type: 'input',
                key: 'accountNo',
                label: '收款账号',

            },
            {
                type: 'input',
                key: 'oppAccountName',
                label: '付款账户名称',

            },
        ];

        columns = [
            {
                title: '租户名称',
                width: '200',
                key: 'matchedTname'
            },
            {
                title: '收款账户名称',
                width: '250',
                key: 'accountName'
            },
            {
                title: '收款账号',
                width: '200',
                key: 'accountNo'
            },
            {
                title: '收入金额',
                width: '150',
                key: 'tranAmount',
            },
            {
                title: '更新时间',
                width: '160',
                key: 'updateTime',
            },
            {
                title: '付款账户名称',
                width: '150',
                key: 'oppAccountName',
            },
            {
                title: '付款账号',
                width: '150',
                key: 'oppAccountNo',
            },
            {
                title: '付款账号开户行名称',
                width: '150',
                key: 'oppOpenBankName',
            },
            {
                title: '操作',
                width: '250',
                render: (h, params) => {
                    let email = this.userEmail
                    if (params.row.source === 'manual') {
                        let disabled = params.row.confirmFlag === 'confirmed' ? true : false

                        return [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                },
                                style: {
                                    display:(function () {
                                        if(email === 'songyu@citic.com'){
                                            if(disabled){
                                                return 'none'
                                            }
                                            return 'inline-block'
                                        }else{
                                            return 'none'
                                        }
                                    })()
                                },
                                on: {
                                    click: () => {
                                        this.confirmTheBooking(params.row)
                                    }
                                }
                            },'确认入账'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    disabled:disabled
                                },
                                style: {
                                    display:!disabled?'none':'inline-block'
                                },
                                on: {
                                    click: () => {
                                        this.confirmTheBooking(params.row)
                                    }
                                }
                            },'已处理'),
                            //查看备注
                            h('Icon', {
                                class: 'iconStyle',
                                props: { type: 'md-text' },
                                style: { display:params.row.manualMemo?'inline-block':'none'},
                                attrs: { title: params.row.manualMemo },
                            }),
                            // 查看图片
                            h('Icon', {
                                class: 'iconStyle',
                                props: {type: 'md-image'},
                                style: {display:params.row.manualVoucherUrl?'inline-block':'none'},
                                on: {
                                    click: () => {this.reviewImg(params.row)}
                                }
                            }),
                            // 删除数据
                            h('Icon', {
                                class: 'iconStyle',
                                props: {type: 'md-close-circle'},
                                style: {
                                    fontWeight: 'bold',
                                    display:(function () {
                                        if(email === 'fengcm@citic.com' || email === 'p-yuwj@tech.citic') {
                                            if(disabled){
                                                return 'none'
                                            }
                                            return 'inline-block'
                                        }else{
                                            return 'none'
                                        }
                                    })()
                                },
                                on: {
                                    click: () => {this.closeModal(params.row)}
                                }
                            })
                        ]
                    } else {
                        let confirmFlag = params.row.confirmFlag
                        let disabled = confirmFlag === 'closed' || confirmFlag === 'confirmed' ? true : false
                        let { manualMemo, manualVoucherUrl} = params.row

                        return [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    disabled:disabled
                                },
                                style: {
                                    display:(function () {
                                        if(email === 'songyu@citic.com'){
                                            if(!disabled){
                                                return 'inline-block'
                                            }
                                            return 'none'
                                        }else{
                                            return 'none'
                                        }
                                    })()
                                },
                                on: {
                                    click: () => {
                                        this.confirmTheBooking(params.row)
                                    }
                                }
                            },'确认入账'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    disabled:disabled
                                },
                                style: {
                                    display:!disabled?'none':'inline-block'
                                },
                                on: {
                                    click: () => {
                                        this.confirmTheBooking(params.row)
                                    }
                                }
                            },'已处理'),
                            h('Button', {
                                props: {type: 'primary'},
                                style: {
                                    marginLeft: '10px',
                                    display:(function () {
                                        if(email ==='songyu@citic.com'){
                                            if(disabled){
                                                return 'none'
                                            }
                                            return  'inline-block'
                                        }else{
                                            return  'none'
                                        }
                                    })()
                                },
                                on: {
                                    click: () => {
                                        this.closeBook(params.row)
                                    }
                                }
                            }, '关闭入账'),
                            //查看备注
                            h('Icon', {
                                class: 'iconStyle',
                                props: {type: 'md-text'},
                                style: {
                                    display: disabled && manualMemo ? 'inline-block':'none'
                                },
                                attrs: { title: params.row.manualMemo },
                            }),
                            // 查看图片
                            h('Icon', {
                                class: 'iconStyle',
                                props: {type: 'md-image'},
                                style: {
                                    display: disabled && manualVoucherUrl ? 'inline-block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.reviewImg(params.row)
                                    }
                                }
                            }),
                        ]

                    }
                }
            }
        ];

        searchAPI: string = this.$API_ENUM.CITIC_BEDC_INCOME_WAIT_CONFIRM;
        previewOpen: boolean = false;
        previewImages: Array<string> = [];
        previewIndex: number = 0;

        pageSize: number = 10;
        pageSizeOpts:Array<number> = [10, 20, 40, 60, 100];

        created() {

        }

        closeImg(index){
            this.previewIndex = index
        }
        openPreviewImage(images: Array<string>, index: number){
            this.previewImages = images;
            this.previewIndex = index;
            this.previewOpen = true;
        }

        /*
        * 录入收入数据
        * */
        enteringData() {
            this.$nextTick(()=>{
                this.entering = true
            })

        }

        /*
        * 删除数据
        * */
        closeModal({id}) {
            this.$Modal.confirm({
                title: '是否删除当前信息？',
                onOk: () => {
                    this.$put(`${this.$API_ENUM.CITIC_BEDC_CLOSED_ACCOUNTING_DEL}/${id}`).then(res=>{
                        if(this.$resOk(res)){
                            this.mxGetList()
                            this.$Message.success('删除成功！')
                        }else{
                            this.$Message.error(res.message || '操作失败！')
                        }

                    })
                }
            })
        }

        // 确认入账
        confirmTheBooking({id}) {
            this.$Modal.confirm({
                title: '是否确认入账？',
                okText: '确认入账',
                onOk: () => {
                    this.$put(`${this.$API_ENUM.CITIC_BEDC_INCOME_WAIT_CONFIRM_CONFIRMED_ACCOUNTING}/${id}`).then(res => {
                        if (this.$resOk(res)) {
                            this.$Message.success('入账成功！')
                            this.mxGetList()
                        } else {
                            this.$Message.error(`${res.message}`)
                        }

                    })
                }
            })
        }

        closeBook({id}) {
            this.closeBooks = true
            this.id = id
        }

        closeAccount(){
            let arr:Array<any> = []
            this.manualVoucherUrl.forEach((item:any)=>{
                arr.push(item.url)
            })

            this.$put(`${this.$API_ENUM.CITIC_BEDC_INCOME_WAIT_CONFIRM_CLOSED_ACCOUNTING}/${this.id}`,{
                manualMemo:this.closeRemark,
                manualVoucherUrl:`${arr}`,
            }).then(res=>{
                if(this.$resOk(res)){
                    this.mxDoSearch(this.searchParam)
                    this.$Message.success('关闭入账成功！')
                }else{
                    this.$Message.error(`${res.message}`)
                }
            })
        }

        reviewRemark({manualMemo}) {
            this.$Modal.confirm({
                title: '备注',
                content: `${manualMemo}`,
            })
        }

        reviewImg({manualVoucherUrl}) {
            if(manualVoucherUrl){
                const arr = manualVoucherUrl.split(',')
                this.openPreviewImage(arr,0)
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
    }

</script>