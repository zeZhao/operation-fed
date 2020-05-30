<style scoped lang="scss">
    .empty-label-item {
        /deep/ .ivu-form-item-content {
            margin-left: 0 !important;
        }
    }

    /deep/ .el-input{
        input[readonly=readonly]{
            color: #999;
        }
    }

    /deep/.ivu-select-dropdown{
        width: inherit !important;
        overflow-x: auto;
    }

    /deep/.ivu-date-picker .ivu-select-dropdown{
      width: auto !important;
    }

</style>

<template>
    <div>
        <Form ref="form" :model="form" :label-width="150" v-if="searchFormConfig.length">
            <Row>
                <Col :sm="24" :md="12" :lg="12" :xl="12" :xxl="8" v-for="(item, index) in searchFormConfig" :key="index">
                    <FormItem :label="item.label ? `${item.label}：` : ``" :class="item.label ? `` : `empty-label-item`">

                        <!--输入框-->
                        <template v-if="item.type === 'input'">
                            <Input class="el-input" v-model="form[item.key]" :placeholder="item.placeholder"
                                   :clearable="isClearAble(item)"
                                   :readonly="isReadonly(item)"
                                   @on-change="mxHandleSubmit()"/>
                        </template>

                        <!--下拉列表-->
                        <template v-if="item.type === 'select'">
                            <Select v-model="form[item.key]" filterable :clearable="isClearAble(item)"
                                    :ref="`${item.type}_${item.key}`"
                                    @on-change="(value)=>{handleSelectChange(item, value)}">
                                <Option v-for="option in enumMap[item.key]" :value="option.key" :key="option.key"
                                >{{option.value }}</Option>
                            </Select>
                        </template>

                        <!--时间范围选择-->
                        <template v-if="item.type === 'daterange'">
                            <template v-if="item.separate">
                                <DatePicker type="date" :placeholder="item.placeholder || '选择日期'" style="width: 40%"
                                            :clearable="isClearAble(item)"
                                            v-model="form[item.keys[1]]"
                                            :options="item.dateOptions[0] || {}"
                                            @on-change="mxHandleSubmit()"></DatePicker>
                                -
                                <DatePicker type="date" :placeholder="item.placeholder || '选择日期'" style="width: 40%"
                                            :clearable="isClearAble(item)"
                                            v-model="form[item.keys[2]]"
                                            :options="item.dateOptions[1] || {}"
                                            @on-change="mxHandleSubmit()"></DatePicker>
                            </template>
                            <template v-else>
                                <DatePicker type="daterange" placeholder="选择日期" style="width: 100%"
                                            :clearable="isClearAble(item)"
                                            v-model="form[item.keys[0]]" @on-change="value => {
                                dateChange(value, item.keys[1], item.keys[2])
                            }"></DatePicker>
                            </template>
                        </template>

                        <!--月份单独选择-->
                        <template v-if="item.type === 'month'">
                            <DatePicker type="month" :placeholder="item.placeholder || '选择月份'" style="width: 100%"
                                        :clearable="isClearAble(item)"
                                        v-model="form[item.key]"
                                        @on-change="mxHandleSubmit()"></DatePicker>
                        </template>

                        <!--日期单独选择-->
                        <template v-if="item.type === 'date'">
                            <DatePicker :type="item.range || 'date'" :placeholder="item.placeholder || '选择日期'"
                                        style="width: 100%"
                                        :clearable="isClearAble(item)"
                                        v-model="form[item.key]"
                                        :options="item.dateOptions || {}"
                                        @on-change="mxHandleSubmit()"></DatePicker>
                        </template>

                        <!--时间范围选择-->
                        <template v-if="item.type === 'monthrange'">
                            <DatePicker type="month" :placeholder="item.placeholder || '选择月份'" style="width: 40%"
                                        :clearable="isClearAble(item)"
                                        v-model="form[item.keys[1]]"
                                        :options="item.dateOptions[0] || {}"
                                        @on-change="mxHandleSubmit()"></DatePicker>
                            -
                            <DatePicker type="month" :placeholder="item.placeholder || '选择月份'" style="width: 40%"
                                        :clearable="isClearAble(item)"
                                        v-model="form[item.keys[2]]"
                                        :options="item.dateOptions[1] || {}"
                                        @on-change="mxHandleSubmit()"></DatePicker>
                        </template>

                        <!--数字范围查询-->
                        <template v-if="item.type === 'numberRange'">
                            <i-input v-model="form[item.keys[1]]" style="width: 40%"
                                     :clearable="isClearAble(item)"
                                     @on-change="mxHandleSubmit()"/>
                            -
                            <i-input v-model="form[item.keys[2]]" style="width: 40%"
                                     :clearable="isClearAble(item)"
                                     @on-change="mxHandleSubmit()"/>
                        </template>

                    </FormItem>
                </Col>
            </Row>
        </Form>

        <div class="table-action-bar">
            <div class="action-panel left">
                <Button type="primary" shape="circle" icon="plus" @click="mxToDetail()" v-if="add">新增</Button>
                <slot></slot>
            </div>

            <div class="action-panel right">
                <Button type="info" shape="circle" icon="search" @click="mxHandleSubmit()"
                        v-if="search && searchFormConfig.length">搜索
                </Button>
                <Button type="error" shape="circle" icon="refresh" @click="mxHandleReset()"
                        v-if="reset && searchFormConfig.length">重置
                </Button>
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {FormMixin} from '../../mixin/index';

    import {Component, Prop} from 'vue-property-decorator';

    function isEmpty(value: any): boolean {
        return value === null || value === undefined || value.length === 0
    }

    @Component({})
    export default class extends FormMixin {

        @Prop({default: [], required: true}) searchFormConfig?: Array<SearchConfigItem>;
        @Prop({default: true, required: false}) add?: boolean;
        @Prop({default: true, required: false}) search?: boolean;
        @Prop({default: true, required: false}) reset?: boolean;

        path: string = '';
        form: any = {};
        enumMap: Object = {};
        //当清空依赖项目时做为标志，父菜单清空子菜单数据时子菜单不要拉取列表数据
        preventRipples: boolean = false;

        constructor() {
            super();
        }

        created() {
            this.path = this.$route.path;
            this.initComponent();
        }

        mounted() {
            this.mxHandleSubmit();
        }

        //跳转到新增页面
        mxToDetail() {
            this.$emit('add')
        }

        //提交表单，通知列表做一次查询操作
        mxHandleSubmit() {
            this.$emit('search', this.form);
        }

        //重写清除表单查询条件，需要同时清除store
        mxHandleReset() {
            this.preventRipples = true;

            //额外清除store中的数据
            this.$store.commit('resetSingleSearch', {path: this.path});
            Object.keys(this.form).forEach(key => {

                // @ts-ignore
                const itemConfig: SearchConfigItem = this.searchFormConfig.find((item: SearchConfigItem) => item.key === key);

                if(itemConfig && itemConfig.type === 'input' && itemConfig.readonly){
                    return;
                }

                // 特定查询条件清空时，使用第一个配置的值当做默认条件
                if (itemConfig && itemConfig.type === 'select' && itemConfig.clearable === false && itemConfig.constValue) {
                    this.form[key] = itemConfig.constValue[0].key;
                } else {
                    this.form[key] = null;
                }

            });

            setTimeout(() => {
                this.preventRipples = false
            }, 0);

            this.$emit('search', this.form);
        }

        //根据searchFormConfig初始化查询表单
        initComponent() {

            if (!this.searchFormConfig) {
                return
            }

            //获取枚举数据的任务队列
            const enumMapTask: Array<any> = [];
            // const form = {};
            this.searchFormConfig.forEach((item: SearchConfigItem) => {
                const {key, keys} = item;
                //date类型表单key为数组
                if (['daterange', 'numberRange', 'monthrange'].includes(item.type) && keys) {
                    keys.forEach((keyItem: string) => {
                        // form[keyItem] = this.recordParam(keyItem) || item.defaultValue;

                        this.$set(this.form, keyItem, this.recordParam(keyItem) || item.defaultValue);
                    });
                } else {
                    const recordValue = this.recordParam(key);

                    if (isEmpty(recordValue)) {
                        // form[key] = isEmpty(item.defaultValue) ? "" : item.defaultValue;

                        this.$set(this.form, key, isEmpty(item.defaultValue) ? "" : item.defaultValue);
                    } else {
                        // form[key] = this.recordParam(key);

                        this.$set(this.form, key, this.recordParam(key));
                    }
                }

                //如果是select类型需要请求接口拉取
                if (item.type === 'select') {
                    this.$set(this.enumMap, item.key, []);

                    //选项是固定值直接添加
                    if (item.constValue) {
                        this.enumMap[item.key] = item.constValue;
                    } else if (!item.dependent) {
                        //不存在依赖直接加入任务
                        item.promise = this.$get(`${item.api}`);
                        enumMapTask.push(item)
                    } else if (item.dependent) {

                        const dependentValue = this.form[item.dependent];

                        // 允许依赖项为空
                        if(item.ignoreDependentEmpty === true){
                            //存在依赖并且依赖项有值也要加入任务
                            item.promise = this.$get(`${item.api}`.Format(dependentValue));
                            enumMapTask.push(item)
                        }else if(dependentValue){
                            //存在依赖并且依赖项有值也要加入任务
                            item.promise = this.$get(`${item.api}`.Format(dependentValue));
                            enumMapTask.push(item)
                        }
                    }
                }
            });

            // this.form = form;

            if (enumMapTask.length) {
                Promise.all(enumMapTask.map(item => item.promise)).then(resArray => {
                    resArray.forEach((res, index) => {
                        const taskItem = enumMapTask[index];
                        this.enumMap[taskItem.key] = taskItem.formatOption(res);
                    });
                })
            }
        }

        //根据store状态恢复查询条件
        recordParam(key: string) {
            const recordParam = this.$store.state.searchParam.paramMap[this.path];
            if (key && recordParam) {
                const {searchParam} = recordParam;
                return searchParam[key];
            }
            return '';
        }

        /**
         * 下拉菜单切换选项后需要判断是否有关联下拉，如果有触发关联下拉菜单加载
         */
        handleSelectChange(item, currentValue) {

            const {influence} = item;
            if (influence) {
                this.preventRipples = true;
                //清空影响到的菜单
                this.clearInfluence(influence, currentValue);
                //放入消息队列延缓阻止涟漪的时间，防止多次调用拉取列表接口
                setTimeout(() => {
                    this.preventRipples = false
                }, 0);

                //找到该选项影响到的下拉菜单配置
                if (this.searchFormConfig) {
                    const found = this.searchFormConfig.find((item: SearchConfigItem) => item.key === influence);

                    if (found) {
                        const {api, key, formatOption} = found;

                        if (currentValue) {
                            this.$get(`${api}`.Format(currentValue)).then(res => {
                                let augment = Object.assign({}, this.enumMap);
                                if(formatOption){
                                    augment[`${key}`] = formatOption(res);
                                }
                                this.enumMap = augment;

                            })
                        }
                    }
                }
            }
            this.mxHandleSubmit();
        }

        //根据key递归清除所有影响到的下拉项
        clearInfluence(influenceKey, currentValue = "") {
            if(!influenceKey){
                return;
            }
            this.form[`${influenceKey}`] = '';
            this.enumMap[`${influenceKey}`] = [];

            if (this.searchFormConfig) {
                const found = this.searchFormConfig.find((item: SearchConfigItem) => item.key === influenceKey);

                if (found) {
                    const influenceItem: SearchConfigItem = found;
                    //被关联到的下拉菜单组件，如果允许使用空条件查询，则查询一次接口获取下拉列表数据
                    if(!currentValue && found.ignoreDependentEmpty === true){
                        this.$get(`${found.api}`.Format('')).then((res)=>{

                            if(found.formatOption){
                                this.enumMap[influenceKey] = found.formatOption(res);
                            }

                        });
                    }else {
                        //需要关联条件才可以查询，则清空现有下拉数据
                        this.enumMap[influenceKey] = [];
                    }

                    if (influenceItem) {
                        this.clearInfluence(influenceItem.influence);
                    }
                }
            }
        }

        dateChange(value: Array<string>, key1: string, key2: string) {
            if (!value[0] || !value[1]) {
                this.form[key1] = "";
                this.form[key2] = "";
            } else {
                this.form[key1] = new Date(value[0]);
                this.form[key2] = new Date(value[1]);
            }
            this.mxHandleSubmit();
        }

        /**
         * 是否可以清除
         */
        isClearAble(item: SearchConfigItem) {
            return item.clearable !== false;
        }

        /**
         * 是否只读
         * @param item
         */
        isReadonly(item: SearchConfigItem){
            return item.readonly === true;
        }

        /**
         * 重置查询
         */
        resetCondition(){
            this.$store.commit('resetSingleSearch', {path: this.$route.path});
            this.mxHandleReset();
            this.mxHandleSubmit();
        }
    }
</script>
