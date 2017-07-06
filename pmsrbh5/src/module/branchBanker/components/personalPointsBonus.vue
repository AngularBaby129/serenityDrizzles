<template>
    <section class="personalPointsBonus-wrapper">
        <div class="modal" v-if="showDateSelect">
            <ScoreDateSelect :date="date" :flag="true"  @cancel="showDateSelect=false" @selectMonth="selectMonth"></ScoreDateSelect>
        </div>
        <dl class="personalPointsBonus-top">
            <dt>
                <span class="icon icon-arrowCircle-r" :class="isCenterLeft?'active':''" @click="leftDateSelect"></span>
                <span class="leftTxt" @click="showDateSelectComponent">{{currentDate}}</span>
                <span class="icon icon-arrowCircle-r" :class="isCenterRight?'active':''"  @click="rightDateSelect"></span>
            </dt>
            <dd><span class="orangeFont">{{actionPoints | initPoints}} </span> 分</dd>
        </dl>
        <ul class="personalPointsBonus-tips">
            <li>最近更新日期 {{update}}</li>
            <li>个人积分奖金=个人积分*积分单价</li>
            <li>积分单价：1分={{scoreSingle | initPoints}}元</li>
        </ul>
        <div class="personalPointsBonus-content">
            <h2 @click="clickProductSales">产品销售<span class="icon icon-questionFill"></span></h2>
            <ul class="personalPointsBonus-contentList">
                <li @click="gooToPointHtml('depositBenifits')">
                    <p class="listLeft">投资理财创利</p>
                    <p class="listRight">{{InvestmentScore | initPoints}}<span class="icon icon-arrowLg-r"></span></p>
                </li>
                <li @click="gooToPointHtml('investmentBenifits')">
                    <p class="listLeft">存款创利</p>
                    <p class="listRight">{{depositScore | initPoints}}<span class="icon icon-arrowLg-r"></span></p>
                </li>
            </ul>
        </div>
        <!--个人积分奖金弹窗-->
        <article class="personalPointsBonus-dialog dialog-area" v-show="showCustomernteractionExplainModal">
            <div class="personalPointsBonus-dialogMain">
                <h2>{{explainModalTitle}}</h2>
                <div class="personalPointsBonus-dialogContent" v-for="item in productSalesList">
                    <dl>
                        <dt>{{item.productSalesTitle}}</dt>
                        <dd>{{item.productSalesDetails}}</dd>
                    </dl>
                </div>
                <div class="personalPointsBonus-dialogBtn">
                    <button @click="hiddenCustomernteractionExplainModal">知道了</button>
                </div>
            </div>
        </article>
    </section>
