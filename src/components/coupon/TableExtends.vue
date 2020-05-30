<style scoped lang="scss">
    .expand-row {
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="24">
                <span class="expand-key">优惠券: </span>
                <span class="expand-value">{{ couponTypeName }}</span>
            </Col>
        </Row>

        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">最后操作时间: </span>
                <span class="expand-value">{{ operationTime }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">生效期: </span>
                <span class="expand-value">{{ row.appResult === 1 ? row.effectiveDate : '暂无'}}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">失效期: </span>
                <span class="expand-value">{{ row.appResult === 1 ? row.expiryDate : '暂无'}}</span>
            </Col>
        </Row>

        <Row class="expand-row">
            <Col span="24">
                <span class="expand-key">赠送原因: </span>
                <span class="expand-value">{{ row.remark }}</span>
            </Col>
        </Row>
    </div>
</template>
<script lang="ts">

    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        @Prop() row: any;

        get operationTime() {
            const row = this.row;
            if (row && row.updateTime) {
                return new Date(row.updateTime).Format('yyyy-MM-dd hh:mm');
            }

            return '';
        }

        get couponTypeName() {
            const row = this.row;

            if (row.couponType === 1) {
                return `${row.couponTypeName}`;
            }

            return `${row.typeName}-${row.couponTypeName}`;
        }
    }

</script>
