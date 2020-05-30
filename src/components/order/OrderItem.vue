<style scoped lang="scss">
.order-item {
    margin-bottom: 10px;
    border: 1px solid #dbf3ff;
    box-shadow: 0 0 0 0 rgba(204, 204, 204, 0);
    transition: 0.3s;

    .header {
        background: #ebf8ff;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding: 10px 15px;

        .left,
        .right {
            flex-grow: 1;
        }

        .left {
            font-size: 12px;

            .title {
                color: #1a1a1a;
                margin-right: 30px;
            }

            .order-info {
                color: rgba(26, 26, 26, 0.71);
                margin-right: 30px;

                &.right {
                    float: right;
                    margin: 0;
                    padding: 0;
                }
            }
        }
    }

    .price-total {
        border-top: 1px solid #dbf3ff;
        padding: 20px 40px 30px 40px;
    }

    .footer {
        border-top: 1px solid #dbf3ff;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding: 15px 20px;
        font-size: 12px;

        .left,
        .right {
            flex-grow: 1;
        }

        .right {
            text-align: right;

            .ivu-btn {
                margin-left: 10px;
            }
        }

        .remark {
            color: #666;

            p {
                padding: 5px 0;
            }
        }

        .update-time {
            color: #666;
        }
    }

    .content {
        font-size: 12px;

        /deep/ .row {
            display: flex;
            border-top: 1px solid #dbf3ff;
            position: relative;

            &.border {
                border-top: 1px solid #dbf3ff;
                border-bottom: 1px solid #dbf3ff;
            }

            .cell {
                /*display: inline-block;*/
                border-right: 1px solid #dbf3ff;
                border-top: 1px solid #dbf3ff;
                text-align: center;
                color: #333;
                min-height: 50px;

                display: flex;
                justify-content: center;
                flex-direction: column;

                &.text-right {
                    text-align: right;
                    padding: 0 20px;
                }

                &.text-left {
                    text-align: left;
                    padding: 0 20px;
                }

                &.bold {
                    font-weight: bold;
                    color: #333;
                }

                &.light {
                    color: #666;
                }

                &.empty-cell {
                    border-top: none;
                }

                .action-btn {
                    padding: 0 10px;
                    transition: 0.3s;
                    display: inline-block;
                    margin: 5px;

                    /*&:hover {
                            color: #ed3f14;
                        }

                        cursor: pointer;*/
                }

                .sub-cell {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    border-right: none;

                    &:first-child {
                        border-top: none;
                    }

                    .cell {
                        flex-grow: 1;
                    }
                }

                &.text {
                    padding-top: 15px;
                    padding-bottom: 15px;
                }

                &.vertical-item {
                    padding-top: 15px;

                    &:first-child {
                        margin-top: -15px;
                    }
                }
            }

            &:first-child > .cell {
                border-top: none;
            }

            & > .cell:last-child {
                border-right: none;
            }

            &.title {
                background: #ebf8ff;
            }
        }
    }

    .content > div:first-child > .row {
        border-top: none;
    }

    .price-panel {
        .row {
            .cell {
                color: #ea4223;
            }
        }
    }
}

/deep/ .cancelFormText textarea.ivu-input {
    margin-top: 10px;
    height: 100px;
}

/deep/ .cancelFormText .ivu-upload-list-file {
    line-height: 1.5;
}
</style>