</template>
<script>
    require("../../../modulecss/moduleBonus.css");
    import ScoreDateSelect from '../../../components/ScoreDateSelectNew.vue'

    export default {
        components:{
            ScoreDateSelect
        },
        methods:{
            queryResponsePoints(date) {
                let _self = this;
                aladdin.loading.start({canCancel: false}, function (err) {
                    if(err){
                        aladdin.toast.show({message: '加载进度框显示错误 '});

                    }
                });
                aladdin.aike_tool.getTicket(function (err, ticket) {
                    var umAccount='';
                    if (err && !ticket) {
                        aladdin.toast.show({message: err.message});
                        // alert("ticket=="+ticket);
                    } else {

                        aladdinRequestData({
                            url:'subbranchManager/getPersonScoreBonus.do',
                            type: 'POST',
                            data: {
                                //TODO
                                'ticket':ticket,
                                'userId': 'LIXIANG232',//ticket,
                                'date': date,//日期 YYYY-MM/YYYY-MM-DD
                                'inputType':'支行长'
                            },
                            beforeSend:  {
                                'brcpEaSessionTicket':ticket
                            },
                            success: function(err,res) {
                                aladdin.loading.stop();
                                if(err){
                                    aladdin.toast.show({message: '加载错误 '});
                                    aladdin.loading.stop({canCancel: false});
                                    return;
                                }
                                let result = res.body;
                                result = eval("("+result+")");
                                if (result.responseCode != 0){
                                    if(result.responseCode == "900108"){
                                        aladdin.toast.show({ message:'该用户当月无数据'});
                                    }else if(result.responseCode == "900120"){
                                        aladdin.toast.show({ message:'当前月份的用户角色发生变更，请切换到业绩主页查询'});
                                    }else{
                                        aladdin.toast.show({ message:'系统错误'});
                                    }
                                    return;
                                }else {
                                     _self.actionPoints = result.subbranchBonus;
                                     _self.scoreSingle = result.priceOneScore;
                                     _self.update = result.Stat_date;
                                     _self.InvestmentScore = result.touziScore;
                                     _self.depositScore = result.cunkuanScore;
                                     var touzi = result.touzi ? result.touzi :'--';
                                     var cunkuan = result.cunkuan ? result.cunkuan : '--';
                                     _self.productSalesList[0].productSalesDetails = '每万元创利可得'+touzi+'分';
                                     _self.productSalesList[1].productSalesDetails = '每万元创利可得'+cunkuan+'分。大额存单计给销售人，其他按创利5折计给管户人。'
                                }



                            }

                        });
                    }
                });
            },
            leftDateSelect(){
                var date = new Date(this.date.year,this.date.month-1,this.date.day);
                date.setMonth(date.getMonth()-1);
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let day = date.getDate();

                this.date = {
                    year:year,
                    month:month,
                    day:day,
                }
                month = month + '';
                if(month.length == 1)
                {
                    month = '0'+month;
                }

                this.currentDate = year + '年'+month+'月';
                var dateTime =year.toString() + month;
                this.queryResponsePoints(dateTime);
                this.isCenterRight=true;
                this.imgRightUrl = require("../../../images/rightArrow.png");
            },
            rightDateSelect(){
                var date = new Date(this.date.year,this.date.month-1,this.date.day);
                date.setMonth(date.getMonth()+1);

                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let day = date.getDate();
                var nowDate = new Date();
                this.date = {
                    year:year,
                    month:month,
                    day:day,
                }
                month = month.toString();
                if(month.length == 1)
                {
                    month = '0'+month;
                }

                // debugger;
                var dateTime =year.toString() + month;
                if(this.date.year == nowDate.getFullYear()){
                    if(this.date.month > nowDate.getMonth()+1){
                        this.date.month = nowDate.getMonth()+1;
                        this.isCenterRight = false;
                        this.imgRightUrl = require("../../../images/unclick.png");
                    }else if (this.date.month == nowDate.getMonth()+1){
                        this.isCenterRight = false;
                        this.imgRightUrl = require("../../../images/unclick.png");
                        this.queryResponsePoints(dateTime);
                    }else {
                        this.queryResponsePoints(dateTime);
                    };

                }else {
                    this.queryResponsePoints(dateTime);
                };
                this.date.month = this.date.month + '';
                if(this.date.month.length == 1)
                {
                    this.date.month = '0'+this.date.month;
                }
                this.currentDate = year + '年'+this.date.month+'月';
            },
            showDateSelectComponent(){

                console.log(this.date);
                this.showDateSelect=true;
            },
            selectMonth (month,year) {
                //alert(month);
                this.date.month = month;
                this.date.year = year;
                month = month+'';
                if(month.length == 1)
                {
                    month = '0'+month;
                }
                this.currentDate = year + '年'+month+'月';
//                debugger;

                var dateTime =year.toString() + month;
                this.queryResponsePoints(dateTime);
                var nowDate = new Date();
                if(this.date.year == nowDate.getFullYear()+1){
                    if(this.date.month >= nowDate.getMonth()){
                        this.date.month = nowDate.getMonth()+1;
                        this.isCenterRight = false;
                    }else{
                        this.isCenterRight = true;
                    }

                }

            },
            clickProductSales(){
                this.explainModalTitle = '产品销售积分说明';
                this.showCustomernteractionExplainModal = true;
            },
            hiddenCustomernteractionExplainModal(){
                //alert('隐藏说明弹框');
                this.showCustomernteractionExplainModal = false;
            },
            gooToPointHtml(type){
                let url = '';
                debugger;
                var month = '0'+this.date.month;
                let date = this.date.year.toString();
                if(type == 'depositBenifits'){
                    url = '../salespoints/depositBenifits.html?dateTime='+date + month;
                }else if(type == 'investmentBenifits'){
                    url = '../salespoints/investmentBenifits.html?dateTime='+date + month;
                }
                aladdin.Header.forward({url: url});
            }

        },
        data(){
            return{
                date: {
                    year: 0,
                    month: 0,
                    day: 0
                },
                isCenter:false,
                isCenterLeft:true,
                isCenterRight:true,
                actionPoints:'',
                currentDate:'',
                showDateSelect:false,
                showCustomernteractionExplainModal:false,
                explainModalTitle:'',
                scoreSingle:'',
                update:'',
                InvestmentScore:'',
                depositScore:'',
                responsePointsList:[
                    {
                        "actionDefineName": "投资理财创利",//完成率
                        "points": "+0",
                    },
                    {
                        "actionDefineName": "存款创利",//完成率
                        "points": "+10",
                    }
                ],

                productSalesList:[
                    {
                        'productSalesTitle':'投资理财创利',
                        'productSalesDetails':'每万元创利可得设置值分',
                    },
                    {
                        'productSalesTitle':'存款创利',
                        'productSalesDetails':'每万元创利可得设置值分。大额存单计给销售人，其他按创利5折计给管户人。'
                    }
                ]
            }

        },
        mounted () {
//            aladdin.loading.start({canCancel: false});

            var thisURL = document.URL;
            var  getval =thisURL.split('?')[1];
            var mapDateTime= getval.split("=")[1];
            var nowDate = new Date();
            let _self = this;
            if (mapDateTime){
                var mapYear = mapDateTime.substring(0,4);
                var mapMonth = mapDateTime.substring(4,6);
                debugger;
                _self.date.year = parseInt(mapYear);
                _self.date.month = parseInt(mapMonth);
                _self.date.day = nowDate.getDate();
//                this.date = {
//                    year: parseInt(mapMonth),
//                    month: parseInt(mapYear),
//                    day:date.getDate()
//                };
                var month = mapMonth+'';
                if(month.length == 1)
                {
                    month = '0'+month;
                }
                this.queryResponsePoints(mapDateTime);
                this.currentDate = mapYear + '年'+ month + '月'
            }else {

                var month = nowDate.getMonth()+1+'';
                if(month.length == 1)
                {
                    month = '0'+month;
                }
                var dateTime =nowDate.getFullYear().toString() + month;
//            var dateTime = date.format("YYYYMM");
                console.log('dateTime='+dateTime);
                this.queryResponsePoints(dateTime);
                this.date = {
                    year: nowDate.getFullYear(),
                    month: nowDate.getMonth()+1,
                    day: nowDate.getDate()
                };

                this.currentDate = this.date.year + '年'+month + '月'
            }
            if(this.date.year == nowDate.getFullYear()){
                if(this.date.month == nowDate.getMonth()+1){
                    this.isCenterRight = false;
                };

            };

            //调用原生app头部
            var url = '/sicaih5/dist/module/mine.html#/problemFeedback?type=teamPointsBonus';
            var rightButtonCallback = function () {
                aladdin.Header.forward({url: url});
            };
            rightButtonCallback.keep = true;
            aladdin.Header.config({
                title: '个人积分奖金',
                rightButtonVisible: true,
                rightButtonText: '问题反馈',
                rightButtonFontSize: '16px',
                rightButtonCallback: rightButtonCallback
            });
        },
        filters:{
            initPoints(points){
                if(points ){
                    return points;
                }else {
                    return '--';
                }
            }
        }

    }


</script>
<style>
    .modal{
        position:fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        background-color:rgba(0,0,0,0.5);
        display:flex;
        justify-content: center;
        align-items: center;
    }
</style>