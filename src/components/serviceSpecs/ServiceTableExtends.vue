<style scoped lang="scss">
    .expand-row {
        margin-bottom: 16px;

        .action-btn {
            margin: 0 15px 15px 0;
        }
    }
</style>
<template>
    <div>
        <Row class="expand-row" v-for="(items,key,indexs) in data" :key="indexs">

            <Col span="4"><span class="expand-key">操作类型：{{key | actionType}}</span></Col>

            <Col span="20">
                <ButtonGroup class="action-btn" shape="circle" size="small"
                             v-for="(item, index) of items" :key="index" v-if="item.available">

                    <!--不使用 actionId 加载树，树配置在service上-->
                   <!-- <Button type="info" ghost icon="md-git-compare" @click="editRelation(item.id)">
                        关联关系
                    </Button>-->

                    <Button size="small" ghost shape="circle" type="success"
                            icon="ios-game-controller-b-outline"
                            @click="editAction(item.id)"
                    >{{item.actionName}}
                    </Button>

                    <Button type="error" ghost icon="ios-trash-outline" @click="mxDeleteItem(item.id)">
                        删除
                    </Button>
                </ButtonGroup>
            </Col>
        </Row>
    </div>
</template>
<script lang="ts">

    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({
        filters:{
            actionType(key){
                switch (key) {
                    case 'create':
                        return '创建';
                    case 'renew':
                        return '续费';
                    case 'reconfig':
                        return '变配';
                }
            }
        }
    })
    export default class extends Vue {
        @Prop() row: any;

        data: any = {};

        created(){
            this.getData()
        }

        /**
         * 跳转到action编辑页面
         */
        editAction(id: string) {
            this.$router.push({
                path: '/frame/service-specs/action/form',
                query: {
                    id: id,
                    serverId:this.row.id,
                    type: 'edit'
                },
            });
        }

        getData(){
            this.$get(`${this.$API_ENUM.CITIC_SERVICE_CONFIG_ACTION_SERVICE_ID}/${this.row.id}?available=true`).then(res=>{
                 this.data = res.data.actions
            })
        }

        /**
         * 配置关联关系
         */
        // 不使用 actionId 加载树，树配置在service上
        // editRelation(actionId: string) {
        //     this.$router.push(`/frame/service-specs/relation/form?serviceId=${this.row.id}&actionId=${actionId}`);
        // }

        /*
        * 删除
        * */
        mxDeleteItem(id: string){

            this.$Modal.confirm({
                title: '确认框',
                content: '<p>确认删除该条数据吗？</p>',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    // @ts-ignore
                    this.$del(`${this.$API_ENUM.CITIC_SERVICE_CONFIG_ACTION_DELETEID}/${id}`).then(res=>{
                        if (this.$resOk(res)) {
                            this.$Message.info('删除成功！');
                            this.getData()
                        }
                    });
                }
            })
        }
    }

</script>
