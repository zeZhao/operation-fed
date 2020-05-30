<style scoped lang="scss">
    .header {
        min-height: 80px;
        background: #000000;
        min-width: 1200px;
        padding: 0 50px;
        display: flex;
        flex-direction: row;

        .title {
            line-height: 80px;
            color: #fff;
            font-size: 20px;
        }

        .action-panel {
            flex-grow: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .user-icon {
                color: #fff;
                font-size: 14px;
                margin-right: 10px;
            }

            .user {
                color: #fff;
                font-size: 16px;
                margin-right: 80px;
            }
        }
    }
</style>

<template>
    <div class="header">
        <span class="title">中信云运营管理平台</span>

        <div class="action-panel">

            <Icon type="md-person" class="user-icon"/>
            <label class="user">
                {{user.userName}}
            </label>

            <Button type="error" @click="logout">登出</Button>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    interface User {
        userName?: string;
    }

    @Component
    export default class extends Vue {

        user: User = {
            userName: '',
        };

        created() {
            const {realName, userName} = this.$getSession('citic-user');
            this.user.userName = realName || userName;
        }

        logout() {
            this.$post(this.$API_ENUM.REGISTER_LOGOUT);
            sessionStorage.clear();
            localStorage.clear();
            this.$router.push('/login');
        }
    }
</script>


