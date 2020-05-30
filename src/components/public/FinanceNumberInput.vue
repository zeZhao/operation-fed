<style lang="scss" scoped>
    .financial-figures-input-htmlStr input {
        width:90%;
        height: 20px;
        line-height: 20px;
    }

    .financial-figures-input-htmlStr span{
        display: inline-block;
        width:90%;
        border-bottom: 1px solid #ccc;
        height: 20px;
        line-height: 20px;
    }
</style>

<template>
    <div class='financial-figures-input-htmlStr'>
        <input v-model='num' ref='numbner-input'  @input='inputChange($event.target.value)' @focus='inputFocus' @blur='inputBlur' v-show='showInput' @keydown="checkInput($event)" @keyup.enter='enterKey'></input>
        <span @click='spanClick' v-show='!showInput'>{{numberFormat}}</span>
        <img src='../../assets/images/billCollection/adjustment-icon.png' v-show='!showInput' style='cursor:pointer;display: inline-block;margin-left: 6px;' @click='spanClick'/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    // import adjustmentIcon from '../../assets/images/billCollection/adjustment-icon.png'

    @Component({
        components: {},
    })
    export default class extends Vue {

        @Prop({type: [Number,String],default: () => {return 0}}) number;
        @Prop({type: [Number,String],default: () => {return -1}}) max_number;
        @Prop({type: Boolean,default: () => {return false}}) disabled;

        showInput:boolean = false;
        num = this.number

        created() {
        }
        get numberFormat() {
            return Number(this.num).toFixed(2)
        }

        inputFocus() {

        };
        inputBlur() {
            this.showInput = false;
            this.$emit("number-blur", this.num)
        };
        inputChange(value) {
            console.log("inputChange")
            console.log('-----------',value)
            console.log(this.max_number, this.num);
            if (!this.checkNumber(value) && value.substring(value.length - 1) != ".") {
                this.num = value.substring(0, value.length - 1)
            }
            if (this.max_number != -1 && Number(this.num) > Number(this.max_number)) {
                this.num = value.substring(0, value.length - 1)
            }
            this.$emit("number-change", this.num)
        };
        spanClick() {
            console.log("spanClick")
            if (this.disabled) {
                return
            }
            this.showInput = true
            setTimeout(() => {
                // @ts-ignore
                this.$refs["numbner-input"].focus()
            }, 0)

        };
        checkNumber(val) {
            return /^[+-]?(0|([0-9]\d*))(\.\d+)?$/g.test(val)
        };
        //  input框校验
        checkInput(e){
            let prohibitInput= ["-", "e", "+", "E"];
            if(prohibitInput.includes(e.key)){
                e.preventDefault();
            }
            if(e.key === "."){
                if(this.num.indexOf(".") !== -1){
                    e.preventDefault();
                }
            }
        };
        enterKey(e) {
            e.target.blur()
            this.$emit("number-blur", this.num)
        }

        @Watch('number', { immediate: true, deep: true })
        getData(newVal: object){
            this.num = newVal
        }
    }
</script>