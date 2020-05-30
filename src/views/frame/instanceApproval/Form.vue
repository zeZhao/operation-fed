<style scoped lang="scss" type="text/scss">
.instanceApproval-detail {
    margin-bottom: 20px;

    /deep/ .ivu-card-head p {
        line-height: 100%;
        height: auto;
        text-align: right;

        .status {
            float: left;
            line-height: 32px;
        }
    }

    .status-box {
        width: 300px;
        margin: 0 auto;
        overflow: hidden;

        .finish-icon {
            color: #5cb85c;
            float: left;
        }

        .finish-txt {
            float: left;
            margin-left: 15px;
            padding-top: 8px;

            .finish-tit {
                font-size: 24px;
                color: #5cb85c;
                font-weight: bold;
            }
        }

        .await-txt {
            float: left;
            font-size: 26px;
            color: #327dc2;
            padding-left: 15px;
            padding-top: 9px;
            display: inline-block;
        }
    }

    .message {
        margin-top: 40px;

        .list {
            height: 40px;
            line-height: 40px;
            font-size: 12px;

            .list-key {
                text-align: right;
            }

            .list-value {
                padding-left: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .btn-group {
        width: 210px;
        margin: 40px auto;

        .ivu-btn {
            // width: 200px;
            margin-right: 20px;
        }
    }
}
</style>

<template>
    <div>
        <Card class="instanceApproval-detail">
            <p slot="title">
                <span class="status">审批详情</span>
                <Button type="error" @click="goback">返回上一页</Button>
            </p>

            <div>
                <div class="status-box">
                    <div class="finish clearfix" v-if="statusCode === 1">
                        <Icon type="ios-checkmark-circle" size="70" class="finish-icon" />
                        <div class="finish-txt">
                            <p class="finish-tit">完成服务交付</p>
                            <p class="finish-time">交付时间：{{appMap.updateTime}}</p>
                        </div>
                    </div>

                    <div class="finish clearfix" v-else-if="statusCode === 5">
                        <Icon type="ios-close-circle" size="70" class="finish-icon" />
                        <div class="finish-txt">
                            <p class="finish-tit">服务实例已取消</p>
                            <p class="finish-time">取消时间：{{appMap.updateTime}}</p>
                        </div>
                    </div>

                    <div v-else class="clearfix">
                        <Icon type="ios-time" size="60" style="color:#709FCC" class="finish-icon" />
                        <p class="await-txt">等待服务交付</p>
                    </div>
                </div>
                <div class="message clearfix">
                    <Row v-for="(item,key,index) in instanceMap" :key="index" class-name="list">
                        <Col span="4" class-name="list-key">{{key}}：</Col>
                        <Col span="20" class-name="list-value">{{item}}</Col>
                    </Row>
                    <Row class-name="list">
                        <Col span="4" class-name="list-key">服务名称：</Col>
                        <Col span="20" class-name="list-value">{{appMap.serviceName}}</Col>
                    </Row>
                    <Row class-name="list">
                        <Col span="4" class-name="list-key">云平台实例ID：</Col>
                        <Col span="20" class-name="list-value">{{appMap.cloudInsId}}</Col>
                    </Row>
                    <Row class-name="list">
                        <Col span="4" class-name="list-key">供应商实例ID：</Col>
                        <Col span="20" class-name="list-value">{{appMap.id}}</Col>
                    </Row>
                    <Row class-name="list">
                        <Col span="4" class-name="list-key">供应商名称：</Col>
                        <Col span="20" class-name="list-value">{{appMap.supplierName}}</Col>
                    </Row>
                    <Row class-name="list">
                        <Col span="4" class-name="list-key">实例创建时间：</Col>
                        <Col span="20" class-name="list-value">{{appMap.createTime}}</Col>
                    </Row>
                    <Row class-name="list">
                        <Col span="4" class-name="list-key">实例交付时间：</Col>
                        <Col span="20" class-name="list-value">{{appMap.updateTime}}</Col>
                    </Row>
                </div>
                <div class="btn-group" v-show="statusCode !== 1 && statusCode !== 5">
                    <Button type="success" @click="approval">确认交付</Button>
                    <Button @click="cancelApproval">取消交付</Button>
                </div>
            </div>
        </Card>

        <Card class="instanceApproval-detail">
            <p slot="title">
                <span class="status">审批记录</span>
            </p>

            <Table :columns="columns" :data="listData"></Table>
        </Card>

        <!--查询操作日志-->
        <Modal v-model="approvalDialog">
            <p slot="header">确认交付</p>
            <Form ref="form" :model="form" class="form">
                <Alert type="error" style="color: red">请谨慎操作确认交付，确认交付后该服务的订单将在当月账单中收取费用。</Alert>

                <FormItem label prop="message">
                    <i-input
                        type="textarea"
                        :rows="10"
                        v-model="form.message"
                        placeholder="确认交付备注内容，可输入300字"
                        :maxlength="300"
                    ></i-input>
                </FormItem>

                <FormItem label prop="attachment">
                    <Upload
                        ref="uploadBtn"
                        :action="action"
                        :data="uploadData"
                        :format="format"
                        :headers="headers"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :on-format-error="formatError"
                        :on-exceeded-size="onExceededSize"
                        :on-remove="remove"
                        :max-size=" 5 * 1024 "
                        :default-file-list="defaultFileList"
                    >
                        <p>上传服务已交付凭证。</p>
                        <p>上传文件支持doc/docx/jpg/png/bmp/pdf/rar/zip格式。</p>
                        <p>上传文件不能超过5M。</p>
                        <Button icon="ios-cloud-upload-outline">上传附件</Button>
                    </Upload>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="error" @click="approvalSubmit(false)">取消</Button>
                <Button type="primary" @click="approvalSubmit(true)">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const FORMAT = ["doc", "docx", "jpg", "png", "bmp", "pdf", "rar", "zip"];

@Component({
    components: {}
})
export default class extends Vue {
    appMap = {
        updateTime: "",
        createTime: "",
        tenantName: "",
        id: ""
    };
    instanceMap: object = {};
    statusCode: number = 1;
    id: string = "";
    orderId: string = "";
    tenantName: string = "";
    cloudInstanceId: string = "";

    // 审批弹框
    approvalDialog: boolean = false;

    form = {
        message: "",
        attachment: ""
    };

    action: string =
        this.$CONFIG.BASE_API_URL +
        this.$API_ENUM.COMMON_UPLOAD_FILE_BUSINESS.Format("InstanceApprove");

    uploadData: Object = {
        orderId: "",
        instanceId: ""
    };

    headers: object = {
        "citic-token": this.$getSession("citic-token")
    };

    format: Array<string> = FORMAT;

    defaultFileList: Array<FileListItem> = [];

    listData: Array<any> = [];
    columns = [
        /* {
                title: '审批ID',
                key: 'id'
            },*/
        {
            title: "订单ID",
            key: "orderId"
        },
        {
            title: "审批时间",
            key: "createTime"
        },
        {
            title: "操作人类型",
            key: "userType"
        },
        {
            title: "操作人",
            key: "confirmUserName"
        },
        {
            title: "备注",
            width: 200,
            render: (h, params) => {
                return [h("p", (params.row.message || "").HTMLDecode())];
            }
        },
        {
            title: "操作",
            align: "center",
            width: 150,
            render: (h, params) => {
                if (!params.row.attachment) {
                    return [];
                }

                return [
                    h(
                        "Button",
                        {
                            props: {
                                size: "small"
                            },
                            on: {
                                click: () => {
                                    this.downloadFile(params.row.attachment);
                                }
                            }
                        },
                        "下载附件"
                    )
                ];
            }
        }
    ];

    created() {
        const { statusCode, id, tenantName, orderId, cloudInsId } = this.$route.query;
        this.statusCode = Number(statusCode || 1);
        this.id = `${id}`;
        this.orderId = `${orderId}`;
        this.tenantName = `${tenantName}`;
        this.uploadData = {
            instanceId: this.id,
            orderId
        };
        this.cloudInstanceId = `${cloudInsId}`;

        this.getData();
        this.getApproveLog();
    }

    getData() {
        this.$get(
            this.$API_ENUM.CITIC_GENERAL_ADAPTER_GET_INSTANCE_APPROVE_DETAIL,
            {
                id: this.id,
                tenantName: this.tenantName
            }
        ).then(res => {
            if (this.$resOk(res)) {
                this.appMap = res.data.appMap;
                this.instanceMap = res.data.instanceMap;
                if (this.appMap.updateTime === this.appMap.createTime) {
                    this.appMap.updateTime = "";
                }
            } else {
                this.$Message.error(res.message);
            }
        });
    }

    /**
     * 查询实例审批日志
     */
    getApproveLog() {
        this.$get(
            this.$API_ENUM.CITIC_GENERAL_ADAPTER_GET_INSTANCE_APPROVE_LOG,
            {
                instanceId: this.id
            }
        ).then(res => {
            if (this.$resOk(res)) {
                this.listData = res.data.map(item => {
                    return {
                        ...item,
                        createTime: new Date(item.createTime).Format(
                            "yyyy-MM-dd hh:mm:ss"
                        ),
                        userType: item.userType === 1 ? "租户" : "管理员"
                    };
                });
            } else {
                this.$Message.error(res.message);
            }
        });
    }

    goback() {
        this.$router.go(-1);
    }

    /**
     * 确认交付
     */
    approval() {
        this.approvalDialog = true;
    }

    /** 取消交付 */
    async cancelApproval() {
        const res = await this.$post(
            this.$API_ENUM.CITIC_CANCEL_INSTANCE_APPROVE,
            {
                cloudInstanceId: this.cloudInstanceId,
                id: this.id,
                orderId: this.orderId
            }
        );

        if (this.$resOk(res)) {
            this.$Message.success("取消交付成功");
            this.goback();
        } else {
            this.$Message.error(res.message || "取消交付失败");
        }
    }

    /**
     * 提交审批
     */
    async approvalSubmit(submit) {
        if (submit) {
            const res = await this.$post(
                this.$API_ENUM.CITIC_GENERAL_ADAPTER_CONFIRM_INSTANCE_APPROVE,
                {
                    createTime: this.appMap.createTime,
                    instanceId: this.id,
                    orderId: this.orderId,
                    tenantName: this.appMap.tenantName,
                    message: this.form.message,
                    attachment: this.form.attachment
                }
            );

            if (this.$resOk(res)) {
                this.$Message.success("操作成功");
                this.goback();
            } else {
                this.$Message.error(res.message);
            }
        }

        this.approvalDialog = false;
    }

    /*----------文件上传相关方法---------------*/
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
            this.form.attachment = res.data.url;
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
        this.form.attachment = "";
    }
    /*----------文件上传相关方法结束---------------*/

    /**
     * 下载附件
     */
    downloadFile(url) {
        this.$downloadFileByUrl(url);
    }
}
</script>
