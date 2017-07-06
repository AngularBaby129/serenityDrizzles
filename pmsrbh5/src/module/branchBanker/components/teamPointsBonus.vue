<template>

    <section class="personalPointsBonus-wrapper">
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
        <ul class="personalPointsBonus-tips">
            <li>团队积分奖金=MAX（下辖人员积分奖金和*20%，下辖人员人均积分奖金）</li>
            <li>人员积分奖金=关键积分奖金*月度系数*奖励金分奖金 </li>
        </ul>
        <div class="teamPointsBonus-main">
            <div class="teamPointsBonus-content">
                <h2 class="teamPointsBonus-contentTitle">
                    <p class="titleLeft">下属成员</p>
                    <p class="titleRight">总积分奖金（元）</p>
                </h2>
                <div class="teamPointsBonus-contentList" v-for=" item in responsePointsList">
                    <h3 class="teamPointsBonus-contentSubTitle">
                        <p class="subTitleLeft">{{item.actionDefineName}}</p>
                        <mark>{{item.actionDefinePoints | initPoints}}</mark>
                    </h3>
                    <ul class="teamPointsBonus-contentInner">
                        <li>
                            <p>月度系数</p>
                            <mark @click="gooToPointHtml('monthDataPoints',item.actionDefineName)">{{item.monthDataPoints | initPoints}} &gt;</mark>
                        </li>
                        <li>
                            <p>关键积分</p>
                            <mark @click="gooToPointHtml('importantScorePoints',item.actionDefineName)">{{item.importantScorePoints | initPoints}} &gt;</mark>
                        </li>
                        <li>
                            <p>奖励积分</p>
                            <mark @click="gooToPointHtml('bonusScorePoints',item.actionDefineName)">{{item.bonusScorePoints | initPoints}} &gt;</mark>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
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

//                aladdin.aike_tool.getTicket(function (err, ticket) {
//                    var umAccount='';
//                    if (err && !ticket) {
//                        aladdin.toast.show({message: err.message});
//                        // alert("ticket=="+ticket);
//                    } else {

                        aladdinRequestData({
                            url:'subbranchManager/getTeamScoreBonus.do',
                            type: 'POST',
                            data: {
                                //TODO
                                'ticket':'',
                                'userId': 'CUIZHENG618',//ticket,
                                'date': date,//日期 YYYY-MM/YYYY-MM-DD
                                'inputType':'支行行长'
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
                                    return;
                                }
                                _self.actionPoints = '--';
                                _self.responsePointsList = [];
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

                                var listUser = result.listUser

                                if(result.responseCode==0){
                                    if(listUser !=null && listUser !=undefined && listUser !="" ){
                                        var responseArray = [];
                                       $.each(listUser,function (i,item) {
                                           var responsePointsListobj = {};
                                           responsePointsListobj.actionDefineName = item.NAME;
                                           responsePointsListobj.actionDefinePoints = item.BONUS_MUN;
                                           responsePointsListobj.monthDataPoints = item.MONTH_BONUS_ATTR;
                                           responsePointsListobj.importantScorePoints = item.KEY_POINTS;
                                           responsePointsListobj.bonusScorePoints = item.REWARD_POINTS;
                                           responseArray.push(responsePointsListobj);
                                       })
                                        _self.responsePointsList = responseArray;
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
            gooToPointHtml(type,name){
                let url = '';
                var month = '0'+this.date.month;
//                debugger;
                let nameNow = encodeURI(encodeURI(name));
                let date = this.date.year.toString();
                if(type == 'monthDataPoints'){
                    url = '../parameter/currentData.html?name='+nameNow+'&dateTime='+date + month+'&umAccount='+umAccount+'&teamFlg=1';
                }else if(type == 'importantScorePoints'){
                    url = '../salespoints/importantScore.html?name='+nameNow+'&dateTime='+date + month+'&umAccount='+umAccount+'&teamFlg=1';
                }else if(type == 'bonusScorePoints'){
                    url = '../salespoints/bonusScore.html?name='+ nameNow+'&dateTime='+date + month+'&umAccount='+umAccount+'&teamFlg=1';
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

                responsePointsList:[
//                    {
//                        "actionDefineName": "雷利斌1",//完成率
//                        "actionDefinePoints": "0",
//                        "monthDataPoints": "0",
//                        "importantScorePoints": "0",
//                        "bonusScorePoints": "0",
//                    },
//                    {
//                        "actionDefineName": "雷利斌2",//完成率
//                        "actionDefinePoints": "0",
//                        "monthDataPoints": "0",
//                        "importantScorePoints": "0",
//                        "bonusScorePoints": "0",
//                    },
//                    {
//                        "actionDefineName": "雷利斌3",//完成率
//                        "actionDefinePoints": "0",
//                        "monthDataPoints": "0",
//                        "importantScorePoints": "0",
//                        "bonusScorePoints": "0",
//                    },
//                    {
//                        "actionDefineName": "雷利斌4",//完成率
//                        "actionDefinePoints": "0",
//                        "monthDataPoints": "0",
//                        "importantScorePoints": "0",
//                        "bonusScorePoints": "0",
//                    }
                ]
            }

        },
        mounted () {
            aladdin.loading.start({canCancel: false});
            var thisURL = document.URL;
            var getval =thisURL.split('?')[1];
            var mapDateTime= getval.split("=")[1];

            var date = new Date();
            let _self = this;
            if (mapDateTime){
                var mapYear = mapDateTime.substring(0,4);
                var mapMonth = mapDateTime.substring(5,6);
                this.date.month = parseInt(mapMonth);
                this.date.year = parseInt(mapYear);
                this.date.day = date.getDate();
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
            //调用原生app头部
            var url = '/sicaih5/dist/module/mine.html#/problemFeedback?type=teamPointsBonus';
            var rightButtonCallback = function () {
                aladdin.Header.forward({url: url});
            };
            rightButtonCallback.keep = true;
            aladdin.Header.config({
                title: '团队积分奖金',
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
    /**样式表**/
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