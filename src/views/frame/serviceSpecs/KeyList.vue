<style lang="scss" scoped>
</style>

<template>
    <Card>
        <p slot="title">
            <Icon type="ios-arrow-dropleft" size="22" @click="()=>this.$router.back()" />
            key列表
        </p>

        <ci-search-panel
            :add="true"
            @add="mxToDetail({serviceId})"
            @search="mxDoSearch"
            :searchFormConfig="searchFormConfig"
        ></ci-search-panel>

        <Table :columns="columns" :data="listData" :loading="loading"></Table>

        <Page
            class="list-page"
            :total="total"
            :current="pageIndex"
            :pageSize="pageSize"
            :page-size-opts="pageSizeOpts"
            show-total
            show-sizer
            show-elevator
            @on-change="mxChangePage"
            @on-page-size-change="mxChangePageSize"
        ></Page>
    </Card>
</template>

<script lang="ts">
import { ListMixin } from "../../../mixin";

import { Component } from "vue-property-decorator";

@Component({
    components: {}
})
export default class extends ListMixin {
    searchParam = {};

    searchFormConfig = [];

    columns = [
        {
            title: "名称",
            key: "displayName"
        },
        {
            title: "编码",
            key: "code"
        },
        {
            title: "是否必填",
            key: "required",
            render: (h, params) => {
                let text = params.row.required === true ? "是" : "否";
                return [h("span", {}, text)];
            }
        },
        {
            title: "是否有动态校验",
            key: "dynamicCheck",
            render: (h, params) => {
                let text = params.row.dynamicCheck === true ? "是" : "否";
                return [h("span", {}, text)];
            }
        },
        {
            title: "提示说明",
            key: "tips"
        },
        {
            title: "顺序",
            key: "sort"
        },
        {
            title: "是否初始值",
            key: "initKey",
            render: (h, params) => {
                let text = params.row.initKey === true ? "是" : "否";
                return [h("span", {}, text)];
            }
        },
        {
            title: "是否计费字段",
            key: "billingKey",
            render: (h, params) => {
                let text = params.row.billingKey === true ? "是" : "否";
                return [h("span", {}, text)];
            }
        },
        {
            title: "备注",
            key: "remark",
        },
        {
            title: "操作",
            align: "center",
            width: 250,
            render: (h, params) => {
                return [
                    h(
                        "ButtonGroup",
                        {
                            props: {
                                shape: "circle",
                                size: "small"
                            }
                        },
                        [
                            h(
                                "Button",
                                {
                                    props: {
                                        icon: "ios-cog-outline",
                                        type: "info"
                                    },
                                    on: {
                                        click: () => {
                                            const {
                                                id,
                                                serviceId
                                            } = params.row;

                                            this.mxToDetail({
                                                id,
                                                serviceId
                                            });
                                        }
                                    }
                                },
                                "编辑"
                            ),

                            h(
                                "Button",
                                {
                                    props: {
                                        icon: "ios-cog-outline"
                                    },
                                    on: {
                                        click: () =>
                                            this.toValueList(params.row)
                                    }
                                },
                                "配置value"
                            ),

                            h(
                                "Button",
                                {
                                    props: {
                                        icon: "ios-cog-outline",
                                        type: "error"
                                    },
                                    on: {
                                        click: () =>
                                            this.mxDeleteItem(params.row.id)
                                    }
                                },
                                "删除"
                            )
                        ]
                    )
                ];
            }
        }
    ];

    searchAPI: string = `${this.$API_ENUM.CITIC_SERVICE_OPTIONSKEY_LIST}?available=1`;
    editPath: string = "/frame/service-specs/key/form";
    delAPI: string = this.$API_ENUM.CITIC_SERVICE_OPTIONSKEY;
    serviceId: string = "";

    created() {
        const { id } = this.$route.query;
        this.serviceId = `${id}`;
        this.searchAPI = `${this.$API_ENUM.CITIC_SERVICE_OPTIONSKEY_LIST}?available=1&serviceId=${this.serviceId}`;
    }

    toValueList(row) {
        this.$router.push(`/frame/service-specs/value/list?id=${row.id}`);
    }
}
</script>