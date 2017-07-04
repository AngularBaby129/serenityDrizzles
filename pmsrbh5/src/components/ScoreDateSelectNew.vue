<template>
  <aside class="tool-mouthSelect">
    <section class="tool-mouthSelect-main">
      <h3 class="tool-mouthSelect-switch"><a href="javascript:;" otype="button" otitle="分享明细-上一个" class="icon icon-arrowCircle-r" v-on:click="leftButtonAction"></a><span>{{dateText}}</span><a href="javascript:;" otype="button" otitle="分享明细-下一个" class="icon icon-arrowCircle-r" v-on:click="rightButtonAction"></a></h3>
      <div class="tool-mouthSelect-mouth" v-for ="item in items">
        <span @click="selectMonth(item)" v-bind:style="{color:item.textColor,backgroundColor:item.color}">{{item.value}}</span>
        <!--<span>2</span>-->
        <!--<span>3</span>-->
        <!--<span>4</span>-->
        <!--<span>5</span>-->
        <!--<span>6</span>-->
        <!--<span>7</span>-->
        <!--<span>8</span>-->
        <!--<span>9</span>-->
        <!--<span>10</span>-->
        <!--<span>11</span>-->
        <!--<span class="active">12</span>-->
      </div>
      <div class="tool-mouthSelect-foot">
        <a href="javascript:;" otype="button" otitle="分享明细月份选择-取消" class="tool-mouthSelect-cancel" v-on:click="cancelButtonAction">取消</a>
      </div>
    </section>
  </aside>
</template>
<script>
  require('../assets/tool-mouthSelect.css');
  export default {
      props:{
          flag: {
              type: Boolean,
              default: true,
          },
          date: {
              type: Object,
              default () {
                  return {
                      year: 2016,
                      month: 1,
                      day: 21
                  }
              }
          }

      },
    data(){
      return {
        imgurlLeft:require("../images/leftArrow.png"),
        imgurlRight:require("../images/rightArrow.png"),
        unclick:require("../images/unclick.png"),
        message:'日期选择-月选择',
        width:600,//画布宽度
        height:660,//画布高度
        itemwidth:this.itemWidth(),//每个item宽度
        itemheight:this.itemWidth(),//每个item的高度
        color:'#efefef',
        items:[],
        year:0,
        month:0,
        day:0,
        dateText:'',
        nowDate:new Date()
      }
    },
  mounted () {

      this.year = this.date.year;
      this.month = this.date.month;
      this.day = this.date.day;
     // alert(this.date.year)
   // var date = new Date();
      console.log(this.year);
      this.selectedMonth = this.date.month;
      this.updateDisplay();

  },
    methods:{
      //刷新界面显示
      updateDisplay(){
        var month = this.month.toString();
        if(month.length == 1)
        {
          month = '0'+month;
        }
//        var day = this.day.toString();
//        if(day.length == 1)
//        {
//          day = '0'+day;
//        }
          if(this.flag)
          {
              this.dateText = this.year+'年';
          }else
          {
              this.dateText = this.year+'年' + month+'月';
          }
          console.log(this.year);
          var nowDate = new Date();
        if(this.year>=nowDate.getFullYear()){
          this.imgurlRight = this.unclick;
        }else {
          this.imgurlRight = require("../images/rightArrow.png");
        }

        this.items = this.months();
      },
      //计算中间格子宽度(item)
      itemWidth(){
        return 600/4-10;
      },
      months(){
        var nowDate = new Date();
        var retArr = new Array();
        for(var i = 0; i < 12; i++)
        {
          if(this.year == nowDate.getFullYear())
          {
            if(i > nowDate.getMonth()){
              retArr.push({
                value:i+1,
                color:'transparent',
                textColor:'rgb(211,211,211)',
              });
            }else if(i== this.month-1){
              //当前选中月
              retArr.push({
                value:i+1,
                color:'rgba(75,165,250,1)',
                textColor:'white',
              });
            }else {
              retArr.push({
                value:i+1,
                color:'transparent',
                textColor:'black' ,
              });
            }
          }else{
            if(i== this.month-1){
              //当前选中月
              retArr.push({
                value:i+1,
                color:'rgba(75,165,250,1)',
                textColor:'white',
              });
            }else{
              retArr.push({
                value:i+1,
                color:'transparent',
                textColor:'black' ,
              });
            }
          }
        }
        return retArr;
      },
      leftButtonAction(){
       // alert('left');
        this.year -=1;
        this.updateDisplay();

      },
      rightButtonAction(){
        //alert('right');
        if(this.year >= this.nowDate.getFullYear()){
          return;
        }
        this.year +=1;
        this.updateDisplay();
      },
      selectMonth (item) {
        //alert(item.value)
        if(item.value > this.nowDate.getMonth()+1){
          return;
        }
        this.month = item.value;
        this.updateDisplay();
          this.cancelButtonAction();
          this.$emit('selectMonth', item.value, this.year);

      },
      cancelButtonAction(){
        //alert('cancel');
          this.$emit('cancel');
      }
    }
  }
</script>
<style>
  .contenter{
    display:-webkit-flex;
    display: flex;
      -webkit-justify-content:center;
      justify-content:center;
      -webkit-align-items:center;
      align-items:center;
    background-color: transparent;
  }
</style>
