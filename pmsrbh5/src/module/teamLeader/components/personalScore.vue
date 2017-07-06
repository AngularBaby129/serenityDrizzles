<template>
    <div class="wrap resScore">
        <section class="kindsIntegration-wrapper">
            <div class="modal" v-if="showDateSelect">
                <ScoreDateSelect :date="date" :flag="true"  @cancel="showDateSelect=false" @selectMonth="selectMonth"></ScoreDateSelect>
            </div>
            <dl class="personalPointsBonus-top">
                <dt>
                    <span class="icon icon-arrowCircle-r " :class="isCenterLeft?'active':''" @click="leftDateSelect"></span>
                    <span class="leftTxt" @click="showDateSelectComponent">{{currentDate}}</span>
                    <span class="icon icon-arrowCircle-r " :class="isCenterRight?'active':''"  @click="rightDateSelect"></span>
                </dt>
                <dd><span class="orangeFont">{{actionPoints | initPoints}}</span>元</dd>
            </dl>
            <ul class="kindsIntegration-tips">
                <li>最近更新日期{{Period | initPoints}}</li>
            </ul>
            <div class="kindsIntegration-content">
                <h2 @click="clickProductSales">产品销售<span class="icon icon-questionFill"></span></h2>
                <ul class="kindsIntegration-contentList">
                    <li @click="gooToPointHtml('depositBenifits')">
                        <p class="listLeft">投资理财创利</p>
                        <p class="listRight">{{InvestmentScore | initPoints}}<span class="icon icon-arrowLg-r"></span></p>
                    </li>
                    <li @click="gooToPointHtml('investmentBenifits')">
                        <p class="listLeft">存款创利</p>
                        <p class="listRight">{{DepositScore | initPoints}}<span class="icon icon-arrowLg-r"></span></p>
                    </li>
                </ul>
            </div>
        </section>
        <!--个人积分弹窗-->
        <article v-show="showCustomernteractionExplainModal" class="personalIntegration-dialog dialog-area">
            <div class="personalIntegration-dialogMain">
                <h2>产品销售积分说明</h2>
                <div class="personalIntegration-dialogContent">
                    <dl>
                        <dt>投资理财创利:</dt>
                        <dd>每万元创利可得{{InvestmentVal | initPoints}}分。</dd>
                    </dl>
                    <dl>
                        <dt>存款创利:</dt>
                        <dd>每万元创利可得{{DepositVal | initPoints}}分。大额存单计给销售人，其他按创利5折计给管户人。</dd>
                    </dl>
                </div>
                <div class="personalIntegration-dialogBtn" @click="hiddenCustomernteractionExplainModal">
                    <button>知道了</button>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
    require("../../../modulecss/moduleSalespoints.css");
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
                aladdin.loading.stop({canCancel: false});
