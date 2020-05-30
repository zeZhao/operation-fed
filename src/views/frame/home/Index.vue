<style lang="scss" scoped>

</style>

<template>
    <div>
        <Alert show-icon>
            中信云运营管理平台
            <Icon type="ios-bulb-outline" slot="icon"></Icon>
            <template slot="desc"></template>
        </Alert>

    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class extends Vue {
        name = ""
    }

</script>