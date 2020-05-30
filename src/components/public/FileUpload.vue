<style lang="scss" scoped>
    .fileUpload {
        .tip {
            width: 315px;
            line-height: 15px;
            float: left;
            /*margin-left: 15px;*/
            margin-top: 20px;
            color: #9d9d9d;
        }

        .uploadingStyle {
            width: 150px;
            border-radius: 15px;
            margin-top: 30px;
            background-color: #57a3f3;
            border-color: #57a3f3;
        }

        .fileStyle {
            max-width: 95%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            float: left;
        }

        .square-icon {
            width: 5%;
            text-align: center;
            display: inline-block;
            cursor: pointer;
        }
    }
</style>

<template>
    <div class="fileUpload">
        <div style="width: 220px">
            <div v-for="(item,index) in uploadList" :key="index">
                <template v-if="item.status === 'finished'">
                    <a href="javascript:void(0)" class="fileStyle" @click="download(item.url)">{{item.name}}</a>
                    <div class="square-icon">
                        <Icon type="ios-trash-outline" size="20" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
                <template v-else>
                    <Progress style="max-width: 95%" v-if="item.showProgress" :percent="item.percentage"
                              :stroke-width="5" hide-info></Progress>
                </template>
            </div>
        </div>
        <Upload v-show="uploadList.length < fileMaxLen"
                multiple
                ref="upload"
                style="width: 220px;float: left"
                type="drag"
                name="file"
                :show-upload-list="false"
                :default-file-list="defaultFileList"
                :format=format
                :max-size="size"
                :on-success="handleSuccess"
                :on-progress="handleProgress"
                :on-remove="handleRemove"
                :on-error="handleError"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="detailBeforeUpload"
                :headers="headers"
                :action=uploadUrl>
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或拖拽将文件拖拽到这里上传</p>
            </div>
        </Upload>
        <div class="tip" v-show="uploadList.length < fileMaxLen">
            <p>{{tipText}}</p>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends Vue {

        @Prop({type: Array, required: true, default: () => {}}) files;
        // 文件数量
        @Prop({type: Number, default: 1}) fileMaxLen;
        // 文件类型
        @Prop({
            type: Array,
            default: () => {return ['doc', 'docx', 'png', 'jpg', 'bmp', 'pdf', 'rar', 'zip']}
        }) format;
        // 文件规则
        @Prop(
            {
                type: String,
                default: '上传文件支持doc/docx/jpg/png/bmp/pdf/rar/zip格式，上传最小尺寸不低于80px*80px。上传文件不能超过5M。文件最多不能超过3份。'
            }) tipText;
        // 文件宽高
        @Prop({type: Number,default:80}) width
        @Prop({type: Number,default:80}) height
        // 文件大小  1M = 1024KB
        @Prop({type: Number,default:5120}) size

        uploadList: Array<any> = [];
        defaultFileList: Array<any> = this.files;
        uploadUrl: string = this.$CONFIG.BASE_API_URL + this.$API_ENUM.COMMON_UPLOAD_CREDIT_LINES_ADJUST;
        headers: object = {
            'citic-token': this.$getSession('citic-token')
        };

        created() {
        }

        /*
        * 添加文件
        */
        handleSuccess(res, file) {
            const {data: {fileUrl}} = res

            file.url = fileUrl;
            this.$emit('addFile', file);
        };

        handleProgress(event, file, fileList){
            this.uploadList = fileList
        }
        handleError(error, file, fileList){
            this.$Message.error("上传失败")
        }

        /*
        * 文件删除
        */
        handleRemove(file) {
            const {response: {data: {ossKey}}, uid} = file

            const fileList = (this.$refs.upload as any).fileList
            fileList.splice(fileList.indexOf(file), 1)
            this.$emit('removeFile', {uid: uid})
            this.uploadList = fileList

            this.$del(`${this.$API_ENUM.COMMON_DELETE_FILE}?ossKey=${ossKey}`)
        };

        /*
        * 判断文件类型
        */
        handleFormatError() {
            this.$Notice.warning({
                title: '文件格式有误。'
            })
        };

        /*
        * 判断文件大小
        */
        handleMaxSize() {
            this.$Notice.warning({
                title: `文件大小不能超过${Math.round(this.size/1024)}M。`
            })
        };

        /*
        * 下载文件
        * */
        download(url) {
            this.$downloadFileByUrl(url)
        };
        /*
        * 判断文件宽高
        * */
        detailBeforeUpload(file) {
            const type = file.type.split('/')[0]
            if(type === 'image'){
                return this.checkImageWH(file, 80, 80);
            }else{
                return true
            }
        }

        checkImageWH(file, width, height) {
            let self = this;
            return new Promise(function (resolve, reject) {
                let filereader = new FileReader();
                filereader.onload = (e:any) => {
                    let src = e.target.result;
                    const image = new Image();
                    image.onload = function () {
                        let that:any = this
                        if (that.width < width  &&  that.height < height) {
                            self.$Notice.error({
                                title: `最小尺寸不低于${width}px*${height}px`,
                            });
                            reject();
                        } else {
                            resolve();
                        }
                    };
                    image.onerror = reject;
                    image.src = src;
                };
                filereader.readAsDataURL(file);
            });
        }

        @Watch('files', {immediate: true, deep: true})
        monitorFiles(val) {
            this.$nextTick(() => {
                this.defaultFileList = val
                // @ts-ignore
                if (!this.$refs.upload.fileList.length) {
                    this.$nextTick(()=>{
                        this.uploadList = this.defaultFileList
                    })
                } else {
                    this.$nextTick(() => {
                        // @ts-ignore
                        this.uploadList = this.$refs.upload.fileList
                    })
                }
            })

        }
    }
</script>