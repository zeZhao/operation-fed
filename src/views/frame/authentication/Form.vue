<style scoped lang="scss">
    .authentication-detail {
        /deep/ .ivu-card-head p {
            line-height: 100%;
            height: auto;
            text-align: right;

            .status {
                float: left;
                line-height: 32px;
            }
        }

        .btn-group {
            padding: 30px 0;
            display: flex;
            flex-direction: row;
            justify-content: center;

            .ivu-btn {
                width: 200px;
                margin-right: 20px;
            }
        }

        .step-box {
            margin: 50px auto 80px auto;
            width: 600px;
        }

        .action-log {
            margin-bottom: 50px;
        }
    }
</style>

<style lang="scss">
    .authentication-refuse-checkbox-group {
         .ivu-checkbox-input[disabled] {
            cursor: pointer;
        }

         .ivu-checkbox-wrapper-disabled {
            cursor: pointer;
        }

         .ivu-checkbox-disabled.ivu-checkbox-checked {
            .ivu-checkbox-inner {
                border-color: #2d8cf0;
                background-color: #2d8cf0;

                &::after {
                    border-color: #fff;
                }
            }
        }
    }
</style>

<template>
    <Card class="authentication-detail">
        <p slot="title">
            <span class="status">当前审批状态：{{authStatusDisplay}}</span>

            <Button type="error" @click="goback">返回上一页</Button>
        </p>

        <div>

            <div class="step-box">
                <Steps :current="currentStep">
                    <Step v-for="(item, index) in auditFlows" :title="item" :key="index"></Step>
                </Steps>
            </div>

            <Table class="action-log" :columns="columns" :data="auditLogs"></Table>

            <h3>租户信息</h3>
            <ci-auth-detail v-if="applyUserVO.length" :param="applyUserVO"></ci-auth-detail>

            <h3>认证信息</h3>
            <ci-auth-detail v-if="detailParamVOList.length" :param="detailParamVOList"></ci-auth-detail>

            <div class="btn-group" v-show="showBtn">
                <Button type="success" @click="approval(true)">通过</Button>
                <Button type="error" @click="approval(false)">驳回</Button>
            </div>
        </div>

        <!--拒绝弹出框-->
        <Modal v-model="showRefuseModal"
               title="提示"
               @on-ok="refuse">
            <p style="font-size: 14px; padding-bottom: 10px;">发送审核失败原因</p>

            <CheckboxGroup class="authentication-refuse-checkbox-group" v-model="auditRefuseNode"
                           @on-change="auditRefuseNodeChange">
                <Checkbox label="website_scan_fail" :disabled="auditRefuseNode.includes('website_scan_fail')" v-if="authType == 'website'">
                    第三方漏洞扫描报告不通过
                </Checkbox>
                <Checkbox label="scan_fail" :disabled="auditRefuseNode.includes('scan_fail')" v-if="authType !== 'website'">
                    合规报告通过，第三方漏洞扫描报告不通过
                </Checkbox>
                <br>
                <Checkbox label="security_fail" :disabled="auditRefuseNode.includes('security_fail')" v-if="authType !== 'website'">
                    合规报告不通过，第三方漏洞扫描报告通过
                </Checkbox>
                <br>
                <Checkbox label="all_fail" :disabled="auditRefuseNode.includes('all_fail')" v-if="authType !== 'website'"> 合规报告、第三方漏洞扫描报告均不通过
                </Checkbox>
            </CheckboxGroup>
            <br>

            <Input v-model="refuseText" type="textarea" :rows="10" placeholder="不通过意见，最多可输入300字" :maxlength="300"/>
        </Modal>
    </Card>
</template>