//                aladdin.aike_tool.getTicket(function (err, ticket) {
//                    var umAccount='';
//                    if (err && !ticket) {
//                        aladdin.toast.show({message: err.message});
//                        // alert("ticket=="+ticket);
//                    } else {
                        aladdin.loading.stop({canCancel: false});
                        aladdinRequestData({
                            url:'regimentLeader/getRegimentScore.do',
                            type: 'POST',
                            data: {
                                //TODO
                                'ticket':'',
                                'userId': 'SHIXIAOYE002',//ticket,
                                'date': date,//日期 YYYY-MM/YYYY-MM-DD
                                'inputType': '私行团队长|财富团队长'
                            },
                            beforeSend:  {
                                //brcpSessionTicket
                                //deviceId

//                		request.setRequestHeader("brcpEaSessionTicket",  ticket);
                                'brcpEaSessionTicket':''
                            },
                            success: function(err,res) {
                                aladdin.loading.stop();
                                if(err){
                                    aladdin.toast.show({message: '加载错误 '});
                                    aladdin.loading.stop({canCancel: false});
                                    _self.actionPoints = '--';
                                    _self.responsePointsList = [];
                                    _self.sention1 = [];
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
                                }

                                if(result.responseCode==0){
                                    var investmentScore = result.touzi;
                                    var depositScore = result.cunkuan;
                                    var investmentVal= result.touziScore;
                                    var depositVal = result.cunkuanScore;
                                    var total = result.scoreSum;
                                    var period = result.Stat_date;

                                    _self.Period = period;

                                    _self.InvestmentScore = investmentScore;
                                    _self.DepositScore = depositScore;
                                    _self.InvestmentVal = investmentVal;
                                    _self.DepositVal = depositVal;
                                    _self.actionPoints = total;
                                }


//                            }
//
//                        });
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
            },
            rightDateSelect(){
                var date = new Date(this.date.year,this.date.month-1,this.date.day);
                date.setMonth(date.getMonth()+1);

                let year = date.getFullYear();
                let month = date.getMonth()+1+'';
                let day = date.getDate();
                var nowDate = new Date();
                this.date = {
                    year:year,
                    month:month,
                    day:day,
                }
                if(month.length == 1)
                {
                    month = '0'+month;
                }
                var dateTime =year.toString() + month;
                if(this.date.year == nowDate.getFullYear()){
                    if(this.date.month > nowDate.getMonth()+1){
                        this.date.month = nowDate.getMonth()+1;
                        this.isCenterRight = false;
                    }else if (this.date.month == nowDate.getMonth()+1){
                        this.isCenterRight = false;
                        this.queryResponsePoints(dateTime);
                    }else {
                        this.queryResponsePoints(dateTime);
                    };

                }else {
                    this.queryResponsePoints(dateTime);
                };
                var nowMonth = this.date.month + '';
                if(nowMonth.length == 1)
                {
                    nowMonth = '0'+nowMonth;
                }
                this.currentDate = year + '年'+nowMonth+'月';
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
                debugger;

                var dateTime =year.toString() + month;
                this.queryResponsePoints(dateTime);
                var nowDate = new Date();
                if(this.date.year == nowDate.getFullYear()){
                    if(this.date.month >= nowDate.getMonth()+1){
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
                    this.$router.push({path: '/investmentBenifitsTeamer',query: {
                        dateTime:date + month
                    }});
                }
                aladdin.Header.forward({url: url});
            }

        },
        data(){
            return{
                date: {
                    year: 2016,
                    month: 1,
                    day: 1
                },
                imgRightUrl:require('../../../images/rightArrow.png'),
                imgLeftUrl:require('../../../images/leftArrow.png'),
                isCenter:false,
                isCenterLeft:true,
                isCenterRight:true,
                actionPoints:'',
                currentDate:'',
                showDateSelect:false,
                showCustomernteractionExplainModal:false,
                explainModalTitle:'',
                InvestmentScore: '',
                DepositScore: '',
                InvestmentVal: '',
                DepositVal: '',
                Period:'',
                responsePointsList:[
                    {
                        "actionDefineName": "投资理财创利",//完成率
                        "points": "--",
                    },
                    {
                        "actionDefineName": "存款创利",//完成率
                        "points": "--",
                    }
                ],

//                productSalesList:[
//                    {
//                        'productSalesTitle':'投资理财创利',
//                        'productSalesDetails':'每万元创利可得--分',
//                    },
//                    {
//                        'productSalesTitle':'存款创利',
//                        'productSalesDetails':'每万元创利可得--分。大额存单计给销售人，其他按创利5折计给管户人。'
//                    }
//                ]
            }

        },
        mounted () {
            aladdin.loading.start({canCancel: false});

            var thisURL = document.URL;
            var getval = thisURL.split('?')[1];
            var mapDateTime = getval.split("=")[1];
            var date = new Date();
            if (mapDateTime) {
                var mapYear = mapDateTime.substring(0, 4);
                var mapMonth = mapDateTime.substring(5, 6);
                this.date.month = parseInt(mapMonth);
                this.date.year = parseInt(mapYear);
//                this.date = {
//                    year: parseInt(mapMonth),
//                    month: parseInt(mapYear),
//                    day:date.getDate()
//                };
                var month = mapMonth + '';
                if (month.length == 1) {
                    month = '0' + month;
                }
                this.queryResponsePoints(mapDateTime);
                this.currentDate = mapYear + '年' + month + '月'
            } else {
                var month = date.getMonth() + 1 + '';
                if (month.length == 1) {
                    month = '0' + month;
                }
                var dateTime = date.getFullYear().toString() + month;
//            var dateTime = date.format("YYYYMM");
                console.log('dateTime=' + dateTime);
                this.queryResponsePoints(dateTime);
                this.date = {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                };

                this.currentDate = this.date.year + '年' + month + '月'
            }
            if (this.date.year == date.getFullYear()) {
                if (this.date.month == date.getMonth() + 1) {
                    this.isCenterRight = false;
                }
            }

            //调用原生app头部
            var url = '/sicaih5/dist/module/mine.html#/problemFeedback?type=personalScore';
            var rightButtonCallback = function () {
                aladdin.Header.forward({url: url});
            };
            rightButtonCallback.keep = true;
            aladdin.Header.config({
                title: '个人积分',
                rightButtonVisible: true,
                rightButtonText: '问题反馈',
                rightButtonFontSize: '16px',
                rightButtonCallback: rightButtonCallback
            });
        },
        filters:{
            initPoints(points){
                if (points){
                    return points;
                }else {
                    return '--';
                }
            }
        }

    }

</script>