<template>
    <div class="order-item">
        <div class="header">
            <div class="left">
                <span class="title">{{order.createTime}}</span>
                <span class="order-info">订单号：{{order.id}}</span>
                <span class="order-info">类型：{{order.typeDesc}}</span>
                <span class="order-info">状态：{{order.statusDesc}}</span>
                <span class="order-info right">最后一次操作时间：{{order.lastOperateTime}}</span>
            </div>
        </div>

        <div class="content">
            <Row class="row title">
                <Col class="cell text text-left" span="6">服务名称</Col>
                <Col class="cell text text-left" span="5">服务商</Col>
                <Col class="cell text text-left" span="3">实例个数</Col>
                <Col class="cell text text-left" span="3">实例成功个数</Col>
                <Col class="cell text" span="4">价格</Col>
                <Col class="cell text" span="3">操作</Col>
            </Row>

            <div v-for="(purchase) in order.purchaseList" :key="purchase.id">
                <Row class="row">
                    <!--服务名称-->
                    <Col class="cell text-left text bold" span="6">{{purchase.serviceName}}</Col>

                    <!--服务商-->
                    <Col class="cell text-left text bold" span="5">{{purchase.supplierName}}</Col>

                    <!--实例个数-->
                    <Col class="cell text text-left" span="3">{{purchase.instanceNum}}</Col>

                    <!--实例成功个数-->
                    <Col class="cell text text-left" span="3">{{purchase.instanceSuccessNum}}</Col>

                    <!--费用-->
                    <Col class="cell" span="4">
                        <span
                            class="cell sub-cell"
                            v-for="(cost, costIndex) in purchase.priceDesc"
                            :key="costIndex"
                        >{{cost}}</span>
                    </Col>

                    <!--操作-->
                    <Col class="cell bold text" span="3">
                        <div>
                            <Button class="action-btn" @click="toDetail(purchase.id)">查看详情</Button>
                            <Button
                                class="action-btn"
                                v-if="showAdjustment(purchase)"
                                @click="priceAdjustment(purchase)"
                            >订单调价</Button>
                            <Button
                                class="action-btn"
                                :disabled="prohibitToLog(purchase)"
                                @click="toPriceAdjustmentLog(purchase)"
                            >查看备注</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>

        <div class="price-total">
            <ci-settlement :settlement="settlement" :couponSendBack="order.couponSendBack" />
        </div>

        <div class="footer">
            <div class="left remark">
                <p v-if="showApprovalInfo">审批意见：{{order.auditOpinion}}</p>
                <p>租户名称：{{order.tenantName}}</p>
            </div>
            <div class="right">
                <Button
                    type="error"
                    v-if="showCancelOrder()"
                    @click="toCancelOrder(order.id)"
                >取消订单</Button>
            </div>
        </div>

        <Modal v-model="priceAdjustmentDialog" :title="`订单号：${order.id}`">
            <Form ref="form" :model="adjustPurchaseForm" :label-width="80" class="form">
                <FormItem label="服务名称：">
                    <p>{{adjustPurchaseInfo.serviceName}}</p>
                </FormItem>

                <FormItem
                    :label="`${cost.cost_name}：`"
                    v-for="(cost, index) in adjustPurchaseForm.detailCostArr"
                    :key="index"
                >
                    <Input v-model="cost.cost_value" style="width: 200px;"></Input>
                    <span style="margin-left: 10px;">{{cost.cost_unit_name}}</span>
                </FormItem>

                <FormItem label="备注：">
                    <Input type="textarea" :maxlength="30" v-model="adjustPurchaseForm.remark"></Input>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary" @click="submitPriceAdjustment">提交</Button>
            </div>
        </Modal>

        <Modal v-model="confirmCancelDialog" title="取消订单">
            <span>请详细核实订单情况，防止在您取消订单前已完成订单交付。</span>
            <Form ref="form" :model="cancelForm" :label-width="0" class="form cancelFormText">
                <FormItem>
                    <Input
                        type="textarea"
                        :maxlength="300"
                        v-model="cancelForm.cancelComment"
                        placeholder="取消订单备注内容，最多可输入300字。"
                    ></Input>
                </FormItem>

                <FormItem>
                    <Upload
                        ref="uploadBtn"
                        :action="action"
                        :format="format"
                        :headers="headers"
                        :before-upload="handleBeforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :on-format-error="formatError"
                        :on-exceeded-size="onExceededSize"
                        :on-remove="remove"
                        :max-size=" 5 * 1024 "
                        :default-file-list="defaultFileList"
                    >
                        <p>上传取消订单凭证。</p>
                        <p>上传文件支持doc/docx/jpg/png/bmp/pdf/rar/zip格式。</p>
                        <p>上传文件不能超过5M。</p>
                        <Button icon="ios-cloud-upload-outline">上传附件</Button>
                    </Upload>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="primary" @click="confirmCancelOrder" :disabled="!canCancelFlag">确认</Button>
                <Button type="error" @click="onCancelDialog">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
