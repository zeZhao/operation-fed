<style lang="scss" scoped>
    .btn-group{
        margin-bottom: 10px;
    }
    .marginR{
        margin-right: 10px;
    }
</style>

<template>
    <Card>
        <p slot="title">
            收款管理
        </p>

        <ci-search-panel :add="false" @search="mxDoSearch"
                         :searchFormConfig="searchFormConfig">
        </ci-search-panel>

        <div class='btn-group'>
            <Button :disabled = "isSendReceivables" @click='sendNotice' class="marginR">发送收款通知书</Button>
            <Button :disabled = "isCloseAdjustment" @click = 'closeAdjustment' class="marginR">关闭调账</Button>
            <Button @click = 'exportNotice'>导出收款通知书</Button>
            <span style="display:inline-block;color:red;margin-left:10px;">提示：截止账期月2019年6月（包含6月）前的数据，应收账单内“调整金额”和“代金券金额”不参与新规则计算</span>
        </div>

        <Table :columns="columns" :data="listData" :loading="loading"  @on-selection-change='selectionChange'></Table>

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
        <a @click="jump" style="float: right;margin-top: -28px">查看其他数据</a>

        <Modal
                v-model="openAdjustmentModal"
                :title='"当前收款调整"'
                :mask-closable='false'
        >
            <RadioGroup v-model="plusMinus" style="width:160px;margin:0 auto;display:block;">
                <Radio label="-">
                    减免金额
                </Radio>
                <Radio label="+">
                    增加金额
                </Radio>
            </RadioGroup>

            <ci-finance-number-input v-if='openAdjustmentModal' :number='adjustment.adjustAmount'   style="margin-top: 10px;" @number-blur='fniBulue'></ci-finance-number-input>
            <Input v-model="adjustment.adjustRemark" type="textarea" :rows="4" :maxlength='100' placeholder="输入备注信息，最多100字..." style="margin:20px 0;" ></Input>
            <ci-file-upload
                    :files="nowImgUrlList"
                    :fileMaxLen="5"
                    :size="2048"
                    @addFile="addFile($event,nowImgUrlList)"
                    @removeFile="removeFile($event,nowImgUrlList)"
                    :format="['jpg','png','bmp']"
                    tipText="上传格式：仅支持图片上传。上传文件支持jpg/png/bmp格式，上传最小尺寸不低于80px*80px。上传文件不能超过2M。"
            ></ci-file-upload>
            <div slot='footer'>
                <Button type="primary" class='btn-center' @click="confirmAdjustment">确认</Button>
            </div>
        </Modal>

        <ci-image-preview v-model="previewOpen" :images="previewImages" :index="previewIndex" @on-close="closeImg"></ci-image-preview>
    </Card>
</template>

