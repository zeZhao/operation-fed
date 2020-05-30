<style lang="scss" scoped>
    .login-page {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        background: url("../assets/images/login/background.jpg") center no-repeat;
        background-size: cover;

        .login-form {
            width: 400px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.7);
            padding: 20px;

            .form-header {
                text-align: center;
                margin: 20px 0 40px 0;
                font-size: 25px;
            }

            .form-body {
                /deep/ .ivu-input-wrapper .ivu-input {
                    border-radius: 0;
                    border: none;
                    height: 40px;
                    padding-left: 20px;
                    padding-right: 20px;

                    &:focus {
                        box-shadow: none;
                    }
                }

                .form-item {
                    border-bottom: 1px solid rgba(255, 255, 255, 0);
                    position: relative;

                    &.last {
                        border: none;
                        padding-right: 80px;
                        background: #fff;
                    }

                    .verify-code {
                        width: 80px;
                        height: 40px;
                        position: absolute;
                        right: 10px;
                        top: 0;
                    }
                }

                .login-btn {
                    margin: 30px 0 20px 0;
                    background-color: #f1705d;
                    border-color: #f1705d;
                    color: #fff;

                    &:focus {
                        box-shadow: 0 0 0 2px rgba(241, 112, 93, 0.2);
                    }

                    &:hover {
                        background-color: #ff735f;
                        border-color: #ff7562;
                    }

                    &[disabled] {
                        color: #ffffff;
                        background-color: #c7c7c7;
                        border-color: #dcdee2;
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="login-page">

        <div class="login-form">
            <h1 class="form-header">运营系统用户登录</h1>

            <Form class="form-body" :model="form" @keydown.native.enter.prevent="submit">
                <div class="form-item">
                    <Input type="text" size="large" clearable placeholder="请输入手机号/邮箱/用户名" v-model="form.username"/>
                </div>

                <div class="form-item">
                    <Input type="password" size="large" clearable placeholder="请输入密码" v-model="form.password"/>

                </div>

                <div class="form-item last">
                    <Input class="code" type="text" size="large" clearable placeholder="请输入验证码" :maxlength="4"
                           v-model="form.authCode"/>
                    <img class="verify-code" :src="verifyCodeImage" @click="changeVerifyCode">
                </div>

                <Button class="login-btn" size="large" long @click="submit" :disabled="!canSubmit" :loading="inRequest">
                    登录
                </Button>
            </Form>
        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';

    interface LoginForm {
        username: string;
        password: string;
        verifyCodeKey: string;
        authCode: string;
    }

    @Component({
        components: {},
    })
    export default class extends Vue {

        form: LoginForm = {
            username: '',
            password: '',
            verifyCodeKey: '',
            authCode: '',
        };

        inRequest: boolean = false;

        created() {
            this.changeVerifyCode();
        }

        /**
         * 改变验证码
         */
        changeVerifyCode() {
            this.form.verifyCodeKey = `${new Date().getTime()}`;
        }

        async submit() {
            if (!this.canSubmit) {
                return;
            }

            const res = await this.$post(this.$API_ENUM.CITIC_DO_LOGIN, {
                ...this.form,
                password: this.$md5.hex_md5(this.form.password),
            });

            if (!this.$resOk(res)) {
                this.changeVerifyCode();
                this.$Message.error(res.message);
                this.form.authCode = '';
            } else {
                this.$Message.success(res.message);
                //将token保存到本地
                this.$setSession('citic-token', res.data.token);
                this.$setSession('citic-user', res.data);
                //跳转到根目录，匹配路由中设置的默认地址
                this.$router.replace('/');
            }
        }

        /**
         * 生成验证码地址
         */
        get verifyCodeImage() {
            return this.$CONFIG.BASE_API_URL + this.$API_ENUM.CITIC_PIC_VERIFICATION_CODE + '?verifyCodeKey=' + this.form.verifyCodeKey
        }

        /**
         * 判断是否满足提交表单条件
         */
        get canSubmit() {
            const {username, password, authCode} = this.form;
            return username && password && authCode.length === 4;
        }
    }
</script>