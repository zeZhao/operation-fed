<style lang="scss" scoped>

</style>

<template>
    <Poptip placement="bottom" width="400" transfer @on-popper-show="popperShow">
        <a>{{amt}}</a>
        <div class="api" slot="content">
            <Table :columns="columns1" :data="listData1"></Table>
        </div>
    </Poptip>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

    @Component({
        components: {},
    })

    export default class extends Vue {

        @Prop({
            default: () => {}
        }) row;
        id: string = ''
        amt: string = ''
        data:any = {}

        columns1 = [
            {
                title:'账期月',
                key:'accountPeriod'
            },
            {
                title:'账单金额（元）',
                key:'billAmount'
            }
        ]
        listData1:Array<any> = []

        submitApi: string = this.$API_ENUM.CITIC_ACCOUNT_BILL_DETAIL_FOR_LIST
        created() {

        }
        popperShow(){
            this.getTableData()
        }
        getTableData(){
            this.$get(this.submitApi,{ids:this.id}).then(res=>{
                this.$nextTick(()=>{
                    this.listData1 = res.data
                })

            })
        }

        @Watch('row', {immediate: true, deep: true})
        monitorRow(val, oldVal) {
            this.id = val.refundPaymentDetailIds
            this.amt = val.refundPaymentDetailAmt
        }
    }
</script>