<script lang="ts">
    import AuthDetail from '../../../components/authentication/AuthDetail.vue';

    import {Component, Vue} from "vue-property-decorator";
    import {ParamItem} from "../../../interface/authentication";


    @Component({
        components: {
            'ci-auth-detail': AuthDetail,
        }
    })
    export default class extends Vue {
        id: any = '';
        detailParamVOList: Array<ParamItem> = [];

        showRefuseModal: boolean = false;
        auditRefuseNode: Array<string> = ['scan_fail'];
        refuseText: string = '';

        authStatusDisplay?: string = '';
        authStatus?: string = '';
        authType?: string = '';
        applyUserVO: Array<ParamItem> = [];
        currentStep: number = 0;
        auditFlows: Array<string> = [];

        columns = [
            {
                title: '状态',
                key: 'statusDisplay'
            },
            {
                title: '审批时间',
                key: 'operateTimeStr'
            },
            {
                title: '操作',
                align: 'center',
                width: 160,
                render: (h, params) => {

                    if (params.row.auditNote || params.row.auditRefuseNodeDisplay) {
                        return [h('Button', {
                            props: {
                                size: 'small',
                            },

                            on: {
                                click: () => {
                                    this.$Modal.info({
                                        title: '审批意见',
                                        content: `<p>不通过项：${params.row.auditRefuseNodeDisplay || ''}</p>
                                                  <p>审批意见：${params.row.auditNote}</p>`,
                                    });
                                }
                            }
                        }, '查看审批意见')];
                    } else {
                        return [h('span', {}, '--')];
                    }
                }
            }
        ];

        auditLogs = [];

        created() {
            const {id} = this.$route.query;
            this.id = id;

            this.initData();
        }


        async initData() {
            const res = await this.$get(this.$API_ENUM.CITIC_AUTH_GET_AUTH_INSTANCE_DETAIL, {authInstanceId: this.id});

            if (this.$resOk(res)) {
                const data = res.data;

                const {
                    authStatusDisplay,
                    authStatus,
                    authType,
                    auditFlows,
                    auditLogs,
                    applyUserVO,
                    detailParamVOList,
                } = data;

                // 审批状态展示
                this.authStatusDisplay = authStatusDisplay;
                this.authStatus = authStatus;
                this.authType = authType;

                // 计算运行步骤
                let step = -1;
                this.auditFlows = auditFlows.map((item, index) => {
                    step += item.status;

                    // 如果最后一条状态是完成，则多加1，将最后一个状态设置为完成
                    if (index === auditFlows.length - 1 && item.status) {
                        step++;
                    }

                    return item.type
                });

                this.currentStep = step;

                // 操作记录展示
                this.auditLogs = auditLogs;

                // 租户信息展示
                const {email, fullname, mobile} = applyUserVO;

                this.applyUserVO = [{
                    key: 'mobile',
                    value: mobile,
                    keyDisplay: '已验证手机号',
                    valueDisplay: mobile,
                    valueType: 'normal'
                }, {
                    key: 'email',
                    value: email,
                    keyDisplay: '已验证邮箱',
                    valueDisplay: email,
                    valueType: 'normal'
                }, {
                    key: 'fullname',
                    value: fullname,
                    keyDisplay: '用户名',
                    valueDisplay: fullname,
                    valueType: 'normal'
                }];

                // 认证信息展示
                this.detailParamVOList = detailParamVOList.filter((item: ParamItem) => item.valueType !== "noshow");

                //失败原因设置默认项
                if(authType === 'website'){
                    this.$nextTick(()=>{
                        this.auditRefuseNode = ['website_scan_fail']
                    })

                }
            }
        }

        goback() {
            this.$router.go(-1);
        }

        /**
         * 切换失败类型
         */
        auditRefuseNodeChange(value) {
            this.auditRefuseNode = [value[value.length - 1]];
        }

        /**
         * 通过、驳回认证
         */
        approval(pass) {

            if (pass) {

                this.$Modal.confirm({
                    title: '提示',
                    content: '确认通过该提交审核吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.pass(true);
                    },
                });

            } else {
                this.showRefuseModal = true;
                this.refuseText = '';
            }
        }

        /**
         * 发送通过请求
         */
        async pass(isPass) {
            const res = await this.$post(this.$API_ENUM.CITIC_AUTH_SECURITY_AUTH_APPROVAL, {
                authInstanceId: this.id,
                auditStatus: isPass ? 'audit_pass' : 'audit_refuse',
                auditType: 'security',
                auditNote: this.refuseText,
                auditRefuseNode: isPass ? '' : this.auditRefuseNode[0],
            });

            if (!isPass) {
                this.refuseText = '';
                this.showRefuseModal = false;
            }

            if (this.$resOk(res)) {
                this.$Message.success('操作成功');
                this.$router.back();
            } else {
                this.$Message.error(res.message)
            }
        }

        /**
         * 发送拒绝请求
         */
        refuse() {
            this.pass(false)
        }

        get showBtn() {
            return this.authStatus === 'wait_security_auth';
        }
    }
</script>
