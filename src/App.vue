<style lang="scss">

</style>

<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class extends Vue {
        created() {
            // const token = this.$getSession('citic-token');
            // if(!token){
            //     this.$router.push('/login');
            // }
        }
    }
</script>