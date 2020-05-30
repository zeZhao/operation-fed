<style lang="scss" scoped>
.expand{
    .expand-row{
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #f2f2f2;
        .expand-key{
            display: inline-block;
        }
        .expand-value{
            padding-left: 20px;
            color: #9e9e9e;
        }
    }
}
</style>

<template>
    <div class="expand">

        <Row class="expand-row" v-for="(item, key, index) in data" :key="index">
            <Col span="24">
                <span class="expand-key">{{ key }}：</span>
                <span class="expand-value">{{ item }}</span>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        @Prop() row: any;

        data: object = {}

        @Watch('row', { immediate: true, deep: true })
        getData(newVal: object){
            this.$get(this.$API_ENUM.SRVMGT_GET_INSTANCE_NEW_DETAIL,newVal).then(res=>{
                this.data = res.data.instanceDetail
            })
        }

    }
</script>