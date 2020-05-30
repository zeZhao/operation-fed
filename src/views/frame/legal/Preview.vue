<style scoped lang="scss">
    .preview-page {
        padding: 20px;

        /deep/ pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    }
</style>

<template>
    <div class="preview-page">
        <Card>
            <p slot="title">{{serviceName}}</p>

            <pre>{{text}}</pre>
        </Card>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";


    @Component({})
    export default class extends Vue {

        serviceName: any = '';
        text: string = "";

        created() {
            this.getContent();
        }

        async getContent() {

            this.serviceName = this.$route.query.serviceName;

            const res = await this.$get(this.$API_ENUM.TERMS_OF_CONDITIONS_CONTENT, {
                id: this.$route.query.id,
            });

            if (this.$resOk(res)) {
                this.text = res.data.replace(/\r/g, '\n\r');
            } else {
                this.$Message.error(res.message || '详情查询失败');
            }

        }
    }
</script>