//@ts-ignore
import settlement from "./Settlement.vue";

import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Settlement } from "@/interface/order";

const FORMAT = ["doc", "docx", "jpg", "png", "bmp", "pdf", "rar", "zip"];

@Component({
    components: {
        "ci-settlement": settlement
    },
    name: "order-item"
})
export default class extends Vue {
    @Prop() order!: any;

    settlement: Settlement = {
        payable: 0,
        total: 0,
        couponDeduction: 0
    };

    priceAdjustmentDialog: boolean = false;

    confirmCancelDialog: boolean = false;

    // 当前进行调价的清单
    adjustPurchaseInfo = {
        id: "",
        detailCost: ""
    };
    adjustPurchaseForm = {
        detailCostArr: [],
        remark: ""
    };

    // 确认取消表单
    cancelForm = {
        cancelComment: "",
        voucherUrl: "",
        id: ""
    };

    // 上传组件
    action: string =
        this.$CONFIG.BASE_API_URL + this.$API_ENUM.CITIC_CANCEL_ORDER_UPLOAD;

    headers: object = {
        "citic-token": this.$getSession("citic-token")
    };

    format: Array<string> = FORMAT;

    defaultFileList: Array<FileListItem> = [];

    created() {
        const {
            orderAmt: total,
            orderRealAmt: payable,
            orderDiscountAmt: couponDeduction
        } = this.order;
        this.settlement = {
            payable,
            total,
            couponDeduction
        };
    }

    /**
     * 跳转到订单详情页面
     */
    toDetail(purchaseId) {
        window.open(`#/order-detail?purchaseId=${purchaseId}`);
    }

    /**
     * 展示调价弹窗
     */
    priceAdjustment(purchase) {
        this.adjustPurchaseInfo = purchase;

        let detailCost = purchase.detailCost;

        try {
            detailCost = JSON.parse(detailCost);
            this.adjustPurchaseForm.detailCostArr = detailCost[0].cost;
            this.adjustPurchaseForm.remark = "";
        } catch (e) {
            console.error("detailCost 解析失败:", e);
            // 解析失败设置为空值
            this.adjustPurchaseForm = {
                detailCostArr: [],
                remark: ""
            };
        }

        this.priceAdjustmentDialog = true;
    }

    /**
     * 提交调价配置
     */
    submitPriceAdjustment() {
        const { id, detailCost } = this.adjustPurchaseInfo;
        let detailCostJson = JSON.parse(detailCost);

        const { detailCostArr, remark } = this.adjustPurchaseForm;

        // 校验提交参数是否符合规范
        if (!remark) {
            this.$Message.error("请输入调价备注！");
            return;
        }

        // 校验价格输入是否正确
        for (const costItem of detailCostArr) {
            let cost = `${(costItem as any).cost_value}`;
            if (!cost) {
                this.$Message.error("价格不能为空！");
                return;
            }
        }

        this.$post(this.$API_ENUM.ORDER_ADJUST_PRICE, {
            originCostArray: JSON.stringify(detailCostJson[0].cost),
            listId: id,

            costArray: JSON.stringify(detailCostArr),
            adjustPriceMemo: remark
        }).then(res => {
            if (this.$resOk(res)) {
                this.$Message.success("订单调价成功");
                this.priceAdjustmentDialog = false;
                this.$emit("refreshList");
            } else {
                this.$Message.error(res.message || "订单调价失败");
            }
        });
    }

