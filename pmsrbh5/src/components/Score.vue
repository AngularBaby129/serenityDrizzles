<template>
    <div class="score-wrapper">
        <mt-range
            v-model="rangeValue"
            :min="0"
            :max="20"
            :step="1"
            @input='getScore'
        >
        </mt-range>
        <div class="score-tip">
            <span class="left">0分</span>
            <span>10分</span>
            <span class="right">20分</span>
        </div>
    </div>
</template>

<script>
    import { Range } from 'mint-ui';
    require('../homepage.css');
    Vue.component(Range.name, Range);
    export default{
        props: ['curIndex','currentScore'],
        data () {
            return {
                rangeValue: this.currentScore
            }
        },
        mounted () {
            this.getScore()
        },
        methods: {
            getScore: function(){
                if (document.getElementById('score-text'+this.curIndex) == null) {
                    let insertEle = document.createElement('span')
                    let scoreEle = document.getElementsByClassName('mt-range-thumb')[this.curIndex]
                    insertEle.setAttribute('class', 'score-text')
                    insertEle.setAttribute('id', 'score-text'+this.curIndex)
                    insertEle.innerHTML = this.rangeValue + '分'
                    scoreEle.appendChild(insertEle)
                }else{
                    document.getElementById('score-text'+this.curIndex).innerHTML = this.rangeValue+ '分'
                }
                this.$emit('getScore',this.rangeValue)
            }
        }
    }
</script>

<style>
    /*增大触控范围*/
    .touch-ele {
        position: absolute;
        top: -15px;
        left: -20px;
        padding: 30px 40px;
    }
    .score-wrapper {
        position: absolute;
        right: 78px;
        bottom: -65px;
        width: 415px;
    }
    .mt-range {
        display: block;
    }
    .mt-range-runway {
        border-top-width: 4px!important;
        border-top-color: #ededed;
        top: 13px;
        right:  -15px;
    }
    .mt-range-progress {
        top: 13px;
        height: 4px!important;
        background-color: #F37938;
    }
    .mt-range-thumb {
        position: relative;
        width:  26px;
        height:  26px;
    }
    .score-text {
        position: absolute;
        top: -50px;
        left: -1rem;
        width:  3.6rem;
        text-align:  center;
        color: #F37938;
        font-size: 1.6rem;
        font-weight: 700;
    }
    .score-wrapper .score-tip {
        text-align:  center;
        margin-top: 10px;
        font-size: 1.1rem;
        font-weight: 300;
        color: #999;
    }
</style>
