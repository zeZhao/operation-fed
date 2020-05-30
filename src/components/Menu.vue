<!--suppress ALL -->
<style scoped lang="scss">
    .menu {
        min-width: 200px;
        overflow-y: auto;
        overflow-x: hidden;
        background: #363e4f;
    }
</style>

<template>
    <div class="menu">
        <Menu theme="dark" :open-names="openName" :active-name="activeName" @on-select="toPath"
              @on-open-change="changeOpen" ref="menu" width="auto">

            <template v-for="parent of menuTree">
                <MenuItem name="active" v-if="!parent.child" :name="parent.path" :key="parent.id">
                    <Icon v-if="parent.icon" :type="parent.icon"></Icon>
                    {{parent.name}}
                </MenuItem>
                <MenuSub v-else :name="parent.id" :key="parent.id">
                    <template slot="title">
                        <Icon v-if="parent.icon" :type="parent.icon"></Icon>
                        {{parent.name}}
                    </template>
                    <MenuItem v-for="son of parent.child" :name="son.path" :key="son.id">
                        <Icon v-if="son.icon" :type="son.icon"></Icon>
                        {{son.name}}
                    </MenuItem>
                </MenuSub>
            </template>

        </Menu>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import menuConfig from '../config/menu';
    import {
        deepCopy,
    } from "@/function/serviceSpecs";

    /**
     * 从列表中排除地址
     * @param menuConfig
     * @param path
     */
    function excludePath(menuConfig: Array<MenuItem>, path): Array<MenuItem> {
        return menuConfig.filter((parent: MenuItem) => {

            const pPath = parent.path;
            let children: Array<MenuItem> | undefined = parent.child;

            if (pPath) {
                if (pPath.includes(path)) {
                    return false
                } else {

                    // 排除子级菜单
                    if (children) {
                        parent.child = children.filter((child: MenuItem) => {
                            if (!child || !child.path) {
                                return false;
                            } else {
                                return !child.path.includes(path)
                            }
                        })
                    }
                    return true;
                }
            }

            return true;
        });
    }

    // 菜单过滤规则配置
    const FilterRuleConfig: Array<FilterRule> = [
        // 优惠券审批菜单过滤
        {
            path: '/frame/coupon-manage/approval',
            filterEnable: user => !['liuting@citic.com', 'gaowb@citic.com'].includes(user.email),
            doFilter: function (menuConfig: Array<MenuItem>) {
                return excludePath(menuConfig, this.path)
            }
        },
        // 信息安全审核菜单过滤
        {
            path: '/frame/authentication',
            filterEnable: user => !['liuting@citic.com', 'shang.f@foxmail.com'].includes(user.email),
            doFilter: function (menuConfig: Array<MenuItem>) {
                return excludePath(menuConfig, this.path)
            }
        },
        // 服务条款菜单过滤
        {
            path: '/frame/legal',
            filterEnable: user => ['fengcm@citic.com', 'liyi5@citic.com', 'p-chenhuanchen@tech.citic', 'p-yuwj@tech.citic', 'wurong@citic.com'].includes(user.email),
            doFilter: function (menuConfig: Array<MenuItem>) {
                return excludePath(menuConfig, this.path)
            }
        },
        //线下实例审批菜单过滤
        {
            path: '/frame/instance/approval',
            filterEnable: user => !['fengcm@citic.com'].includes(user.email),
            doFilter: function (menuConfig: Array<MenuItem>) {
                return excludePath(menuConfig, this.path)
            }
        },
        //信用额度审批菜单过滤
        {
            path: '/frame/credit/credit-limit-approval',
            filterEnable: user => !['fengcm@citic.com', 'liyi5@citic.com', 'mengxl1@citic.com', 'zhangwl1@citic.com', 'wuyue@citic.com'].includes(user.email),
            doFilter: function (menuConfig: Array<MenuItem>) {
                return excludePath(menuConfig, this.path)
            }
        },
        //信用额度审批菜单过滤
        {
            path: '/frame/data-refresh',
            filterEnable: user => !['liuting@citic.com'].includes(user.email),
            doFilter: function (menuConfig: Array<MenuItem>) {
                return excludePath(menuConfig, this.path)
            }
        },
        //服务规格配置菜单过滤
        {
            path: '/frame/service-specs',
            filterEnable: user => !['liuting@citic.com'].includes(user.email),
            doFilter: function (menuConfig: Array<MenuItem>) {
                return excludePath(menuConfig, this.path)
            }
        },
    ]

    @Component
    export default class extends Vue {

        menuTree: Array<MenuItem> = [];

        activeName: any = "";
        openName: Array<string> = [];

        created() {
            this.menuTree = this.runMenuFilter(deepCopy(menuConfig));
        }

        mounted() {
            this.matchRouter()
        }

        /**
         * 根据配置规则过滤菜单项
         */
        runMenuFilter(menuConfig: Array<MenuItem>): Array<MenuItem> {

            const user = this.$getSession("citic-user");

            FilterRuleConfig.forEach(rule => {
                if (rule.filterEnable(user)) {
                    menuConfig = rule.doFilter(menuConfig)
                }
            })

            return menuConfig;
        }

        toPath(path: string) {

            // 跳转到不同的地址上清空查询条件
            if (path === this.$route.path) {
                this.$router.replace(path);
                return;
            }

            this.$store.commit('resetAllSearch', {});
            this.$router.push(path)
        }

        changeOpen(array: Array<string>) {
            this.openName = array;
        }

        /**
         * 访问路径拦截
         */
        filterPath() {
            const user = this.$getSession("citic-user");
            const path = this.$route.path;

            for (const item of FilterRuleConfig) {
                if (path === item.path && item.filterEnable(user)) {
                    this.$router.replace("/");
                    break;
                }
            }
        }

        /**
         * 匹配路径展开正确的菜单
         */
        matchRouter() {
            const menu: any = this.$refs.menu;
            //遍历菜单，找出当前页面地址属于哪个一级或二级分类，设置正确的菜单展开样式
            const {path} = this.$route;

            for (const parent of this.menuTree) {
                //判断是否有子菜单
                if (parent.child) {
                    //遍历子菜单，发现被包含的页面则展开此父级菜单，并激活当前子菜单
                    for (let son of parent.child) {
                        if (path !== undefined && son.path !== undefined && path.includes(son.path)) {
                            this.activeName = son.path;
                            //如果已经打开的菜单包含了当前组，则不强制展开当前组
                            if (!this.openName.includes(parent.id)) {
                                this.openName.push(parent.id)
                                this.$nextTick(() => {
                                    menu.updateOpened()
                                });
                            }
                            break;
                        }
                    }
                } else {
                    if (path !== undefined && parent.path !== undefined && path.includes(parent.path)) {
                        this.activeName = parent.path;
                        break;
                    }
                }
            }
        }

        @Watch('$route')
        routerChange() {
            this.filterPath();
            this.matchRouter();
        }
    }
</script>


