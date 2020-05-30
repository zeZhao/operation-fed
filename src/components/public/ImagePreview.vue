<style scoped lang="scss">
    .image-preview {
        transform: rotate3d(0, 0, 0);
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.71);

        .close-btn {
            position: absolute;
            right: 20px;
            top: 20px;
            font-size: 40px;
            color: #EDEDED;
            cursor: pointer;
        }

        .preview-content {

            &.block {
                display: block;
                padding: 30px 0;
            }

            height: 100%;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .left-btn, .right-btn {
                position: fixed;
                top: 50%;
                font-size: 50px;
                color: #EDEDED;
                cursor: pointer;
                transition: .3s;

                &.disabled {
                    color: rgba(237, 237, 237, 0.21);
                    cursor: not-allowed;
                }
            }

            .left-btn {
                left: 20px;

            }

            .right-btn {
                right: 20px;
            }

            .preview-image {
                max-width: 70%;
                max-height: 400px;
                margin: 0 auto;
                display: block;
                user-select: none;
            }

            .indicator{
                margin-top: 20px;
                text-align: center;
                font-size: 20px;
            }
        }
    }
</style>

<template>
    <div class="image-preview" v-show="previewShow">
        <Icon type="md-close" class="close-btn" @click="close"/>

        <div class="preview-content" ref="previewContent" :class="{block: contentDisplayBlock}">
            <Icon type="ios-arrow-dropleft-circle" class="left-btn" :class="{disabled: leftDisabled}"
                  @click="next(-1)"/>

            <img class="preview-image" :src="currentImg" ref="previewImage">

            <p class="indicator"><span>{{imageIndex+1}}</span>/<span>{{images.length}}</span></p>

            <Icon type="ios-arrow-dropright-circle" class="right-btn" :class="{disabled: rightDisabled}"
                  @click="next(1)"/>
        </div>
    </div>
</template>
<script lang="ts">

    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        @Prop({default: false}) value ?: false;
        @Prop({default: []}) images ?: Array<string>;
        @Prop({default: -1}) index ?: number;

        previewShow: boolean = false;

        imageIndex: number = 0;

        contentHeight: number = window.innerHeight;
        contentDisplayBlock: boolean = false;

        close() {
            this.previewShow = false;
            this.$emit("on-close",this.imageIndex);
            this.$emit("input", false);
        }

        next(step) {

            if (this.images === undefined || this.imageIndex === undefined) {
                return;
            }

            const MAX = this.images.length - 1;
            const MIN = 0;

            let nextStep = this.imageIndex + step;

            if (nextStep < MIN) {
                nextStep = MIN;
            } else if (nextStep > MAX) {
                nextStep = MAX
            }

            this.imageIndex = nextStep;
        }

        setFrame() {
            const image = this.$refs.previewImage;

            if (image) {
                this.contentDisplayBlock = (image as any).height + 60 >= this.contentHeight;
            }
        }

        @Watch('index')
        indexChange(index) {
            this.imageIndex = index;
        }

        @Watch('value')
        showChange(val) {
            this.previewShow = val;
        }

        get currentImg() {
            if (this.images && this.imageIndex !== undefined && this.imageIndex < this.images.length) {

                this.$nextTick(() => {
                    this.setFrame();
                });

                return this.images[this.imageIndex];
            }
        }

        get leftDisabled() {
            return this.imageIndex === 0;
        }

        get rightDisabled() {

            if (this.images !== undefined && this.imageIndex !== undefined) {
                return this.imageIndex === this.images.length - 1;
            }

            return true;
        }
    }
</script>
