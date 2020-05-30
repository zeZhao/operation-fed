<style lang="scss" scoped>
    .IncomeQuery{
        /deep/ .iconStyle {
            font-size: 25px;
            color: #1296db;
            margin-left: 10px;
            cursor: pointer;
        }

    }
</style>

<template>
    <Card class="IncomeQuery">
        <p slot="title">
            收入查询
        </p>

        <ci-search-panel :add="false" @add="mxToDetail" @search="mxDoSearch" :searchFormConfig="searchFormConfig">
            <Button type="primary" @click="recorded">待确认入账</Button>
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
</template>

<script lang="ts">
    import {ListMixin} from '../../../mixin';

    import {Component} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends ListMixin {

        searchParam = {
            accountNo: '',
            oppAccountName: '',
            startTranDate: "",
            endTranDate: "",
            accountingMethod: "",
            tname: "",
        };

        pageSize: number = 10;
        pageSizeOpts:Array<number> = [10, 20, 40, 60, 100];

        searchFormConfig = [
            {
                type: 'input',
                key: 'tname',
                label: '租户名称',

            },{
                type: 'input',
                key: 'accountNo',
                label: '收款账号',

            },
            {
                type: 'input',
                key: 'oppAccountName',
                label: '付款账户名称',

            },
            {
                type: 'select',
                key: 'accountingMethod',
                label: '入账方式',
                defaultValue: '0',
                clearable: false,
                constValue:[{
                    key: '0',
                    value: '全部'
                },{
                    key: 'manual',
                    value: '手动入账'
                },{
                    key: 'auto',
                    value: '自动入账'
                },
                ]
            },
            {
                type: 'daterange',
                separate: true,
                keys: ['_tranDate_', 'startTranDate', 'endTranDate'],
                label: '交易起止时间',
                dateOptions: [
                    {
                        disabledDate: (date) => this.mxGetTimeOperation('startTranDate', 'endTranDate', true, date)
                    }, {
                        disabledDate: (date) => this.mxGetTimeOperation('startTranDate', 'endTranDate', false, date)
                    }
                ]
            }
        ];

        columns = [
            {
                title: '租户名称',
                width: '200',
                key: 'matchedTenantName'
            },
            {
                title: '收款账户名称',
                width: '200',
                key: 'accountName'
            },
            {
                title: '收款账号',
                width: '180',
                key: 'accountNo'
            },
            {
                title: '收入金额',
                width: '180',
                // key: 'tranAmount',
                render:(h, params)=>{
                    if(params.row.accountingMethod === 'manual'){
                        return [
                            h('span',{},params.row.tranAmount),
                            h('Icon', {
                                class: 'iconStyle',
                                props: {
                                    type: 'md-text'
                                },
                                style: {
                                    display:params.row.manualMemo?'inline-block':'none'
                                },
                                attrs: {
                                  title: params.row.manualMemo
                                },
                            }),
                            // 查看图片
                            h('Icon', {
                                class: 'iconStyle',
                                props: {
                                    type: 'md-image'
                                },
                                style: {
                                    display:params.row.manualVoucherUrl?'inline-block':'none'
                                },
                                on: {
                                    click: ()=>{
                                        if(params.row.manualVoucherUrl){
                                            const arr = params.row.manualVoucherUrl.split(',')
                                            this.openPreviewImage(arr,0)
                                        }
                                    }
                                }
                            }),
                        ]
                    }else{
                        return [h('span',{},params.row.tranAmount),]
                    }

                }
            },
            {
                title: '交易时间',
                width: '160',
                key: 'tranTime',
            },
            {
                title: '付款账户名称',
                width: '175',
                key: 'oppAccountName',
            },
            {
                title: '付款账号',
                width: '200',
                key: 'oppAccountNo',
            },
            {
                title: '付款账号开户行名称',
                width: '250',
                key: 'oppOpenBankName',
            },
            {
                title: '入账方式',
                width: '100',
                key: 'accountingTxt',
            },
        ];

        searchAPI: string = this.$API_ENUM.CITIC_BEDC_INCOME;

        previewOpen: boolean = false;
        previewImages: Array<string> = [];
        previewIndex: number = 0;

        created() {

        }
        mxFormListData(row){
            return row.map(item=>{
                let accountingTxt = ''
                switch (item.accountingMethod) {
                    case 'manual':
                        accountingTxt = '手动入账'
                        break
                    case 'auto':
                        accountingTxt = '自动入账'
                        break
                }
                return {
                    accountingTxt,
                    ...item
                }
            })

        }

        //调整日期格式
        mxFormSearchData(searchParam) {

            if(searchParam.accountingMethod === '0'){
                delete searchParam.accountingMethod
            }

            if (searchParam.startTranDate) {
                searchParam.startTranDate = new Date(new Date(searchParam.startTranDate).Format("yyyy-MM-dd 00:00:00")).getTime();
            }

            if (searchParam.endTranDate) {
                searchParam.endTranDate = new Date(new Date(searchParam.endTranDate).Format("yyyy-MM-dd 23:59:59")).getTime();
            }
        }
        /*
        * 待确认入账跳转
        * */
        recorded(){
            this.$router.push({
                path:'./recorded-list'
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

    }

</script>