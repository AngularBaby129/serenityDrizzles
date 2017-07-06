<template>
        <section class="presentFactor-wrapper">
            <div class="modal" v-if="showDateSelect">
                <ScoreDateSelect :date="date" :flag="true" @cancel="showDateSelect=false"
                                 @selectMonth="selectMonth"></ScoreDateSelect>
            </div>
            <dl class="presentFactor-top">
                <dt>
                    <span class="icon icon-arrowCircle-r " :class="isCenterLeft?'active':''"
                          @click="leftDateSelect"></span>
                    <span class="leftTxt" @click="showDateSelectComponent">{{currentDate}}</span>
                    <span class="icon icon-arrowCircle-r " :class="isCenterRight?'active':''"
                          @click="rightDateSelect"></span>
                </dt>
                <dd><span class="orangeFont">{{actionPoints | initPoints}}</span>元</dd>
            </dl>
            <ul class="presentFactor-tips">
                <li>最近更新日期{{Period}}</li>
                <li>月度奖金=【（团队总关键积分*目前系数+团队总奖励积分）*20%
                    +个人积分】*积分单价
                </li>
                <li>目前系数=奖励系数*产能达标系数</li>
            </ul>
            <div class="presentFactor-content">
                <h2>奖励系数</h2>
                <ul class="presentFactor-contentList">
                    <li>
                        <div>
                            <p class="listLeft">团队关键积分</p>
                            <span class="listRight">系数</span>
                        </div>
                    </li>
                    <li v-for="item in responsePointsList" >
                        <div :class="item.hereFlag == true?'blueList':'normalList'">
                            <p class="listLeft ">{{item.actionDefineName}}<span v-show="item.hereFlag==true" class="youHereIcon"></span></p>
                            <span class="listRight">{{item.points}}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="presentFactor-content mt20">
                <h2>产品达标系数</h2>
                <ul class="presentFactor-contentList">
                    <li>
                        <div>
                            <p class="listLeft">产品达标系数</p>
                            <span class="listRight">系数</span>
                        </div>
                    </li>
                    <li v-for="item in sention1" >
                        <div :class="item.hereFlag == true?'blueList':''">
                            <p class="listLeft ">{{item.actionDefineName}}<i v-show="item.hereFlag==true" class="youAreHere"></i></p>
                            <span class="listRight">{{item.points}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
</template>

<script>
    require("../../../modulecss/moduleParameter.css");

    import ScoreDateSelect from '../../../components/ScoreDateSelectNew.vue'

    export default {
        components: {
            ScoreDateSelect
        },
        methods: {
            queryResponsePoints(date) {
                let _self = this;
                aladdin.loading.start({canCancel: false}, function (err) {
                    if (err) {
                        aladdin.toast.show({message: '加载进度框显示错误 '});

                    }
                });
//                aladdin.aike_tool.getTicket(function (err, ticket) {
//                    var umAccount = '';
//                    if (err && !ticket) {
//                        aladdin.toast.show({message: err.message});
//                        // alert("ticket=="+ticket);
//                    } else {

                        aladdinRequestData({
                            url: 'regimentLeader/getCurrCoefficient.do',
                            type: 'POST',
                            data: {
                                //TODO
                                'ticket':'',
                                'userId': 'SHIXIAOYE002',//ticket,
                                'date': '201705',//日期 YYYY-MM/YYYY-MM-DD
                                'inputType': '私行团队长|财富团队长'
                            },
                            beforeSend: {
                                'brcpEaSessionTicket': ''
                            },
                            success: function (err, res) {
                                aladdin.loading.stop();
                                if (err) {
                                    aladdin.toast.show({message: '加载错误 '});
                                    aladdin.loading.stop({canCancel: false});
                                    _self.actionPoints = '--';
                                    _self.responsePointsList = [];
                                    _self.sention1 = [];
                                    return;
                                }
                                _self.actionPoints = '--';
                                _self.responsePointsList = [];
                                _self.sention1 = [];
                                let result = res.body;
                                result = eval("(" + result + ")");
                                if (result.responseCode != 0) {
                                    if (result.responseCode == "900108") {
                                        aladdin.toast.show({message: '该用户当月无数据'});
                                    } else if(result.responseCode == "900120"){
                                        aladdin.toast.show({ message:'当前月份的用户角色发生变更，请切换到业绩主页查询'});
                                    } else {
                                        aladdin.toast.show({message: '系统错误'});
                                    }
                                    return;
                                }
                                if (result.responseCode == 0) {
                                    var aun = result.rewardStandard;//奖励系数
                                    var mun = result.reachStandard;//产能达标系数
                                    var channelType = result.channelType;
                                    var total = result.coefficient;
                                    var period = result.Stat_date;
                                    _self.actionPoints = total;
                                    _self.Period = period;

                                    //判断用户为角色
                                    if (channelType == "私行团队长" || channelType == "财富团队长") {

                                        if (aun != null && aun.length > 0) {
                                            var newArray = [];

                                            for (var i = 0; i < aun.length; i++) {
                                                var index = aun[i].index;
                                                var responsePointsListobj = {};

                                                if(index == 0){
                                                    responsePointsListobj.actionDefineName = "<标准值的30%(完成率)";
                                                    responsePointsListobj.points = aun[i].RESERVE_NUM1;
                                                    responsePointsListobj.hereFlag = aun[i].flag;
                                                    newArray[index] = responsePointsListobj;
                                                }else if (index == 1) {
                                                    responsePointsListobj.actionDefineName = "<" + aun[1].RANG_UPP_LIMIT;
                                                    responsePointsListobj.points = aun[i].RESERVE_NUM1;
                                                    responsePointsListobj.hereFlag = aun[i].flag;
                                                    newArray[index] = responsePointsListobj;
                                                    //newArray[1]=responsePointsListobj;
                                                }else if (index < aun.length-1 && index > 1) {
                                                    responsePointsListobj.actionDefineName = "[" + aun[i].RANG_LOW_LIMIT + ',' + aun[i].RANG_UPP_LIMIT + ')';
                                                    responsePointsListobj.points = aun[i].RESERVE_NUM1;
                                                    responsePointsListobj.hereFlag = aun[i].flag;
                                                    newArray[index] = responsePointsListobj;

                                                }else if (index == aun.length-1) {
                                                    responsePointsListobj.actionDefineName = ">=" + aun[i].RANG_LOW_LIMIT;
                                                    responsePointsListobj.points = aun[i].RESERVE_NUM1;
                                                    responsePointsListobj.hereFlag = aun[i ].flag;
                                                    newArray[index] = responsePointsListobj;
                                                }
//                                                    newArray.push(responsePointsListobj);


                                            }
                                            _self.responsePointsList = newArray;
                                        }

                                        if (mun != null && mun.length > 0) {
                                            var munArray = [];

                                            for (var i = 0; i < mun.length; i++) {
                                                var sention1obj = {};
//                                            var rangLowLimit=mun[i].RANG_LOW_LIMIT;
//                                            var rangUppLimit=mun[i].RANG_UPP_LIMIT;
//                                            var points=mun[i].RESERVE_NUM1;

                                                if (mun[i].index == 0) {
                                                    sention1obj.actionDefineName = "<" + mun[0].RANG_UPP_LIMIT;
                                                    sention1obj.points = mun[0].RESERVE_NUM1;
                                                    sention1obj.hereFlag = mun[0].flag;
                                                }
                                                if (mun[i].index < mun.length - 1 && mun[i].index > 0) {
                                                    sention1obj.actionDefineName = '[' + mun[i].RANG_LOW_LIMIT + ',' + mun[i].RANG_UPP_LIMIT + ')';
                                                    sention1obj.points = mun[i].RESERVE_NUM1;
                                                    sention1obj.hereFlag = mun[i].flag;
                                                }
                                                if (mun[i].index == mun.length - 1) {
                                                    sention1obj.actionDefineName = '>=' + mun[mun.length - 1].RANG_LOW_LIMIT
                                                    sention1obj.points = mun[mun.length - 1].RESERVE_NUM1;
                                                    sention1obj.hereFlag = mun[mun.length - 1].flag;
                                                }
                                                munArray.push(sention1obj);
                                            }
                                            _self.sention1 = munArray;
                                        }
                                    }
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

            }
        },
        data(){
            return {
                date: {
                    year: 2016,
                    month: 1,
                    day: 1
                },
                /*year:0,
                 month:0,
                 day:0*/
                imgRightUrl: require('../../../images/rightArrow.png'),
                imgLeftUrl: require('../../../images/leftArrow.png'),
                isCenter: false,
                isCenterLeft:true,
                isCenterRight:true,
                actionPoints: '',
                currentDate: '',
                showDateSelect: false,
                showCustomernteractionExplainModal: false,
                explainModalTitle: '',
                Period:'',


                responsePointsList: [
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
//                    {
//                        "actionDefineName": "--",
//                        "points": "--",
//                        "hereFlag":"--",
//                    },
//                    {
//                        "actionDefineName": "--",
//                        "points": "--",
//                        "hereFlag":"--",
//                    }
                ],
                sention1: [
//                            {
//                                'actionDefineName':'--',
//                                "hereFlag":"--",
//                                'points':'--'
//                            },
//                            {
//                                'actionDefineName':'--',
//                                "hereFlag":"--",
//                                'points':'--'
//                            },
//                            {
//                                'actionDefineName':'--',
//                                "hereFlag":"--",
//                                'points':'--'
//                            },
//                            {
//                                'actionDefineName':'--',
//                                "hereFlag":"--",
//                                'points':'--'
//                            },
                ]
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

            var url = '/sicaih5/dist/module/mine.html#/problemFeedback?type=presentFactor';
            var rightButtonCallback = function () {
                aladdin.Header.forward({url: url});
            };
            rightButtonCallback.keep = true;
            aladdin.Header.config({
                title: '目前系数',
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
<style>
    .normalList {
        padding: .26rem 0;
        display: -webkit-box;
        display: -moz-box;
        -moz-box-pack: start;
        -webkit-box-pack: start;
        -moz-box-align: center;
        -webkit-box-align: center;
        border-bottom: 1px solid #ebebeb;
    }

    /*.modal{*/
        /*position:fixed;*/
        /*top:0;*/
        /*left: 0;*/
        /*width: 100%;*/
        /*height: 100%;*/
        /*z-index: 10000;*/
        /*background-color:rgba(0,0,0,0.5);*/
        /*display:flex;*/
        /*justify-content: center;*/
        /*align-items: center;*/
    /*}*/
</style>