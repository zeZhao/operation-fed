<style lang="scss" scoped>
    .order-adjust-log {
        padding: 20px;
    }
</style>

<template>
    <div class="order-adjust-log">
        <Card>
            <p slot="title">
                订单调价备注
            </p>

            <Table :columns="columns" :data="listData" :loading="loading"></Table>

        </Card>
    </div>

</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import {ListMixin} from "@/mixin";

    @Component({
        components: {},
        name: "order-adjust-log"
    })
    export default class extends ListMixin {
        purchaseId: string = '';
        serviceName: string = '';

        columns = [
            {
                title: '操作时间',
                key: 'updateTime'
            },
            {
                title: '操作人',
                key: 'userName'
            },
            {
                title: '服务名称',
                key: 'serviceName'
            },
            {
                title: '调价前价格',
                render: (h, params) => {
                    return h('div', params.row.oldCost.map(item => {
                        return h('p', item)
                    }));
                }
            },
            {
                title: '调价后价格',
                render: (h, params) => {
                    return h('div', params.row.cost.map(item => {
                        return h('p', item)
                    }));
                }
            },
            {
                title: '备注',
                key: 'memo',
            },
        ];

        created() {
            const {purchaseId, serviceName} = this.$route.query;
            this.purchaseId = `${purchaseId}`;
            this.serviceName = `${serviceName}`;

            this.searchAPI = `${this.$API_ENUM.ORDER_ADJUST_PRICE_LOG}`.Format(purchaseId);

            this.mxGetList();
        }

        mxFormListData(list) {
            return list.map(item => {

                const {detailCost, oldDetailCost} = item;

                const cost: Array<string> = [];
                const oldCost: Array<string> = [];

                if (detailCost && detailCost[0]) {
                    detailCost[0].cost.forEach(item => {
                        const {cost_name, cost_value, cost_unit_name} = item;
                        cost.push(cost_name + ":" + cost_value + cost_unit_name)
                    })
                }

                if (oldDetailCost && oldDetailCost[0]) {
                    oldDetailCost[0].cost.forEach(item => {
                        const {cost_name, cost_value, cost_unit_name} = item;
                        oldCost.push(cost_name + ":" + cost_value + cost_unit_name)
                    })
                }

                return {
                    serviceName: this.serviceName,

                    cost,
                    oldCost,

                    ...item
                };
            })
        }
    }

</script>