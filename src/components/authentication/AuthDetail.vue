<style scoped lang="scss">
    .param-form{

        .param-value{
            max-width: 520px;
            margin-left: 20px;
            word-break: break-all;
        }

        .image-group{
            margin-left: 20px;

            img{
                max-width: 200px;
                cursor: pointer;
            }
        }

        .download-link{
            margin-left: 20px;
            cursor: pointer;
            color: #2d8cf0;
            text-decoration: underline #2d8cf0;
        }
    }
</style>

<template>
    <Form :label-width="240" class="param-form">

        <FormItem v-for="(item, index) in form" :label="`${item.keyDisplay}:`" :key="index">

            <!--文字内容-->
            <p class="param-value" v-if="item.valueType === 'normal'">{{item.valueDisplay}}</p>

            <!--图片内容-->
            <div class="image-group" v-if="item.valueType === 'img'">
                <img v-for="(image, index) in [item.valueDisplay]" :src="image" :key="index" title="查看图片"
                     @click="openPreviewImage([item.valueDisplay], index)">
            </div>

            <!--下载链接-->
            <ul class="download-link" v-if="item.valueType === 'file'">
                <li v-for="(items,i) in item.value" :key="i" @click="download(items)">下载{{item.keyDisplay}}-{{i}}</li>
            </ul>
            <!--<span class="download-link" v-if="item.valueType === 'file'" @click="download(item.valueDisplay)">下载{{item.keyDisplay}}</span>-->

        </FormItem>

        <ci-image-preview v-model="previewOpen" :images="previewImages" :index="previewIndex"></ci-image-preview>
    </Form>
</template>
<script lang="ts">

    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {ParamItem} from "../../interface/authentication";

    @Component({})
    export default class extends Vue {
        @Prop({default: []}) param ?: Array<ParamItem>;

        form?: Array<ParamItem> = this.param;

        previewOpen: boolean = false;
        previewImages: Array<string> = [];
        previewIndex: number = 0;


        openPreviewImage(images: Array<string>, index: number){
            this.previewImages = images;
            this.previewIndex = index;
            this.previewOpen = true;
        }

        download(url){
            this.$downloadFileByUrl(url)
        }

        @Watch('param', {immediate: true})
        setData(val: Array<ParamItem>) {
            if(val){
                val.forEach(item=>{
                    if(item.valueType === 'file'){
                        if(item.valueDisplay && typeof item.valueDisplay === 'string'){
                            item.value = item.valueDisplay.split(',')
                        }
                    }
                })
            }

            this.form = val;
        }
    }
</script>
