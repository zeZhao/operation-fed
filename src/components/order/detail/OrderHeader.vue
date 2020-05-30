<style scoped lang="scss">
    .content-header {
        background: #fff;
        margin-bottom: 20px;
        box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.31);

        .main-panel {
            background: #ebf8ff;
            border-left: 3px solid #528cf0;
            padding: 20px 20px 20px 15px;

            .title {
                font-size: 16px;
                color: #1a1a1a;
                font-weight: bold;

                .sub-title {
                    color: #888888;
                    font-size: 12px;
                    font-weight: normal;
                    margin-left: 20px;
                }
            }

            .right-group {
                float: right;
                cursor: pointer;

                .back-text {
                    vertical-align: middle;
                    display: inline-block;
                    color: #888888;
                    background: #fff;
                }

                .icon-go-back {
                    height: 10px;
                    width: 10px;
                    margin-left: 10px;
                    position: relative;
                }
            }
        }
    }
</style>

<template>
    <div class="content-header">
        <div class="main-panel">
            <span class="title">
               <span> {{title}}</span> <span class="sub-title">{{subTitle}}</span>
            </span>

            <p class="right-group" @click="$router.go(-1)" v-if="hasBack">
                <Button type="ghost" class="back-text" size="small">
                    返回
                    <span class="icon-go-back"></span>
                </Button>

            </p>
        </div>
        <div class="subhead-panel">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component({
        components: {

        },
        name: "order-header"
    })
    export default class extends Vue {
        @Prop() title!: string;
        @Prop() subTitle!: string;
        @Prop() hasBack!: boolean;
    }
</script>
