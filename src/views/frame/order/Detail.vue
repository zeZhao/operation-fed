<style lang="scss">
#app {
    height: inherit;
}

@import "../../../assets/scss/order.scss";

.statement-dialog {
    .ivu-modal-footer {
        background: #f7f7f7;
    }
}
</style>

<style scoped lang="scss">
.order-detail {
    height: 100%;
    background: #f5f5f5;
    padding: 20px;

    .content {
        margin: 0 auto;

        .order-header-info {
            padding: 15px 30px;
            overflow: hidden;

            p {
                overflow: hidden;
            }

            .item {
                float: left;
                display: inline-block;
                color: #888888;
                padding: 10px 120px 10px 0;
            }
        }

        .order-info {
            background: #fff;
            box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.31);
            margin-bottom: 20px;

            .header {
                line-height: 50px;
                padding-left: 20px;
                font-weight: bold;
                background: #f6f6f6;
                border-bottom: 1px solid #e9e9e9;
            }

            .body {
                padding: 10px 0;
                font-size: 12px;

                /deep/ .label {
                    display: none;
                }

                /deep/ .cost-item {
                    padding-left: 30px;
                    line-height: 25px;
                    display: inline-block;
                    color: #333;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>

<template>
    <div class="order-detail">
        <div class="content">
            <ci-order-header
                :title="orderDetail.serviceName"
                :subTitle="orderDetail.supplierName"
                :hasBack="false"
            >
                <div class="order-header-info">
                    <p>
                        <span class="item">订单号：{{orderDetail.orderId}}</span>
                        <span
                            class="item"
                            v-if="orderDetail.oldOrderId"
                        >原订单号：{{orderDetail.oldOrderId}}</span>
                    </p>

                    <p>
                        <span class="item">创建时间：{{orderDetail.createTime}}</span>
                        <span class="item">最后修改时间：{{orderDetail.updateTime}}</span>
                    </p>

                    <p>
                        <span
                            class="item"
                            v-if="orderDetail.supplierInstanceId"
                        >供应商实例ID：{{orderDetail.supplierInstanceId}}</span>
                    </p>

                    <p>
                        <span
                            class="item"
                            v-if="orderDetail.instanceStatus"
                        >实例状态：{{orderDetail.instanceStatus}}</span>
                    </p>

                    <p>
                        <span
                            class="item"
                            v-if="orderDetail.failureReason"
                        >失败原因：{{orderDetail.failureReason}}</span>
                    </p>
                </div>
            </ci-order-header>

            <div class="order-info">
                <div class="header">订单概况:</div>
                <div class="body">
                    <ci-instance-common :order="orderDetail.order"></ci-instance-common>
                </div>

                <div class="header">配置费用:</div>
                <div class="body">
                    <ci-configuration-cost :priceList="orderDetail.priceList" />
                </div>

                <div v-show="showOperationList">
                    <div class="header">操作记录:</div>
                    <div class="body">
                        <ci-instance-common :order="operationArr"></ci-instance-common>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
//@ts-ignore
import orderHeader from "../../../components/order/detail/OrderHeader.vue";
//@ts-ignore
import instanceCommon from "../../../components/order/detail/InstanceDetailCommon.vue";
//@ts-ignore
import configurationCost from "../../../components/order/detail/ConfigurationCost.vue";

import { Component, Vue } from "vue-property-decorator";

interface OrderDetail {
    serviceName: string;
    supplierName: string;
    createTime: string;
    updateTime: string;
    orderId: string;
    oldOrderId: string;
    order: Array<any>;
    priceList: Array<any>;
    supplierInstanceId: string;
    failureReason: string;
    instanceStatus: string;
    supplierId: string;
    serviceId: string;
}

@Component({
    components: {
        "ci-order-header": orderHeader,
        "ci-instance-common": instanceCommon,
        "ci-configuration-cost": configurationCost
    },
    name: "order-detail"
})
export default class extends Vue {
    purchaseId!: string;
    orderDetail: OrderDetail = {
        createTime: "",
        failureReason: "",
        instanceStatus: "",
        oldOrderId: "",
        order: [],
        orderId: "",
        priceList: [],
        serviceId: "",
        serviceName: "",
        supplierId: "",
        supplierInstanceId: "",
        supplierName: "",
        updateTime: ""
    };

    operationArr: Array<any> = [];
    showOperationList: boolean = false;

    created() {
        const { purchaseId } = this.$route.query;
        this.purchaseId = `${purchaseId}`;
        this.initData();
    }

    async initData() {
        const res = await this.$get(
            this.$API_ENUM.ORDER_PURCHASE.Format(this.purchaseId)
        );

        const {
            oldOrderId,
            orderCreateTime: createTime,
            orderId,
            orderLastOperateTime: updateTime,
            serviceInfo: order,
            serviceName,
            supplierName,
            priceDesc: priceList,
            supplierInstanceId,
            failureReason,
            instanceStatus,
            supplierId,
            serviceId,
            cancelComment,
            cancelUserName,
            voucherUrl
        } = res.data;

        if (cancelComment || cancelUserName || voucherUrl) {
            this.showOperationList = true;
        }

        let newArr = [
            {
                keyDisplay: "取消备注",
                valueDisplay: cancelComment
            },
            {
                keyDisplay: "取消凭证",
                valueDisplay: voucherUrl,
                value: [voucherUrl],
                valueType: "file"
            },
            {
                keyDisplay: "操作人",
                valueDisplay: cancelUserName
            }
        ];

        this.operationArr = newArr;

        this.orderDetail = {
            oldOrderId,
            createTime,
            orderId,
            updateTime,
            order,
            serviceName,
            supplierName,
            priceList,
            supplierInstanceId,
            failureReason,
            instanceStatus,
            supplierId,
            serviceId
        };
    }
}
</script>
