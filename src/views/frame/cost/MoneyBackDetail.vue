<style lang="scss" scoped>
.moneyBack{
    /deep/.iconStyle{
        font-size: 25px;
        color: #1296db;
        margin-left: 10px;
        cursor: pointer;
    }
}
</style>

<template>
    <div class="moneyBack">
        <Card>
            <p slot="title">
                资金回退详情
            </p>

            <ci-search-panel :add="false" @add="mxToDetail" @search="mxDoSearch"
                             :searchFormConfig="searchFormConfig" ref="searchPanel">
                <Button @click="goback">返回上一页</Button>
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

            <ci-image-preview v-model="previewOpen" :images="previewImages" :index="previewIndex" @on-close="closeImg"></ci-image-preview>
        </Card>
    </div>
</template>

<script lang="ts">
    import {ListMixin} from '../../../mixin';
    import MoneyBackPoptip from '../../../components/cost/MoneyBackPoptip.vue';

    import {Component, Watch} from 'vue-property-decorator';

    @Component({
        components: {
            MoneyBackPoptip
        },
    })
    export default class extends ListMixin {

        searchParam = {
            tname: '',
            operatorName: '',
            startRefundDate: '',
            endRefundDate: ''
        };

        searchFormConfig = [
            {
                type: 'input',
                key: 'tname',
                label: '租户名称',
                placeholder: '请输入租户名称',
            },
            {
                type: 'input',
                key: 'operatorName',
                label: '执行人',
                placeholder: '请输入执行人',
            },
            {
                key: '_data_',
                type: 'daterange',
                separate: true,
                keys: ['_data_', 'startRefundDate', 'endRefundDate'],
                label: '回退时间',
                dateOptions: [
                    {
                        disabledDate: (date) => this.mxGetTimeOperation('startRefundDate', 'endRefundDate',true, date)
                    }, {
                        disabledDate: (date) => this.mxGetTimeOperation('startRefundDate', 'endRefundDate',false, date)
                    }
                ]
            },
        ];

        columns = [
            {
                title: '租户名称',
                key: 'tname'
            },
            {
                title: '资金入账时间',
                key: 'cashTradeTime'
            },
            {
                title: '收入流水号',
                key: 'cashAccountDetailId',
            },
            {
                title: '已入账收入',
                key: 'cashAccountDetailAmt',
            },
            {
                title: '回退时间',
                key: 'refundDate',
            },{
                title: '由账单回退资金',
                key: 'refundPaymentDetailAmt',
                render:(h,params)=>{
                    return h(MoneyBackPoptip,{
                        props:{
                            row:params.row
                        }
                    })
                }
            },{
                title: '已回退资金',
                key: 'refundAmt',
            },{
                title: '存入余额资金',
                key: 'balance',
            },{
                title: '执行人',
                key: 'operatorName',
            },
            {
                title: '操作',
                width: '150',
                render: (h,params)=>{
                    const {memo,voucherUrls} = params.row
                    return [
                        h('Icon',{
                            'class':'iconStyle',
                            props:{type:'md-text'},
                            style:{display: memo?'inline-block':'none'},
                            attrs:{title:`${memo}`}
                        }),
                        h('Icon',{
                            'class':'iconStyle',
                            props:{
                                type:'md-image'
                            },
                            style:{display: voucherUrls?'inline-block':'none'},
                            on: {
                                click: () => {this.reviewImg(params.row)}
                            }
                        }),
                    ]
                }
            }
        ];

        searchAPI: string = this.$API_ENUM.CITIC_ACCOUNT_CASH_DETAIL_REFUND;

        previewOpen: boolean = false;
        previewImages: Array<string> = [];
        previewIndex: number = 0;

        created() {

        }


        //调整日期格式
        mxFormSearchData(searchParam) {

            if (searchParam.startRefundDate) {
                let str = new Date(searchParam.startRefundDate).Format("yyyy-MM-dd") + " 00:00:00";
                searchParam.startRefundDate = new Date(str).getTime();
            }

            if (searchParam.endRefundDate) {
                let str = new Date(searchParam.endRefundDate).Format("yyyy-MM-dd") + " 23:59:59";
                searchParam.endRefundDate = new Date(str).getTime();
            }
        }
        /*
        * 查看图片
        * */
        openPreviewImage(images: Array<string>, index: number){
            this.previewImages = images;
            this.previewIndex = index;
            this.previewOpen = true;
        }
        closeImg(index){
            this.previewIndex = index
        }
        reviewImg({voucherUrls}){
            if(voucherUrls){
                const arr = voucherUrls.split(',')
                this.openPreviewImage(arr,0)
            }
        }


        goback(){
            this.$router.back();
        }
    }

</script>