<script lang="ts">
    import {ListMixin} from '../../../../mixin';

    import {Component} from 'vue-property-decorator';

    const INIT_PAGE_SIZE = 10;

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        searchParam = {
            companyOrUserName: '',
            auditStatus: '0',
            startMonth: "",
            endMonth: "",
        };

        nowImgUrlList:Array<any> = [];
        autoLoading = false;
        sendPollingTimer:any = '';
        isCloseAdjustment= true;
        span= 12;
        openAdjustmentModal= false;
        adjustment:any = {
            adjustAmount: '',
            adjustRemark: ''
        };
        plusMinus= '';
        selectData= [];

        previewOpen: boolean = false;
        previewImages: Array<string> = [];
        previewIndex: number = 0;

        searchFormConfig = [

            {
                type: 'select',
                key: 'tenantIds',
                label: '租户名称',
                placeholder: '请输入租户名称',
                api:this.$API_ENUM.CITIC_USER_GET_TENANT_LIST,
                formatOption: function (res) {

                    let hash = {};
                    const data2 = res.data.reduce((preVal, curVal) => {
                        hash[curVal.citicId] ? '' : hash[curVal.citicId] = true && preVal.push(curVal);
                        return preVal
                    }, [])
                    return data2.map(item => {
                        return {
                            key: item.citicId,
                            value: item.name
                        }
                    })
                },
            },

            {
                type: 'select',
                key: 'sendStatus',
                label: '发送状态',
                defaultValue: 'all',
                clearable: false,
                constValue: [{
                    value: '全部',
                    key: 'all'
                }, {
                    value: '未发送',
                    key: '0'
                }, {
                    value: '已发送',
                    key: '1'
                }, {
                    value: '发送失败',
                    key: '2'
                }, {
                    value: '取消发送',
                    key: '3'
                }]
            },
            {
                type: 'monthrange',
                key:'_month_',
                keys: ['_month_', 'startMonth', 'endMonth'],
                label: '按年/月查询',
                dateOptions:[
                    {
                        disabledDate: (date) => this.mxGetTimeOperation('startMonth', 'endMonth', true, date)
                    }, {
                        disabledDate: (date) => this.mxGetTimeOperation('startMonth', 'endMonth', false, date)
                    }
                ]
            }
        ];

        columns = [
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {

                title: '租户名称',
                key: 'tenantName'
            },
            {
                title: '账期月',
                key: 'accountPeriod'
            },
            {
                title: '账单金额',
                render: (h, params) => {
                    return h('span', {}, (Number(params.row.billAmount) / 1000).toFixed(2))
                }
            },
            {
                title: '当前收款调整',
                render: (h, params) => {
                    //TODO 字段未处理

                    let placement = 'right-end'
                    if (params.index == 0) {
                        placement = "right"
                    }

                    let text = h('Tooltip', {
                        props: {placement: placement, maxWidth: '220px'}
                    }, [
                        (Number(params.row.adjustAmount) / 1000).toFixed(2),
                        h('span', {
                            slot: 'content',
                            style: {whiteSpace: 'normal', wordBreak: 'break-all'}
                        }, params.row.adjustRemark)
                    ])

                    let text2 = h('span', {}, (Number(params.row.adjustAmount) / 1000).toFixed(2))


                    //传入对象未处理
                    let img = h('icon', {
                        props: {
                            type: 'ios-create-outline'
                        },
                        style: {
                            display: "inline-block",
                            float: "right",
                            marginRight: "30px",
                            size: 'small',
                            cursor: 'pointer',
                            fontSize: '22px'
                        },
                        on: {
                            click: () => {


                                let {row} = params

                                if (row.adjustAmount > 0) {
                                    this.plusMinusVal('+')
                                } else if (row.adjustAmount == 0) {
                                    this.plusMinusVal('')
                                } else {
                                    this.plusMinusVal('-')
                                }

                                if (!params.row.adjustVoucher) {
                                    this.urlList()
                                } else {
                                    this.defaultFileList(params.row.adjustVoucher)
                                }
                                this.openAdjustment(row)
                            }
                        }

                    })


                    let pictureBrowsing = h(
                        'Icon', {
                            props: {
                                type: 'ios-images'
                            },
                            style: {
                                display: "inline-block",
                                float: "right",
                                marginRight: "10px",
                                size: 'small',
                                cursor: 'pointer',
                                fontSize: '18px'
                            },
                            on: {
                                click: () => {
                                    if (!params.row.adjustVoucher) {
                                        this.urlList()
                                    } else {
                                        const arr = params.row.adjustVoucher.split(',')
                                        this.openPreviewImage(arr,0)
                                    }
                                    // this.$refs.picBrowse.open()
                                }
                            }
                        }
                    )

                    let btnArray:Array<any> = []
                    if (params.row.adjustVoucher && params.row.adjustVoucher.length > 0) {
                        btnArray.push(pictureBrowsing)
                    }

                    if (params.row.adjustRemark) {
                        btnArray.push(text)
                    } else {
                        btnArray.push(text)
                    }

                    if (params.row.closeAdjust != 1 && params.row.sendStatus != 4) {
                        btnArray.push(img)
                    }

                    // @ts-ignore
                    return ("div", {}, btnArray)
                }

            },
            {
                title: '上期未减免优惠金额/上期应收调整金额',
                render: (h, params) => {
                    return h('span', {}, (Number(params.row.preNoDiscount) / 1000).toFixed(2))
                }
            },
            {
                title: '实际应收金额',
                render: (h, params) => {
                    return h('span', {}, (Number(params.row.actualAmount) / 1000).toFixed(2))
                }
            },
            {
                title: '发送状态',
                key: 'sendStatus',
                render: (h, params) => {
                    let text = ''
                    switch (params.row.sendStatus + '') {
                        case '0':
                            text = '未发送'
                            break;
                        case '1':
                            text = '已发送'
                            break;
                        case '2':
                            text = '发送失败'
                            break;
                        case '3':
                            text = '取消发送'
                            break;
                        case '4':
                            text = '发送中'
                            break;

                        default:
                            break;
                    }


                    return h('span', {}, text)
                }
            },
            {
                title: '操作',
                width: 300,
                render: (h, params) => {
                    let {sendStatus} = params.row
                    let sendNotice = h("Button", {
                        props: {
                            type: 'success',
                            size: 'small',
                            disabled: this.isSendDisabled(params.row),
                        },
                        on: {
                            click: () => {
                                this.sendNotice(params.row)
                            }
                        }
                    }, sendStatus == 2 ? "再次发送" : '发送收款通知')
                    let closeNotice = h("Button", {
                        props: {
                            size: 'small',
                            disabled: this.isSendDisabled(params.row, "close"),
                        },
                        style: {
                            marginLeft: '5px'
                        },
                        on: {
                            click: () => {
                                this.closeNotice(params.row)
                            }
                        }
                    }, '关闭发送')
                    let seeDetails = h("Button", {
                        props: {
                            size: 'small'
                        },
                        style: {
                            marginLeft: '5px'
                        },
                        on: {
                            click: () => {
                                this.mxToDetail({tenantId:params.row.tenantId,accountPeriod:params.row.accountPeriod})
                            }
                        }
                    }, '查看详情')
                    return h("div", {}, [sendNotice, closeNotice, seeDetails])
                }
            },
        ];

        searchAPI: string = this.$API_ENUM.RECEIVABLES;
        editPath: string = 'detail';

        created() {
            this.getIsCloseAdjustment()
        }

        get isSendReceivables() {
            if (this.selectData.length == 0) {
                return true
            }
            for (let index = 0; index < this.selectData.length; index++) {
                const element = this.selectData[index];
                if (this.isSendDisabled(element)) {
                    return true
                }
            }
            return false
        };

        mxFormSearchData(searchParam){
            const {startMonth,endMonth,sendStatus} = searchParam
            if(sendStatus === 'all'){
                delete searchParam.sendStatus
            }
            if(startMonth){
                searchParam.startMonth = new Date(startMonth).Format("yyyyMM")
            }
            if(endMonth){
                searchParam.endMonth = new Date(endMonth).Format("yyyyMM")
            }

            return searchParam
        }
        // 设置默认已上传文件格式
        defaultFileList(file){
            console.log(file)
            let arr = file.split(",")
            let files:Array<any> = []

            arr.forEach((item,index)=>{
                let obj = {name:'', url:'',response: {data: {ossKey:''}}}
                obj.name = `附件-${index+1}`
                obj.url = item
                obj.response.data.ossKey = item.substring(item.indexOf(":")+3,item.length+1)
                files.push(obj)
            })
            this.nowImgUrlList = files
            console.log(this.nowImgUrlList)
        }
        plusMinusVal(str){
            this.plusMinus = str
        }
        urlList(){
            this.nowImgUrlList = []
        }
        openAdjustment(row){
            this.$nextTick(()=>{
                this.adjustment.adjustAmount = Math.abs(row.adjustAmount / 1000)
                this.adjustment.adjustRemark = row.adjustRemark
                this.adjustment.id = row.id
                this.openAdjustmentModal = true
            })
        }
        closeImg(index){
            this.previewIndex = index
        }
        openPreviewImage(images: Array<string>, index: number){
            this.previewImages = images;
            this.previewIndex = index;
            this.previewOpen = true;
        }

        isSendPolling() {
            this.loading = true

            this.sendPollingTimer = setInterval(() => {
                this.$get(this.$API_ENUM.RECEIVABLES_CHECK_SEND_STATUS).then(res => {
                    // @ts-ignore
                    if (res.code == "200") {
                        this.loading = false
                        clearInterval(this.sendPollingTimer)
                        this.mxDoSearch(this.searchParam)
                    }
                })
            }, 500)
        };

        isSendDisabled(row, type = "send") {
            let isSend = false
            let {sendStatus, actualAmount} = row
            switch (Number(sendStatus)) {
                case 0:
                    isSend = false
                    break;
                case 1:
                    isSend = true
                    break;
                case 2:
                    isSend = false
                    break;
                case 3:
                    isSend = true
                    break;
                case 4:
                    isSend = true
                    break;
                default:
                    isSend = false
                    break;
            }
            if (type == "send") {
                if (!isSend && actualAmount > 0) {
                    return false
                }
                return true
            } else {
                return isSend
            }


        };

        getIsCloseAdjustment() {
            this.$get(this.$API_ENUM.RECEIVABLES_ADJUST_STATUS).then(res => {
                this.isCloseAdjustment = !res.data
            })
        };

        sendAllNotice() {
            this.$Modal.confirm({
                title: '',
                content: '是否确认发送收款通知书？',
                onOk: () => {
                    let idsArray:Array<any> = []

                    this.selectData.forEach((element:any) => {
                        idsArray.push(element.id)
                    });
                    let url = `${this.$API_ENUM.RECEIVABLES_SEND_GATHERING_NOTICE}?actualReceivableIds=${idsArray.join(",")}`

                    this.$get(url).then(res => {
                        // @ts-ignore
                        if (res.code == 200) {
                            this.isSendPolling()
                            // this.$refs.searchForm.saveSearchCriteria()
                            this.$Message.success("收款通知书已发送完成")
                        } else {
                            this.$Message.error(res.message)
                        }
                    })
                },
            });
        };

        sendNotice(data = {}) {
            this.$Modal.confirm({
                title: '',
                content: '是否确认发送收款通知书？',
                onOk: () => {
                    let url = ""
                    // @ts-ignore
                    if(data.id){
                        // @ts-ignore
                        url = `${this.$API_ENUM.RECEIVABLES_SEND_GATHERING_NOTICE}?actualReceivableIds=${data.id}`
                    }else{
                        let idsArray:Array<any> = []
                        this.selectData.forEach((element:any) => {
                            idsArray.push(element.id)
                        });
                        url = `${this.$API_ENUM.RECEIVABLES_SEND_GATHERING_NOTICE}?actualReceivableIds=${idsArray.join(",")}`

                    }

                    this.$get(url).then(res => {
                        // @ts-ignore
                        if (res.code == 200) {

                            this.isSendPolling()

                            this.$Message.success("收款通知书已发送完成")
                        } else {
                            this.$Message.error(res.message)
                        }
                    })
                },

            });
        };

        exportNotice() {
            let queryText = ''

            if (this.selectData && this.selectData.length > 0) {
                let idsArray:Array<any> = []
                this.selectData.forEach((element:any) => {
                    idsArray.push(element.id)
                });

                queryText = idsArray.join(",")
                this.$downloadFileByUrl(`${this.$CONFIG.BASE_API_URL}${this.$API_ENUM.RECEIVABLES_FILE}?ids=${queryText}`)

            } else {
                let search = this.mxFormSearchData(this.searchParam)
                let searchArray:Array<any> = []
                Object.keys(search).forEach(key => {
                    if (search[key]) {
                        searchArray.push(`${key}=${search[key]}`)
                    }
                })
                this.$downloadFileByUrl(`${this.$CONFIG.BASE_API_URL}${this.$API_ENUM.RECEIVABLES_FILE}?${searchArray.join("&")}`)
            }

        };

        closeAdjustment() {

            this.$Modal.confirm({
                title: '',
                content: '是否确认关闭调账？',
                onOk: () => {
                    this.isCloseAdjustment = true
                    this.$get(this.$API_ENUM.RECEIVABLES_ADJUST_CLOSE).then(res => {
                        // @ts-ignore
                        if (res.code == 200) {
                            this.$Message.success('关闭调账成功')
                            this.mxDoSearch(this.searchParam)
                        } else {
                            this.$Message.error(res.message)
                        }
                        this.getIsCloseAdjustment()
                    })

                },

            });
        };

        selectionChange(selectData) {
            this.selectData = selectData
        };

        fniBulue(data) {
            this.adjustment.adjustAmount = data
        };

        confirmAdjustment() {
            if (this.plusMinus === '') {
                this.$Message.error("请勾选增加或减免金额")
                return
            }
            let newImgUrlList:Array<any> = []
            console.log("请勾选增加或减免金额",this.nowImgUrlList)
            this.nowImgUrlList.forEach(item=>{
                // @ts-ignore
                newImgUrlList.push(item.url)
            })

            let requestData = {
                adjustAmount: Math.round(Number(this.plusMinus + Math.abs(this.adjustment.adjustAmount) * 1000)),
                remark: this.adjustment.adjustRemark,
                adjustVoucher: newImgUrlList.join(","),
                id: this.adjustment.id
            }


            this.$put(this.$API_ENUM.RECEIVABLES_ADJUST, requestData).then((res:any) => {
                if (res.code == 200) {
                    this.mxDoSearch(this.searchParam)
                } else {
                    this.$Message.error(res.message)
                }
                this.openAdjustmentModal = false
            })

        };

        closeNotice(data) {
            this.$Modal.confirm({
                title: '',
                content: '是否确认不给当前租户发送收款通知书？',
                onOk: () => {
                    let {tenantId, accountPeriod} = data

                    this.$get(`${this.$API_ENUM.RECEIVABLES_CANCEL_SEND_NOTICE}/${tenantId}/${accountPeriod}`).then(res => {
                        // @ts-ignore
                        if (res.code == 200) {
                            this.mxDoSearch(this.searchParam)
                            this.$Message.success("关闭发送成功")
                        } else {
                            this.$Message.error(res.message)
                        }
                    })

                },

            });
        };
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
        jump(){
            this.$router.push({
                path:'other/list'
            })
        }
    }

</script>