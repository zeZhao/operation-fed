<style scoped lang="scss">
    /*.keySelect{*/
    /*    .ivu-table-wrapper{*/
    /*        width: 90%;*/
    /*        margin: 0 auto;*/
    /*    }*/
    /*}*/
    .set-default-select{
        display: inline-block;
        margin-left: 5px;
        width: 300px
    }
    .set-default-icon{
        font-size: 24px;
        cursor: pointer;

    }
    .set-default-icon-open-select{
        animation:open-select 0.5s forwards;
        
    }
    @keyframes open-select {
        from {
           transform: rotate(0deg)
        }
        to {
            transform: rotate(45deg)
        }
    }
     .set-default-icon-close-select{
         animation:close-select 0.5s forwards;
    }

    @keyframes close-select {
        from {
           transform: rotate(45deg)
        }
        to {
            transform: rotate(0deg)
        }
    }

</style>
<template>
    <div class="keySelect">
        <Table :columns="columns" :data="listData" :loading="loading" @on-select="mxSelectOne"
               @on-selection-change="selectKeyChange($event,listData)">

               <template slot-scope = "{ row, index }" slot="defaultValueId" v-if="actionId !== undefined">
                   <Icon type="md-add" class="set-default-icon" 
                   :class="row._showSelect?'set-default-icon-open-select':'set-default-icon-close-select'" 
                   @click="defaultIconClick(row, index)"/>
                   <span v-show="!row._showSelect">{{row.defaultValueId}}</span>
                   <Select v-model="row.defaultValueId" class="set-default-select" v-show="row._showSelect" @on-change="selectChange($event, index, 'defaultValueId')">
                     <Option :value="item.id" :key="i2" v-for="(item, i2) in keyValueList[index]">{{item.displayName}}</Option>
                   </Select>

                </template>
              
        </Table>
    </div>
</template>
<script lang="ts">

    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {ListMixin} from "@/mixin";

    @Component({})
    export default class extends ListMixin {
        @Prop() serviceId: any;
        @Prop() actionId: any;
        @Prop() formDisabled: boolean | undefined;
        @Prop({default: () => []}) value: any;

        // 不开启列表查询条件缓存
        useRecord = false;
        pageSize: number = 999;
        searchAPI: string = `${this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONS_KEY_SERVICE_ID}/${this.serviceId}?available=1`;
        keyValueList: any[] = [];//缓存页面code values集合的集合

        columns = [
            {
                type: 'selection',
                width: 60,
                align: 'center',
            },
            {
                title: 'code',
                key: 'code'
            },
            {
                title: '名称',
                key: 'displayName'
            },
            {
                title: '备注',
                key: 'remark'
            },
             {
                title: '默认值',
                key: 'defaultValueId',
                width:500,
                slot: 'defaultValueId'
            },
            {
                title: '前端交互模式',
                render: (h, params) => {
                    // console.log(params)
                    return h('Select', {
                            props: {
                                'value': params.row.keyInteractMode
                            },
                            on: {
                                'on-change': (value) => {
                                    this.keyInteractModeChange(params,"keyInteractMode", value);
                                }
                            },
                        },
                        [
                            h('Option', {
                                props: {
                                    value: 'hidden'
                                }
                            }, 'hidden'),
                            h('Option', {
                                props: {
                                    value: 'readonly'
                                }
                            }, 'readonly'),
                            h('Option', {
                                props: {
                                    value: 'edit'
                                }
                            }, 'edit')
                        ]
                    );
                }
            }
        ];
        created() {
            this.mxGetList();
            this.value.forEach(item => {
                this.information.selectIds.add(item);
            })
        }
        selectChange(value, index, key){
            this.keyInteractModeChange({index:index},key,value)
        }
        mxFormListData(rows) {
            rows.forEach((item, index) => {
                this.$set(item, 'keyInteractMode', 'edit')
                this.$set(item, '_disabled', this.formDisabled)
                this.$set(item, '_showSelect', false)
                this.keyValueList.push([])
                this.value.forEach(items=>{
                    if(items.keyId === item.id){
                        item._checked = true
                        item.keyInteractMode = items.keyInteractMode
                        item.defaultValueId = items.defaultValueId
                    }
                })
            });
            return rows;
        }


        selectKeyChange(value,data) {
            
            const selectId: Array<any> = [];

            data.forEach(item=>{
                value.forEach(items=>{
                    if(item.id === items.id){

                        let obj = {
                            actionId: this.actionId,
                            available: true,
                            keyId: item.id,
                            keyInteractMode: item.keyInteractMode
                        }
                        this.$set(item,'_checked',true)
                        selectId.push(obj);
                    }
                })
            })
            this.$emit("input", selectId);
        }
        async defaultIconClick(row, index){
            row._showSelect = !row._showSelect 
            console.log(row, index)
            if(row._showSelect){
               let res = await this.$get(this.$API_ENUM.CITIC_SERVICE_CONFIG_OPTIONSVALUE_KEYID.replace("KEYID",row.id),{available:true})
               console.log(res)
               this.$set(this.keyValueList, index, res.data)
            //    this.keyValueList[index] = res. data
            }
        }

        /**
         * 单行key修改前端交互模式属性
         * @param params
         * @param value
         */
        keyInteractModeChange(params: any, key: string, value: string){

            this.$nextTick(()=> {

                const listItem = this.listData[params.index]
                listItem[key] = value;

                this.value.forEach(item => {
                    if (item.keyId == listItem.id) {
                        item[key] = listItem[key];
                    }
                })
            })
        }

        @Watch("value")
        valueChange(value) {
            this.value = value;
        }

        @Watch("formDisabled")
        formDisabledCh(value){
            this.listData.forEach(item=> item._disabled = value)
        }
        
    }

</script>
