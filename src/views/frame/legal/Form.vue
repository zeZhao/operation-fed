<style scoped lang="scss">
    .btn-group{
        margin: 20px 0 0 0;

        button{
            margin-right: 10px;
        }
    }
</style>

<template>
    <Card>
        <p slot="title">
            {{serviceName}}
        </p>

        <div>
            <Upload
                    ref="uploadBtn"
                    :action="action"
                    :data="uploadData"
                    :format="format"
                    :headers="headers"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :on-format-error="formatError"
                    :before-upload="beforeUpload"
                    :on-remove="remove"
                    :default-file-list="defaultFileList"
            >
                <Button icon="ios-cloud-upload-outline">{{hasFile? '重新上传协议' : '上传服务协议'}}</Button>
            </Upload>

            <div class="btn-group">
                <Button type="info" :disabled="!hasFile" @click="preview">预览协议</Button>
                <Button type="success" :disabled="!hasFile" @click="publish">确认发布协议</Button>
                <Button type="warning" :disabled="!hasFile" @click="cancel">取消当前更新</Button>
                <Button type="error" @click="goback">返回</Button>
            </div>
        </div>

    </Card>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    const FORMAT = ['doc', 'docx'];

    @Component({})
    export default class extends Vue{

        action: string = this.$CONFIG.BASE_API_URL + this.$API_ENUM.TERMS_OF_CONDITIONS_UPLOAD_TERMS_OF_CONDITIONS;
        uploadData: object = {};
        headers: object = {
            'citic-token': this.$getSession('citic-token')
        };
        format: Array<string> = FORMAT;

        id: any = '';
        supplierServiceId: any = '';
        serviceName: any = '';
        defaultFileList: Array<FileListItem> = [];
        fileList?: FileListItem = undefined;


        created(){
          const {id, supplierServiceId, serviceName} = this.$route.query;

            this.id = id;
            this.supplierServiceId = supplierServiceId;
            this.serviceName = serviceName;

            this.uploadData = {
                supplierServiceId,
            }
        }

        beforeUpload(file){
            // 文件格式错误不能清空以上传的文件
            if(FORMAT.includes(file.name.split(".")[1])){
                this.removeFile();
                // @ts-ignore
                this.$refs.uploadBtn.clearFiles();
            }
        }

        uploadSuccess(res, file, fileList) {
            if(this.$resOk(res)){
                this.$Message.success("文件上传成功");
                this.defaultFileList = fileList;
                this.id = res.data.id;

            }else {
                this.$Message.error("文件上传失败");
                // @ts-ignore
                this.$refs.uploadBtn.clearFiles();
            }
        }

        uploadError() {
            this.$Message.error("文件上传失败");
        }

        formatError() {
            this.$Message.error("文件格式错误");
        }

        remove(file, fileList) {
            this.removeFile();
            this.defaultFileList = fileList;
        }

        cancel(){
            this.removeFile();
            // @ts-ignore
            this.$refs.uploadBtn.clearFiles();
            this.defaultFileList = [];
        }

        goback(){
            //退出前删除服务器文件
            this.removeFile();
            this.$router.go(-1);
        }

        /**
         * 删除已经上传的文件
         */
        removeFile(){
            this.$del(this.$API_ENUM.TERMS_OF_CONDITIONS + '?supplierServiceId=' + this.supplierServiceId)
        }

        preview(){
            window.open(`#/legal-preview?id=${this.id}&serviceName=${this.serviceName}`);
        }

       async publish(){

           this.$Modal.confirm({
               title: '提示',
               content: '确认发布协议？',
               okText: '确认',
               cancelText: '取消',
               onOk: async () => {

                   const res = await this.$put(`${this.$API_ENUM.TERMS_OF_CONDITIONS_RELEASE}?id=${this.id}`);
                   if(this.$resOk(res)){
                       this.$Message.success("发布成功");
                       this.$router.go(-1);
                   }else{
                       this.$Message.error("发布失败");
                   }

               },
           });

        }

        get hasFile(){
          return  this.defaultFileList.length === 1;
        }
    }
</script>
