<style lang="scss" scoped>
    .marginL {
        margin-left: 10px;
    }
</style>

<template>
    <div>
        <Card title="数据刷新">
            <Button @click="fresh('1')">初始化服务</Button>
            <Button @click="fresh('2')" class="marginL">初始化用户信息</Button>
            <Button @click="fresh('3')" class="marginL">初始化租户信息</Button>
        </Card>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends Vue {



        created() {

        }

        submitApi: string = this.$API_ENUM.FRESH

        fresh(type:string = "1"){
            this.$get(this.submitApi,{type:type}).then((res:any)=>{
                this.$Message.success(res.msg)
            }).catch(err=>{
                this.$Message.error('操作失败')
            })
        }
    }
</script>