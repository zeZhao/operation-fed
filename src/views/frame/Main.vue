<style lang="scss" scoped>
    .frame-root {
        height: 100%;
        min-width: 1200px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .frame-header {
            height: 80px;
        }

        .frame-body {
            display: flex;
            flex-grow: 1;
            flex-direction: row;
            overflow: hidden;

            .router {
                width: calc(100% - 200px);
                padding: 20px;
                overflow-y: auto;
            }
        }
    }
</style>

<template>

    <div class="frame-root">

        <c-header class="frame-header"></c-header>

        <div class="frame-body">
            <c-menu></c-menu>

            <div class="router">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import Header from '../../components/Header.vue';
    import Menu from '../../components/Menu.vue';

    @Component({
        components: {
            'c-header': Header,
            'c-menu': Menu,
        },
    })
    export default class extends Vue {
        created() {

        }
    }

</script>