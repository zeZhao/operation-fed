<style lang="scss" scoped>
    /deep/.table-last-row{
        height: 300px;
    }
</style>

<template>
    <Card>
        <p slot="title">
            收款管理
        </p>

        <Row>
            <Col span="8">
                <span class='label'>租户名称：</span>
                <span class='value'>{{tenantName}}</span>
            </Col>
            <Col span="8">
                <span class='label'>收款账期月：</span>
                <span class='value'>{{accountPeriod}}</span>
            </Col>
            <Col span="8">
                <Button icon="md-arrow-round-back" style=' float:right; margin-right: 50px;' @click="goback">返回</Button>
            </Col>
        </Row>
        <Table :row-class-name="rowClassName" :columns="columns" :data="listData" max-height="700" :loading='loading' style="margin-top:20px;"></Table>

    </Card>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import {ListMixin} from '../../../../mixin';

    @Component({
        components: {},
    })
    export default class extends ListMixin {
        loading = false
        dataUrl;
        tenantName= "";
        accountPeriod= "";
        columns= [
            {
                title: '序号',
                key: "index"
            },
            {
                title: '服务名称',
                key: "serviceName"
            },
            {
                title: '账期月',
                key: "accountPeriod"
            },
            {
                title: '金额总计',
                render: (h, params) => {

                    if (params.row.type != 'total') {
                        return h("span", {}, (Number(params.row.totalPrice) / 1000).toFixed(2))
                    }
                    console.log(params.row)
                    let { amount, cashCoupon, billAdjustAmount, receivablesAdjustAmount, preNoDiscount, actualAmount } = params.row.total

                    function textCreatde(title, value, fontWeight = 'normal') {

                        return h("p", {
                            style: {
                                fontWeight: fontWeight,
                                fontSize: '14px',
                                marginTop: '4px'
                            }
                        }, `${title}：${(Number(value) / 1000).toFixed(2)}`)
                    }

                    function textCreatde2(title, value,tip, fontWeight = 'normal') {

                        let text = h('Tooltip', {
                            props: { placement: "left", maxWidth: '220px' },
                            style: {
                                fontWeight: fontWeight,
                                fontSize: '14px',
                                marginTop: '4px'
                            }
                        }, [
                            title + ':'+(Number(value) / 1000).toFixed(2),
                            h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, tip)
                        ])

                        return text
                    }
                    let placement1 = "该金额为负数时，金额名称为“上期未减免优惠金额”。该金额为正数时，金额名称为“上期应收调整金额”。"


                    return h("span", [
                        textCreatde('账单金额', amount, 'bold'),
                        textCreatde('代金券金额', cashCoupon),
                        textCreatde('账单调整金额', billAdjustAmount),
                        textCreatde('收款调整金额', receivablesAdjustAmount),
                        preNoDiscount>=0? textCreatde2('上期应收调整金额', preNoDiscount, placement1):textCreatde2('上期未减免优惠金额', preNoDiscount, placement1),
                        textCreatde('实际应收金额', actualAmount, 'bold'),
                    ])
                }
            }
        ];
        searchAPI = ""

        created() {
            const {tenantId,accountPeriod} = this.$route.query
            this.searchAPI = `${this.$API_ENUM.RECEIVABLES_SERVICE_BILL}/${tenantId}/${accountPeriod}`
            this.mxGetList()
        }

        rowClassName(row, index) {
            if (index == this.listData.length - 1) {
                return 'table-last-row'
            }
        }
        mxGetList(){
            this.$get(this.searchAPI).then(res=>{
                this.listData = res.data.paymentServiceBillInfoVOList
                this.mxFormListData(res.data)
            })
        }
        mxFormListData(data) {
            console.log(data)
            //amount 账单金额 cashCoupon 代金券金额 billAdjustAmount 账单调整金额
            //receivablesAdjustAmount 收款调整金额 preNoDiscount 上期未减免优惠金额 actualAmount 实际应收金额
            let { tenantName, accountPeriod, amount, cashCoupon, billAdjustAmount, receivablesAdjustAmount, preNoDiscount, actualAmount, paymentServiceBillInfoVOList } = data
            this.tenantName = tenantName
            this.accountPeriod = accountPeriod


            let totalObj = {
                type: 'total',
                total: {
                    amount,
                    cashCoupon,
                    billAdjustAmount,
                    receivablesAdjustAmount,
                    preNoDiscount,
                    actualAmount
                }
            }

            paymentServiceBillInfoVOList.push(totalObj)
            this.listData = paymentServiceBillInfoVOList
        }
        goback(){
            this.$router.back()
        }
    }
</script>