    /**
     * 跳转到调价记录页面
     */
    toPriceAdjustmentLog({ id, serviceName }) {
        window.open(
            `#/order-adjust-log?purchaseId=${id}&serviceName=${serviceName}`
        );
    }

    /**
     * 没有日志禁止跳转
     * adjustPriceCount === 0
     */
    prohibitToLog(purchase) {
        return purchase.adjustPriceCount === 0 || !purchase.adjustPriceCount;
    }

    /**
     * 待审批 且 包费 且 没有优惠券 可以调价
     * 可以调价 返回 false 不隐藏按钮
     */
    showAdjustment(purchase) {
        try {
            const detailCost = JSON.parse(purchase.detailCost);
            const billingType = detailCost[0].cost[0].billingType;
            return (
                ["waitApproval"].includes(this.order.status) &&
                billingType === "package" &&
                this.order.orderDiscountAmt === 0
            );
        } catch (e) {
            console.error("detailCost 解析失败:", e);
        }

        return false;
    }

    /**
     * 待审批 可以取消订单
     */
    showCancelOrder() {
        return ["waitApproval"].includes(this.order.status);
    }

    /** 打开确认取消订单弹窗 */
    toCancelOrder(id) {
        this.cancelForm.id = id;
        this.confirmCancelDialog = true;
    }

    /** 确认取消订单 */
    confirmCancelOrder() {
        this.$post(
            this.$API_ENUM.CITIC_CONFIRM_CANCLE_ORDER,
            this.cancelForm
        ).then(res => {
            if (this.$resOk(res)) {
                this.$Message.success("取消订单成功");
                this.confirmCancelDialog = false;
                this.$emit("refreshList");
            } else {
                this.$Message.error(res.message || "取消订单失败");
                this.confirmCancelDialog = false;
            }
        });
    }

    /** 取消订单弹窗关闭 */
    onCancelDialog() {
        this.confirmCancelDialog = false;
    }

    /*----------文件上传相关方法---------------*/
    handleBeforeUpload() {
        // @ts-ignore
        this.$refs.uploadBtn.clearFiles();
    }

    onExceededSize() {
        this.$Message.error(`请上传小于5m的文件`);
    }

    uploadError() {
        this.$Message.error("文件上传失败");
    }

    uploadSuccess(res, file, fileList) {
        if (this.$resOk(res)) {
            this.$Message.success("文件上传成功");
            this.defaultFileList = fileList;
            this.cancelForm.voucherUrl = res.data.fileUrl;
        } else {
            this.$Message.error("文件上传失败");
            // @ts-ignore
            this.$refs.uploadBtn.clearFiles();
        }
    }

    formatError() {
        this.$Message.error("文件格式错误");
    }

    remove(file, fileList) {
        this.defaultFileList = fileList;
        this.cancelForm.voucherUrl = "";

        const {
            response: {
                data: { ossKey }
            }
        } = file;

        this.$del(`${this.$API_ENUM.COMMON_DELETE_FILE}?ossKey=${ossKey}`);
    }
    /*----------文件上传相关方法结束---------------*/

    /**
         *   待审批(1,waitApproval)
         交付中(2,pending)
         已取消(3, canceled)
         已完成(4,finished)
         拒绝(5,refused)
         未提交(7,unsubmitted)
         审批不通过(8,refusingApproval)
         审批通过(9,approval)
         交付失败(10,deliveryFailure)
         已经计费(11,alreadyBilling)
         待计费(12,nonilling)
         计费失败(13,billingFailure)
         计费成功(14,billingSuccess)
         * @returns {boolean}
         */
    get showApprovalInfo() {
        return !["waitApproval", "unsubmitted", "canceled"].includes(
            this.order.status
        );
    }

    get canCancelFlag() {
        return this.cancelForm.voucherUrl && this.cancelForm.cancelComment;
    }
}
</script>
