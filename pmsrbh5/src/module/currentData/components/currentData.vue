<template>
        <div class="wrap resScore">
            <div class="main ">
                <div class="container">
                    <div class="modal" v-if="showDateSelect">
                        <ScoreDateSelect :date="date" :flag="true"  @cancel="showDateSelect=false" @selectMonth="selectMonth"></ScoreDateSelect>
                    </div>
                    <div class="scrollview">
                        <div class="date">
                            <div class="dateSelect">
                                <div class = "leftSelect" @click="leftDateSelect">
                                    <img :src='imgLeftUrl'>
                                </div>
                                <div class = "dateText" @click="showDateSelectComponent">{{currentDate}}</div>
                                <div class="rightSelect" @click="rightDateSelect">
                                    <img :src='imgRightUrl'>
                                </div>
                            </div>
                            <div class="score">
                                {{actionPoints}}
                            </div>
                        </div>
                        <div class="customernteraction">
                            <div id="titles">
                                <div>月度奖金=(关键积分得分*目前系数+奖励积分得分)*积分单价</br></div>
                                <div id="title_first">目前系数=月度奖励系数*AUM调节系数</div>
                            </div>
                            <div class="section section_a">
                        <span>
                            <span class="sectionTitle">月度奖励系数</span>
                        </span>
                            </div>
                            <div class="cell1">
                                <ul>
                                    <li>
                                        <div>
                                            <span class="spanTitle">关键积分</span>
                                            <span class="spansScore">
                                                <span class="dataStyle">系数</span>
                                            </span>
                                        </div>
                                    </li>
                                    <li v-for="item in responsePointsList" >
                                        <div :class="item.hereFlag == item.points?'gaoliang':'bugaoliang'">
                                            <span   :class="item.hereFlag == item.points?'gaoliang1':'bugaoliang'" class="spanTitle" >{{item.actionDefineName}}<i v-show="item.hereFlag==item.points" class="youAreHere"></i></span>
                                            <span class="spanScore">
                                                <span class="dataStyle">{{item.points}}</span>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="quality">
                            <div class="section section_b">
                         <span>
                            <span class="sectionTitle">AUM调节系数</span>
                        </span>
                            </div>
                            <div class="cell1">
                                <ul>
                                    <li >
                                        <div>
                                            <span class="spanTitle">AUM日均净值(百万)</span>
                                            <span class="spansScore">
                                                <span class="dataStyle">系数</span>
                                            </span>
                                        </div>
                                    </li>
                                    <li v-for="item in sention1">
                                        <div :class="item.hereFlag == item.points?'gaoliang':'bugaoliang'">
                                            <span :class="item.hereFlag == item.points?'gaoliang1':'bugaoliang'" class="spanTitle">{{item.actionDefineName}}<i v-show="item.hereFlag==item.points" class="youAreHere"></i></span>
                                            <span class="spanScore">
                                                <span class="dataStyle">{{item.points}}</span>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
    require("../../../main.css");
    require("../../../mine.css");
    import ScoreDateSelect from '../../../components/ScoreDateSelect.vue'

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
                            url:'parameter/bonusMonthInfApp.do',
                            type: 'POST',
                            data: {
                                //TODO
                                'ticket':ticket,
                                'umAccount': umAccount,//ticket,
                                'date': date,//日期 YYYY-MM/YYYY-MM-DD
                            },
                            beforeSend:  {
                                //brcpSessionTicket
                                //deviceId

//                		request.setRequestHeader("brcpEaSessionTicket",  ticket);
                                'brcpEaSessionTicket':ticket
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
                                _self.actionPoints = '--';
                                _self.responsePointsList = [];
                                _self.sention1 = [];
                                let result = res.body;
                                result = eval("("+result+")");
                                if (result.responseCode != 0){
                                    if(result.responseCode == "900108"){
                                        aladdin.toast.show({ message:'该用户当月无数据'});
                                    }else{
                                        aladdin.toast.show({ message:'系统错误'});
                                    }
//                                    _self.actionPoints = '--';
//                                    _self.responsePointsList = [];
//                                    _self.sention1 = [];
                                    return;
                                }

                                var aun = result.bonusMonthInfs;//月度
                                var mun = result.aumInfs;//aum
                                var outOfLint = result.outOfLint;
                                var rangUpLimit = result.complate * 100;//完成率
                                var channelType = "";

                                if(result.responseCode==0){
                                    if(aun !=null && aun !=undefined && aun !="" ){
                                        // alert(2)
                                        channelType =  aun[0].channelType;
                                    }
                                    //判断用户为角色为PB或RM
                                    if(channelType=="PB" || channelType=="RM"){
                                        var newArray = [];
                                        if(aun!=null && aun.length>0){
                                            if(outOfLint ==null || outOfLint ==undefined || outOfLint ==="" || outOfLint==0){
                                                var responsePointsListobj = {};
                                                responsePointsListobj.actionDefineName = "<"+rangUpLimit+'%(完成率)';
                                                responsePointsListobj.points = 0;
                                                responsePointsListobj.hereFlag = 0;
                                                newArray[0]=responsePointsListobj;
                                            }else{
                                                var responsePointsListobj = {};
                                                responsePointsListobj.actionDefineName = "<"+rangUpLimit+'%(完成率)';
                                                responsePointsListobj.points = 0;
                                                responsePointsListobj.hereFlag = 1;
                                                newArray[0]=responsePointsListobj;
                                            }

                                            for(var i=0;i<= aun.length-1;i++){
                                                var responsePointsListobj = {};
//                                                var rangLowLimit=aun[i].rangLowLimit;
//                                                var rangUppLimit=aun[i].rangUppLimit;
                                                //var points = aun[i].points;
                                               // _self.hereFlag = aun[1].flag;

                                                if(aun[i].number == 0){
                                                    responsePointsListobj.actionDefineName = "<"+aun[0].rangUppLimit;
                                                    responsePointsListobj.points = aun[0].points;
                                                    responsePointsListobj.hereFlag = aun[0].flag;
                                                    //newArray[1]=responsePointsListobj;
                                                }
//

                                                if(aun[i].number<aun.length-1 && aun[i].number>0){
                                                    responsePointsListobj.actionDefineName = "["+aun[i].rangLowLimit+','+aun[i].rangUppLimit+')';
                                                    responsePointsListobj.points = aun[i].points;
                                                    responsePointsListobj.hereFlag = aun[i].flag;

                                                }
//

                                                if(aun[i].number==aun.length-1){
                                                    responsePointsListobj.actionDefineName = ">="+aun[aun.length-1].rangLowLimit;
                                                    responsePointsListobj.points = aun[aun.length-1].points;
                                                    responsePointsListobj.hereFlag = aun[aun.length-1].flag;
                                                   // newArray[aun.length-1]=responsePointsListobj;
                                                }
                                                if(newArray.length>0){
                                                    newArray[i+1]=responsePointsListobj;
                                                }else{
                                                    newArray.push(responsePointsListobj);
                                                }

                                            }
                                            _self.responsePointsList = newArray;
                                        }

                                        console.log(newArray);
                                        if(mun!=null && mun.length>0) {
                                            var munArray = [];

                                            for (var i = 0; i < mun.length; i++) {
                                                var sention1obj = {};
//                                            var rangLowLimit=mun[i].rangLowLimit;
//                                            var rangUppLimit=mun[i].rangUppLimit;
//                                            var points=mun[i].points;

                                                if (mun[i].number == 0) {
                                                    sention1obj.actionDefineName = "<" + mun[0].rangUppLimit;
                                                    sention1obj.points = mun[0].points;
                                                    sention1obj.hereFlag = mun[0].flag;
                                                }
                                                if (mun[i].number<mun.length-1 && mun[i].number>0) {
                                                    sention1obj.actionDefineName = '[' + mun[i].rangLowLimit + ',' + mun[i].rangUppLimit + ')';
                                                    sention1obj.points = mun[i].points;
                                                    sention1obj.hereFlag = mun[i].flag;
                                                }
                                                if (mun[i].number == mun.length - 1) {
                                                    sention1obj.actionDefineName = '>=' + mun[mun.length - 1].rangLowLimit
                                                    sention1obj.points = mun[mun.length - 1].points;
                                                    sention1obj.hereFlag = mun[mun.length - 1].flag;
                                                }
                                                munArray.push(sention1obj);
                                            }
                                            _self.sention1=munArray;
                                        }

                                        console.log(munArray);

                                        if(outOfLint !=null && outOfLint !=undefined && outOfLint !=="" && outOfLint==1){
                                            var total =  result.total;
                                            _self.actionPoints=total;
                                        } else if(outOfLint !=null && outOfLint !=undefined && outOfLint !=="" && outOfLint==0){
                                            var total=0;
                                            _self.actionPoints=total;
                                        }else{
                                            var total='--';
                                            _self.actionPoints=total;
                                        }
                                    }else if(channelType=="WSM"){
                                        //判断用户为角色WSM

                                        var aunArray=[];
                                        var responsePointsListOBJ={};
                                        var rangLowLimit=aun[i].rangLowLimit;
                                        var rangUppLimit=aun[i].rangUppLimit;
                                        var points=mun[i].points;

                                        if(aun!=null && aun.length>0){
                                            var outNum=0;
                                            if(outOfLint !=null && outOfLint !=undefined && outOfLint !=="" && outOfLint==0){
                                                responsePointsListOBJ.actionDefineName = "<"+rangUpLimit+'%(完成率)';
                                                responsePointsListOBJ.points = outNum;
                                            }
                                            aunArray.push(responsePointsListOBJ);

                                            if(aun[0].flag==aun[0].points){
                                                responsePointsListOBJ.actionDefineName = "<"+aun[0].rangUppLimit;
                                                responsePointsListOBJ.points = aun[i].points;
                                            }
                                            for(var i=1;i< aun.length-1;i++){
                                                responsePointsListOBJ.actionDefineName = '['+rangLowLimit+','+rangUppLimit+')';
                                                responsePointsListOBJ.points = aun[i].points;
                                            }

                                            if(i=aun.length-1){
                                                responsePointsListOBJ.actionDefineName = '>='+aun[aun.length-1].rangLowLimit;
                                                responsePointsListOBJ.points = aun[aun.length-1].points;
                                            }
                                            aunArray.push(responsePointsListOBJ);
                                        }
                                        _self.responsePointsList=aunArray;



                                        if(outOfLint !=null && outOfLint !=undefined && outOfLint !=="" && outOfLint==1){
                                            total =  result.total;
                                            _self.actionPoints=total;
                                        } else if(outOfLint !=null && outOfLint !=undefined && outOfLint !=="" && outOfLint==0){
                                            total=0;
                                            _self.actionPoints=total;

                                        }else{
                                            total='--';
                                            _self.actionPoints=total;
                                        }

                                    }
                                }


                            }

                        });
                    }
                });
            },
            leftDateSelect(){
                var date = new Date(this.date.year,this.date.month-1,this.date.day);
//                let days = new Date(this.date.year, this.date.month, 0).getDate();
//                date.setDate(date.getDate() - days);
//        let days = new Date(this.date.year, this.date.month-1, 0).getDate();
//        date.setDate(date.getDate() - days);
//        if(date.getMonth()==this.date.month-1){
//          date.setDate(date.getDate() - 5);
//        }
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
                this.imgRightUrl = require("../../../images/rightArrow.png");
            },
            rightDateSelect(){
                var date = new Date(this.date.year,this.date.month-1,this.date.day);
//        date.setDate(date.getDate() + days);
//        let days = new Date(this.date.year, this.date.month+1, 0).getDate();
//        date.setDate(date.getDate() + days);
//        if(date.getMonth()<this.date.month){
//          date.setDate(date.getDate() + 5);
//        }
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

                // debugger;
                var dateTime =year.toString() + month;
                if(this.date.year == nowDate.getFullYear()){
                    if(this.date.month > nowDate.getMonth()+1){
                        this.date.month = nowDate.getMonth()+1;
                        this.imgRightUrl = require("../../../images/unclick.png");
                    }else if (this.date.month == nowDate.getMonth()+1){
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
                        this.imgRightUrl = require("../../../images/unclick.png");
                    }else{
                        this.imgRightUrl = require("../../../images/rightArrow.png");
                    }

                }

            }
        },
        data(){
            return{
                date: {
                    year: 0,
                    month: 0,
                    day: 0
                },
                /*year:0,
                 month:0,
                 day:0*/
                imgRightUrl:require('../../../images/rightArrow.png'),
                imgLeftUrl:require('../../../images/leftArrow.png'),
                isCenter:false,
                actionPoints:'',
                currentDate:'',
                showDateSelect:false,
                showCustomernteractionExplainModal:false,
                explainModalTitle:'',

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
                sention1:
                        [
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

            var date = new Date();
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
            if(this.date.year == date.getFullYear()){
                if(this.date.month == date.getMonth()+1){
                    this.imgRightUrl = require("../../../images/unclick.png");
                };

            };

            var url = location.href.replace(/(\/module\/)(.+)$/g,'$1'+'mine.html#/problemFeedback');
            var rightButtonCallback = function () {
                aladdin.header.forward({url: url});
            };
            rightButtonCallback.keep = true;
            aladdin.header.config({
                title: '目前系数',
                rightButtonVisible: true,
                rightButtonText: '问题反馈',
                rightButtonFontSize: '16px',
                rightButtonCallback: rightButtonCallback
            });
        },
        filter(){

        }

    }
</script>

<style>
    .gaoliang{
        background-color:#f6fbff;
        color:#f37938;
    }
    .gaoliang1{
        color:#f37938 !important;
    }
    .bugaoliang{
        background-color: #ffffff;
    }
    #titles{
        height:100px;
        background-color: #f5f5f5;
        color:#999;
        font-size:24px;
        text-align: center;
        line-height: 50px;
    }
    .cell li div{
        border-bottom:1px solid rgba(0,0,0,0.1);
        /*padding:20px 0px;*/
        padding-right:31px;
        height: 92px;
        line-height: 92px;
        padding-left:30px;
        position: relative;
    }
    .cell li:last-child div{
        border-bottom: none;
    }


</style>