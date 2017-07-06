<template>

      <div v-bind:style="{width:width+'px',height:height+'px',backgroundColor:color,margin: '0 auto'}" style="border-radius:15px">
        <!-- 头部选择操作按钮 -->
        <div class="contenter" v-bind:style="{height:'110px', borderBottom: '1px solid rgba(0,0,0,0.1)'}">
          <div v-on:click="leftButtonAction" class="contenter" style="width:40px;height:40px">
            <img :src="imgurlLeft" style="width:40px;">
          </div>
          <div  class="contenter" style="width:300px;height:40px;font-size: 30px">{{dateText}}</div>
          <div v-on:click="rightButtonAction" class="contenter" style="width:40px;height:40px">
            <img :src="imgurlRight" style="width:40px;">
          </div>
        </div>
        <!--月份排列-->
        <div v-bind:style="{overflow:'hidden', borderBottom: '1px solid rgba(0,0,0,0.1)'}">
          <div v-for ="item in items">
            <div v-bind:style="{width:itemwidth+'px',height:itemheight+'px'}"
                 style="float:left;margin:5px;"
                @click="selectMonth(item)" class="contenter"
            >
              <div  class="contenter" v-bind:style="{color:item.textColor,backgroundColor:item.color}" style="width:100px;height:100px;border-radius:100%">
              {{item.value}}
              </div>
            </div>
          </div>
        </div>
        <div  class="contenter" v-on:click="cancelButtonAction" v-bind:style="{overflow:'hidden',paddingTop:10+'px', width:width,height:'50px'}" style="background-color: transparent">
          取消
        </div>
      </div>
</template>
<script>
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
        width:380,//画布宽度
        height:440,//画布高度
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
        return 380/4-10;
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
        debugger;
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
