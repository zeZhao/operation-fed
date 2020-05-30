<style scoped lang="scss">
    .label {
        font-size: 15px;
    }

    .cost {
        font-size: 14px;
        color: red;
        display: block;
        margin: 10px 0;
        overflow: hidden;

        .cost-item {
            float: left;
            clear: both;
        }

        .cost-price-group {
            float: left;
            display: inline-block;
            width: 60%;

            .cost-price-item {
                padding: 0 10px;
                display: inline-block;
            }
        }
    }

    .btn-group {
        position: absolute;
        right: 40px;
        top: 80px;

        .ivu-btn {
            height: 40px;
            width: 140px;
            font-size: 15px;
            font-weight: bold;
            margin: 0 10px;
        }
    }
</style>

<template>
    <div>
        <p class="label">配置费用：</p>

        <div class="cost" v-for="(costItem, index) in priceList" :key="index">
            <span class="cost-item">{{costItem}}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component({
        components: {

        },
        name: "configuration-cost"
    })
    export default class extends Vue {
        @Prop() priceList!: Array<string>
    }
</script>
