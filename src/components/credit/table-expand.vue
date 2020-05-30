<style lang="scss" scoped>
    .expand-row {
        margin-bottom: 16px;

        .expand-key {
            width: 90px;
            text-align: right;
            display: inline-block;
        }

        .expand-value {
            padding-left: 15px;
        }
    }
</style>

<template>
    <div>
        <Row class="expand-row">
            <Col span="20">
                <span class="expand-key">是否临时调额：</span>
                <span class="expand-value">{{ datas.temporaryAdjustFlag }}</span>
            </Col>
        </Row>
        <Row class="expand-row" v-if="row.temporaryAdjustFlag">
            <Col span="20">
                <span class="expand-key">调额有效期：</span>
                <span class="expand-value">{{ datas.effectiveStartDate }} 至 {{datas.effectiveEndDate}}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="20">
                <span class="expand-key">申请原因：</span>
                <span class="expand-value">{{ datas.reasons }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="20" v-if="datas.attachmentUrl">
                <span class="expand-key">附件：</span>
                <a class="expand-value" v-for="(item,index) in datas.attachmentUrl" :key="index"
                   @click="download(item)">{{ `上传文件${index} `}}</a>
            </Col>
            <Col span="20" v-else>
                <span class="expand-key">附件：</span>
                <span class="expand-value">-</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="20">
                <span class="expand-key">审批人：</span>
                <span class="expand-value">{{ datas.approveUserName }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="20">
                <span class="expand-key">审批时间：</span>
                <span class="expand-value">{{ datas.approveDate }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="20">
                <span class="expand-key">备注：</span>
                <span class="expand-value">{{ datas.approveMemo }}</span>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends Vue {

        @Prop({
            default: () => {
            }
        }) row

        datas: object = {}

        created() {
        }

        /*
        * 下载文件
        * */
        download(url) {
            this.$downloadFileByUrl(url)
        };

        @Watch('row', {immediate: true, deep: true})
        onPersonChanged(val: any) {
            let obj = Object.assign({}, val)

            Object.keys(obj).forEach(item => {
                if (item === 'temporaryAdjustFlag') {
                    obj[item] = obj[item] ? '是' : '否'
                }else if(item === 'attachmentUrl') {
                    obj[item] = obj[item] ? obj[item].split(',') : ''
                    console.log(obj['attachmentUrl'])
                    // if(obj['attachmentUrl']){
                    //     obj['attachmentUrl'] = item.split(',')
                    // }else{
                    //     obj['attachmentUrl'] = '-'
                    // }

                }else if (!obj[item]) {
                    obj[item] = '-'
                }
            })

            this.datas = obj
        }
    }
</script>