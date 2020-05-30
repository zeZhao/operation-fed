<style lang="scss" scoped>
.cache-admin-index {
  min-height: 500px;
  .btn {
    width: 80%;
    margin: auto;
    font-size: 20px;
    /deep/span {
      width: 100%;
      display: block;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>

<template>
  <Card class="cache-admin-index">
    <p slot="title">缓存刷新</p>
    <Row :gutter="16" class="row">
      <Col span="6">
        <Button class="btn" @click="doRefresh(0)">
          刷新citic-food库的
          <br />adapter_service_config表数据
        </Button>
      </Col>
      <Col span="6"></Col>
      <Col span="6"></Col>
      <Col span="6"></Col>
    </Row>
  </Card>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default class extends Vue {
  doRefresh(type: number) {
    //0刷新刷新citic-food库的adapter_service_config表数据
    let url: any = null;
    switch (type) {
      case 0:
        url = this.$API_ENUM.CITIC_ADAPTER_SERVICE_CONFIG_REFRESH;

        break;

      default:
        break;
    }

    if (url === null) {
      return;
    }

    this.$get(this.$API_ENUM.CITIC_ADAPTER_SERVICE_CONFIG_REFRESH).then(res => {
        if(res.code === "200"){
            this.$Message.info("刷新成功")
        }

    });
  }
}
</script>