<template>
        <div class="wrap resScore">
            <section class="kindsIntegration-wrapper">
                <div class="modal" v-if="showDateSelect">
                    <ScoreDateSelectNew :date="date" :flag="true"  @cancel="showDateSelect=false" @selectMonth="selectMonth"></ScoreDateSelectNew>
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
                    <li>最近更新日期{{Period}}</li>
                </ul>
                <div class="kindsIntegration-content">
                    <ul class="kindsIntegration-contentList teamIntegration-contentList" >
                        <li>
                            <p class="listLeft">团队成员</p>
                            <p class="listRight">关键积分</p>
                        </li>
                        <li  v-for="item in responsePointsList">
                            <p class="listLeft">{{item.Name}}</p>
                            <p class="listRight">{{item.Score | initPoints}}<span class="icon icon-arrowLg-r" @click="gooToPointHtml(item.Name)"></span></p>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
</template>

<script>
    require("../../../modulecss/moduleSalespoints.css");
    require("../../../modulecss/moduleBonus.css");

    import ScoreDateSelectNew from '../../../components/ScoreDateSelectNew.vue'

    export default {
        components:{
            ScoreDateSelectNew
        },
        methods:{
            queryResponsePoints(date) {
                let _self = this;
                aladdin.loading.start({canCancel: false}, function (err) {
                    if(err){
                        aladdin.toast.show({message: '加载进度框显示错误 '});

                    }
                });
                aladdin.loading.stop();
//                aladdin.aike_tool.getTicket(function (err, ticket) {
//                    var umAccount='';
//                    if (err && !ticket) {
//                        aladdin.toast.show({message: err.message});
//                        // alert("ticket=="+ticket);
//                    } else {

                        aladdinRequestData({
                            url:'regimentLeader/getTeamScore.do',
                            type: 'POST',
                            data: {
                                //TODO
                                'ticket':'',
                                'userId': 'SHIXIAOYE002',//ticket,
                                'date': date,//日期 YYYY-MM/YYYY-MM-DD
                                'inputType': '私行团队长|财富团队长'

                            },
                            beforeSend:  {
                                'brcpEaSessionTicket':''
                            },
                            success: function(err,res) {
                                aladdin.loading.stop();
                                if(err){
                                    aladdin.toast.show({message: '加载错误 '});
                                    aladdin.loading.stop({canCancel: false});
                                    _self.actionPoints = '--';
                                    _self.responsePointsList = [];
//                                    _self.sention1 = [];
                                    return;
                                }
                                _self.actionPoints = '--';
                                _self.responsePointsList = [];
                                _self.sention1 = [];
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
                                    _self.actionPoints = '--';
                                    _self.responsePointsList = [];
//                                    _self.sention1 = [];
                                    return;
                                }

                                var total = result.teamRewardPointSum;
                                var importantList = result.teanList;
                                var period = result.Stat_date;



                                if(result.responseCode==0){
                                    for(var i=0; i<importantList.length; i++){
                                        var newArray=[];
                                        var newObj={};
                                        newObj.Name = importantList[i].NAME;
                                        newObj.Score = importantList[i].KEY_POINTS;
                                        newArray.push(newObj)
                                    }
                                    _self.responsePointsList = newArray;
                                    _self.actionPoints = total;
                                    _self.Period = period;

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
            gooToPointHtml(name){
                let url = '';
                var month = '0'+this.date.month;
        //                debugger;
                let nameNow = encodeURI(encodeURI(name));

                let date = this.date.year.toString();
                url = '../salespoints/bonusScore.html?name='+nameNow+'&dateTime='+date + month;
                aladdin.Header.forward({url: url});
            },
        },

        data(){
            return{
                date: {
                    year: 2016,
                    month: 1,
                    day: 1
                },
                /*year:0,
                 month:0,
                 day:0*/
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
                Period:'',


                responsePointsList:[
//                    {
//                        "actionDefineName": "<30%",//完成率
//                        "hereFlag":"-1",
//                        "points": "0",
//                    },
//                    {
//                        "actionDefineName": "<",
//                        "points": "--",
//                        "hereFlag":"--",
//                    },

                ],

            }

        },
        mounted () {
            aladdin.loading.start({canCancel: false});

            var thisURL = document.URL;
            var  getval =thisURL.split('?')[1];
            var mapDateTime= getval.split("=")[1];
            var date = new Date();
            if (mapDateTime){
                var mapYear = mapDateTime.substring(0,4);
                var mapMonth = mapDateTime.substring(5,6);
                this.date.month = parseInt(mapMonth);
                this.date.year = parseInt(mapYear);
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
                var month = date.getMonth()+1+'';
                if(month.length == 1)
                {
                    month = '0'+month;
                }
                var dateTime =date.getFullYear().toString() + month;
//            var dateTime = date.format("YYYYMM");
                console.log('dateTime='+dateTime);
                this.queryResponsePoints(dateTime);
                this.date = {
                    year: date.getFullYear(),
                    month: date.getMonth()+1,
                    day: date.getDate()
                };

                this.currentDate = this.date.year + '年'+month + '月'
            }
            if(this.date.year == date.getFullYear()){
                if(this.date.month == date.getMonth()+1){
                    this.isCenterRight = false;
                };

            };

            var url = '/sicaih5/dist/module/mine.html#/problemFeedback?type=teamBonusScore';
            var rightButtonCallback = function () {
                aladdin.header.forward({url: url});
            };
            rightButtonCallback.keep = true;
            aladdin.Header.config({
                title: '团队奖励积分',
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

