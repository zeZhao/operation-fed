<style scoped lang="scss">
    .relation-form {
        height: 100%;

        .ivu-card {
            height: 100%;

            /deep/ .ivu-card-body {
                display: flex;
                height: calc(100% - 50px);
                padding-right: 0;
            }
        }
    }
</style>

<template>
    <div class="relation-form">
        <Card>
            <p slot="title">
                配置关联关系
            </p>

            <ci-select-tree :serviceId="serviceId" :actionId="actionId"></ci-select-tree>

        </Card>
    </div>
</template>

<script lang="ts">
    import {FormMixin} from '../../../mixin/index';
    // @ts-ignore
    import SelectTree from '../../../components/serviceSpecs/relation/SelectTree.vue';

    import {Component} from "vue-property-decorator";

    @Component({
        components: {
            'ci-select-tree': SelectTree,
        }
    })
    export default class extends FormMixin {
        form: any = {};

        serviceId: string = '';
        actionId: string = '';

        created() {
            const {serviceId, actionId} = this.$route.query;
            this.serviceId = `${serviceId}`;
            this.actionId = `${actionId}`;
        }
    }
</script>
