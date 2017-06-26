

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
                            {{actionPoints | }}
                        </div>
                    </div>
                    <div class="dataUpdate">数据更新周期为T+1</div>
                    <div class="customernteraction">
                        <div class="section">
                        <span @click = "clickCustomernteraction">
                            <span class="sectionTitle">产品销售</span>
                            <img src="../../../images/question.png">
                        </span>

                        </div>
                        <div class="cell">
                            <ul>
                                <li v-for="(item,index) in responsePointsList" @click="clickDetail(item)">
                                    <span class="spanTitle">{{ item.actionDefineName }}</span>
                                    <span class="spanData" v-show=" item.actionDefineName !='分享响应'">{{ item.actionFinishValue }}</span>
                                    <span v-show = "item.actionDefineName !='分享响应' &&item.actionDefineName !='组织活动'&&item.actionDefineName !='业务员调研'"  :class="item | getColorClass">{{ item.actionFinishPercent }}</span>
                                    <span :class="item.points>0?'spanScore spanStandardScore':'spanScore'">
                    <span>{{item | addProductionPlusFlag}}</span>
                    <img  src="../../../images/arrow.png">
                  </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="quality">
                        <div class="section">
             <span @click = "clickQuality">
                <span class="sectionTitle">规模</span>
                <img src="../../../images/question.png">
            </span>
                        </div>

                        <div class="cell">
                            <ul>
                                <li v-for="item in quanlity">
                                    <span class="spanTitle">{{item.actionDefineName}}</span>
                                    <span :class="'spanScore1'">{{item.points | initPoints}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="evaluate">
                        <div class="section">
                <span @click = "clickEvaluate">
                    <span class="sectionTitle">品质</span>
                    <img src="../../../images/question.png">
                </span>
                        </div>
                        <div class="cell">
                            <ul>
                                <li v-for="item in evaluate">
                                    <span class="spanTitle">{{item.actionDefineName}}</span>
                                    <span class="spanScore1">{{item.points | initPoints}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div v-show="showCustomernteractionExplainModal" class="customernteractionExplainContainer" @touchmove.self.prevent>
                    <div class="customernteractionExplainScroll">
                        <div class="customernteractionExplainHeader" @touchmove.prevent>
                       <span class="customernteractionExplainHeaderSpan">
                           {{explainModalTitle}}
                       </span>
                        </div>
                        <div class = "customernteractionExplainContent">
                            <div class="customernteractionExplainUl">
                                <ul>
                                    <li v-for="item in customernteractionExplain" :class="isCenter?'customernteractionExplainContainerLi2':'customernteractionExplainContainerLi'" >
                                        <div>
                                    <span :class="isCenter?'customernteractionExplainTitleSpan2':'customernteractionExplainTitleSpan'">
                                        {{item.title}}
                                    </span>
                                        </div>
                                        <div>
                                    <span class = "customernteractionExplainContentSpan" v-html="item.content">
                                    </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="customernteractionExplainFooter" @touchmove.prevent>
                            <div class="customernteractionExplainFooterButton">

                <span class="customernteractionExplainFooterButtonSpan" @click="hiddenCustomernteractionExplainModal">
                           知道了
                       </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<style>

</style>
<script>
    require("../../../main.css");
    require("../../../mine.css");
    import ScoreDateSelect from '../../../components/ScoreDateSelect.vue'

    export default {
        components:{
            ScoreDateSelect
        },
        created () {
        },
        data(){
            return{
                date: {
                    year: 0,
                    month: 0,
                    day: 0
                },
                imgRightUrl:require('../../../images/rightArrow.png'),
                imgLeftUrl:require('../../../images/leftArrow.png'),
                channelType:'',
                isCenter:false,
                actionPoints:'',
                currentDate:'',
                showDateSelect:false,
                showCustomernteractionExplainModal:false,
                explainModalTitle:'',
                responsePointsList:[],
                quanlity:[],
                evaluate:[],
                customernteractionExplainCopy:[
                    {
                        title:'重要事项提醒',
                        content:'提醒消息类型为除"生日提醒"外的提醒;<br/>'
                        +'本月跟进率>=--,则本月获得重要事项提醒的--分<br/>'
                        +'本月跟进率=当月创建事项已跟进数的客户数/当月创建事项的客户数。'
                    },
                    {
                        title:'定期问候',
                        content:'提醒消息类型为"生日提醒"；<br/>'
                        +'本月跟进率>=--,则本月可获得定期问候的--分；<br>'
                        +'本月跟进率=当月创建事项已跟进的客户数 /当月创建事项的客户数。'
                    },{
                        title:'商机追踪',
                        content:'本月商机跟进率>=--，则本月可获得--积分；<br/>'
                        +'本月跟进率=截止日期为当月的已跟进商机个数 /截止日期为当月的商机总个数。<br/>',
                    },{
                        title:'面坊',
                        content:'管户最近三个月有一次面访记录即生效；<br/>'
                        +'近三个月面访率>=--,则本月可获得--分；<br/>'
                        +'近三个月面访率<=--,得分=面访率*--分；<br/>'
                        +'面访率=已完成的面访客户数 /需要完成的面访客户数；',
                    },
                    {
                        title:'分享响应',
                        content:'1.当日分享内容数大于等于--且当日获得累计点击数大于等于--,得--分。<br/>'
                        +'2.当日分享内容数大于等于--且当日获得累计点击人数大于等于--，得--分.<br/>'
                        +'要尽量一个内容分享给多个用户哦！',
                    },
                ],
                customernteractionExplain:[
                    {
                        title:'活动组织',
                        content:'网点现场活动及场外活动组织/场（覆盖>=--名客户），每个审批通过后活动可得--分，可累加',
                    },
                    {
                        title:'业务员调研',
                        content:'每个审批通过后的调研可得--分，可累加',
                    },{
                        title:'承接客户商机',
                        content:'本月承接客户商机率>=--，则本月可获得商机追踪的--分'
                        +'本月跟进率=截止日期为当月的已跟进商机个数/截止日期为当月的商机总个数',
                    },{
                        title:'其他商机',
                        content:'本月跟进系统推送其他商机率>=--，则本月可获得商机追踪的--分',
                    },
                    {
                        title:'分享响应',
                        content:'1.当日分享内容数大于等于--且当日获得累计点击数大于等于--,得--分。'
                        +'2.当日分享内容数大于等于--且当日获得累计点击人数大于等于--，得--分.'
                        +'要尽量一个内容分享给多个用户哦！',
                    },
                ],
                responsePointsListP:[
                    {
                        "actionDefineName": "投资理财创利",
                        "actionDefineValue": "--",
                        "actionFinishName": "重要事项已提醒客户数",
                        "actionFinishValue": "--",
                        "actionFinishPercent": "",
                        "actionPercentFlag":true,
                        "points": "--"
                    },
                    {
                        "actionDefineName": "存款创利",
                        "actionDefineValue": "--",
                        "actionFinishName": "定期问候已提醒客户数",
                        "actionFinishValue": "--",
                        "actionFinishPercent": "",
                        "actionPercentFlag":true,
                        "points": "--"
                    },
                    {
                        "actionDefineName": "信用卡新户",
                        "actionDefineValue": "--",
                        "actionFinishName": "已面访客户数",
                        "actionFinishValue": "--",
                        "actionFinishPercent": "",
                        "actionPercentFlag":true,
                        "points": "--"
                    }],
                responsePointsListW:[
                    {
                        "actionDefineName": "活动组织",
                        "actionDefineValue": "--",
                        "actionFinishName": "参与活动组织数",
                        "actionFinishValue": "--",
                        "actionFinishPercent": "",

                        "points": "--"
                    },
                    {
                        "actionDefineName": "业务员调研",
                        "actionDefineValue": "--",
                        "actionFinishName": "业务员调研完成数",
                        "actionFinishValue": "--",
                        "actionFinishPercent": "",
                        "points": "--"
                    },
                    {
                        "actionDefineName": "承接客户商机",
                        "actionDefineValue": "--",
                        "actionFinishName": "承接客户商机数",
                        "actionFinishValue": "--",
                        "actionFinishPercent": "",
                        "actionPercentFlag":true,
                        "points": "--"
                    },
                    {
                        "actionDefineName": "其他商机",
                        "actionDefineValue": "--",
                        "actionFinishName": "其他商机数",
                        "actionFinishValue": "--",
                        "actionFinishPercent": "",
                        "actionPercentFlag":true,
                        "points": "--"
                    },
                    {
                        "actionDefineName": "分享响应",
                        "points": "--"
                    }],
                quanlityP:
                        [
                            {
                                'actionDefineName':'AUM日均净值',
                                'points':'--'
                            },
                            {
                                'actionDefineName':'净增财富客户数',
                                'points':'--'
                            },
                            {
                                'actionDefineName':'净增私行客户数',
                                'points':'--'
                            },
                            {
                                'actionDefineName':'移交私行客户数',
                                'points':'--'
                            }],
                quanlityW:
                        [
                            {
                                'actionDefineName':'新增月末余额万元户数',
                                'points':'--'
                            },
                            {
                                'actionDefineName':'净增私行客户数',
                                'points':'--'
                            }],
                evaluateP:
                        [
                            {
                                'actionDefineName':'达标客户流失率',
                                'points':'--'
                            },
                        ],
                evaluateW:
                        [
                            {
                                'actionDefineName':'一户六开',
                                'points':'--'
                            },
                        ]
            }

        },
        methods:{
            queryResponsePoints(dataTime){
                aladdin.loading.start({canCancel: false});
                let _self = this;
                aladdin.aike_tool.getTicket(function (err, ticket) {
                    if (err && !ticket) {
                        // alert("ticket=="+ticket);
                    } else {
                        //alert(url);
//            console.log('url='+url);
                        var umAccount = '';
                        aladdinRequestData({
                            url: 'dutyPoints/listDetails.do',
                            type: 'POST',
                            data: {
                                //TODO
                                'ticket':ticket,//ticket,
                                'umAccount':umAccount,
                                'date':dataTime
                            },
                            beforeSend: {
                                "brcpEaSessionTicket":ticket
                            },
                            success: function (err,res) {
                                aladdin.loading.stop({canCancel: false});
                                if(err){
                                    aladdin.toast.show({message: '加载错误 '});
                                    aladdin.loading.stop({canCancel: false});
                                    _self.actionPoints = '--';
                                    _self.responsePointsList = [];
                                    _self.quanlity = [];
                                    _self.evaluate =[];
                                    return;
                                }
                                _self.actionPoints = '--';
                                _self.responsePointsList = [];
                                _self.quanlity = [];
                                _self.evaluate = [];
                                let result = res.body;
                                result = eval("("+result+")");
                                if (result.responseCode != 0){
                                    if(result.responseCode == "900108"){
                                        aladdin.toast.show({ message:'该用户当月无数据'});
                                    }else{
                                        aladdin.toast.show({ message:'系统错误'});
                                    }
                                    return;
                                }else {
                                    var actionTotals = result.salesInfs,
                                    //alert("channelType_================"+result.channelType)
                                    channelType_ = result.channelType,//人员类型
                                    dataList_ = result.dataList,//数据
                                    sumTotal_ = result.sumTotal,//总分
                                    departmentList_ = result.departmentList,//规模
                                    qualityList_ = result.qualityList,//品质
                                    qualityListScore_ = result.qualityListScore,
                                    salesList_ = result.salesList,//销售
                                    serveList_ = result.serveList,//服务
                                    salasAdujest_ = result.salasAdjust;//取调制值

                                    if(score==undefined||score==""||score==null){
                                    }else{
                                        if(channelType!="WSM"){
                                            _self.actionPoints = score.totalScore;
                                            _self.quanlityP[0].points = score.riskScore;
                                            _self.quanlityP[1].points = score.complainScore;
                                            _self.evaluateP[0].points = score.supervisorScore;
                                            _self.quanlity = _self.quanlityP;
                                            _self.evaluate = _self.evaluateP;

                                        }else {
                                            _self.actionPoints = score.totalScore;
                                            _self.quanlityW[0].points = score.exmineScore;
                                            _self.quanlityW[1].points = score.riskScore;
                                            _self.quanlityW[2].points = score.complainScore;
                                            _self.evaluateP[0].points = score.supervisorScore;
                                            _self.quanlity = _self.quanlityW;
                                            _self.evaluate = _self.evaluateP;
                                        }

                                    }

                                    if(dataList==undefined||dataList==""||dataList==null){

                                    }else{

                                        if(channelType=="RM"){
                                            alert(channelType);
                                            //投资理财创利
                                            _self.responsePointsListW[0].actionFinishValue = actionTotals[0].actionOrganize;
                                            _self.responsePointsListW[0].points = dataList_.aumDayAvg;
                                            //存款创利
                                            _self.responsePointsListW[1].actionFinishValue = actionTotals[0].salesmanSurvey;
                                            _self.responsePointsListW[1].points = dataList_.pureIncomeWealth;
                                            _self.responsePointsListW[3].points = dataList_.transferPbank;
                                            //信用卡新户
                                            _self.responsePointsListW[4].points = dataList_.custLoseScore;
                                            _self.responsePointsList = _self.responsePointsListW;

                                        }else{
                                            //重要事项
                                            _self.responsePointsListP[0].actionFinishValue = actionTotals[0].msgRemindCondition;
                                            _self.responsePointsListP[0].actionFinishPercent = actionTotals[0].msgRemindfinishPercent + '%';
                                            actionTotals[0].msgRemindFlag == 1? _self.responsePointsListP[0].actionPercentFlag =true :_self.responsePointsListP[0].actionPercentFlag =false;
                                            _self.responsePointsListP[0].points = actionTotals[0].msgRemindPoints;
                                            //定期问候
                                            _self.responsePointsListP[1].actionFinishValue = actionTotals[0].msgRegularCondition;
                                            _self.responsePointsListP[1].actionFinishPercent = actionTotals[0].msgRegularfinishPercent + '%';
                                            actionTotals[0].msgRegularFlag == 1? _self.responsePointsListP[1].actionPercentFlag =true :_self.responsePointsListP[1].actionPercentFlag =false;
                                            _self.responsePointsListP[1].points = actionTotals[0].msgRegularPoints;
                                            //商机追踪
                                            _self.responsePointsListP[2].actionFinishValue = actionTotals[0].optyCountCondition;
                                            _self.responsePointsListP[2].actionFinishPercent = actionTotals[0].optyCountfinishPercent + '%';
                                            actionTotals[0].optyCountFlag == 1? _self.responsePointsListP[2].actionPercentFlag =true :_self.responsePointsListP[2].actionPercentFlag =false;
                                            _self.responsePointsListP[2].points = actionTotals[0].optyPoints;
                                            //面访
                                            _self.responsePointsListP[3].actionFinishValue = actionTotals[0].inPersonCustCondition;
                                            _self.responsePointsListP[3].actionFinishPercent = actionTotals[0].inPersonCustfinishPercent + '%';
                                            actionTotals[0].inPersonCustFlag == 1? _self.responsePointsListP[3].actionPercentFlag =true :_self.responsePointsListP[3].actionPercentFlag =false;
                                            _self.responsePointsListP[3].points = actionTotals[0].inPersonPoints;
                                            //分享
                                            _self.responsePointsListP[4].points = actionTotals[0].sharePoints;
                                            _self.responsePointsList = _self.responsePointsListP;
                                            console.log(_self.responsePointsList);
                                        }

                                    }
                                    if(listStandard.length >0)
                                    {
                                        var explains =[];
                                        for(var i=0;i<listStandard.length;i++)
                                        {
                                            var customernteractionExplainObj={};
                                            var obj = listStandard[i];
                                            var standard = obj.finishPercent?obj.finishPercent*100:'--';
                                            var standardPoints = obj.standardPoints ?obj.standardPoints:'--';
                                            var finishCount = obj.finishCount?obj.finishCount:'--'
                                            if(obj.typeId == 'Q010300')
                                            {
                                                customernteractionExplainObj.title = '重要事项提醒';
                                                customernteractionExplainObj.content = "提醒消息类型为除“生日提醒”外的提醒;<br/>"
                                                        +"本月跟进率>="+standard+"%,则本月获得的"+standardPoints+"分;<br/>"
                                                        +"本月跟进率=当月创建事项已跟进的客户数 /当月创建事项的客户数。";
                                            }else if(obj.typeId == 'Q010200')
                                            {
                                                customernteractionExplainObj.title = '定期问候';
                                                customernteractionExplainObj.content = "提醒消息类型为“生日提醒”;<br/>"
                                                        +"本月跟进率>="+standard+"%,则本月获得"+standardPoints+"分;<br/>"
                                                        +"本月跟进率=当月创建事项已跟进的客户数 /当月创建事项的客户数。";


                                            }else if(obj.typeId == 'Q010100')
                                            {
                                                customernteractionExplainObj.title = '商机追踪';
                                                customernteractionExplainObj.content ="本月商机跟进率>="+standard+"%，则本月可获得"+standardPoints+"积分;<br/>"+
                                                        "本月跟进率=截止日期为当月的已跟进商机个数 /截止日期为当月的商机总个数。";
                                            }else if(obj.typeId == '面访')
                                            {

                                                customernteractionExplainObj.title = '面访';
                                                customernteractionExplainObj.content = "管户最近三个月有一次面访记录即生效;<br/>" +
                                                        "近三个月客户面访率>="+standard+"%,则本月获得"+standardPoints+"分;<br/>"+
                                                        "近三个月客户面访率<"+standard+"%,得分=面访率*"+standardPoints+"分;<br/>"+
                                                        "面访率=已完成的面访客户数 /需要完成的面访客户数;";

                                            }else if(obj.typeId == 'Q010900')
                                            {

                                                customernteractionExplainObj.title = '活动组织';
                                                customernteractionExplainObj.content = "网点现场活动及场外活动组织/场（覆盖>="+finishCount+"名客户），每次审批通过后活动可得"+standardPoints+"分，可累加";

                                            }else if(obj.typeId == 'Q011000')
                                            {

                                                customernteractionExplainObj.title = '业务员调研';
                                                customernteractionExplainObj.content = "每个审批通过后的调研可得"+standardPoints+"分，可累加";

                                            }else if(obj.typeId == 'Q010800')
                                            {

                                                customernteractionExplainObj.title = '承接客户商机';
                                                customernteractionExplainObj.content = "本月承接客户商机率>="+standard+"%,则本月可获得商机追踪的"+standardPoints+"分<br/>"+
                                                        "本月跟进率=截止日期为当月的已跟进商机个数/截止日期为当月的商机总个数";

                                            }else if(obj.typeId == 'Q010700')
                                            {

                                                customernteractionExplainObj.title = '其他商机';
                                                customernteractionExplainObj.content = "本月其他商机率>="+standard+"%,则本月可获得商机追踪的"+standardPoints+"分;<br/>"+
                                                        " 本月跟进率=截止日期为当月的已跟进商机个数/截止日期为当月的商机总个数。";

                                            }else if(listStandard[i].typeId=="Q011100"){
                                                var clickCount = obj.finishCount;
                                                var standarpoint = obj.standardPoints;
                                                var totalCount = obj.totalCount;
                                                var content = '';
//                          if(obj.standardPoints==1){
                                                content = content+ "当日分享内容数大于等于"+totalCount+"且当日获得累计点击数大于等于"+clickCount
                                                        +"得"+standarpoint+"分。<br/>"
//                          }else{
                                                var clickCount = obj.finishCount;
                                                var standarpoint = obj.standardPoints;
                                                content = content+ "当日分享内容数大于等于"+totalCount+"且当日获得累计点击数大于等于"+clickCount
                                                        +"得"+standarpoint+"分。<br/>"
//                          }
                                                customernteractionExplainObj.title = '分享响应';
                                                customernteractionExplainObj.content = content + '要尽量一个内容分享给多个用户哦！';
                                            }
                                            explains.unshift(customernteractionExplainObj);

                                        }
                                        _self.customernteractionExplainCopy = explains;
                                        _self.customernteractionExplain = _self.customernteractionExplainCopy;


                                    }

                                }
                            }
                        })
                    }
                })
            },

            clickTest(){
                this.$router.push({name:'test',query:{a:'aa'}});
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
            clickCustomernteraction(){
                //alert('客户互动问好弹框');

                this.isCenter = false;
                this.explainModalTitle = '客户互动积分说明';
                this.customernteractionExplain = this.customernteractionExplainCopy;
                $('.customernteractionExplainScroll').css('margin-top','103px');
                this.showCustomernteractionExplainModal = true;

            },
            clickQuality(){
                this.isCenter = false;
                this.explainModalTitle = '品质积分说明';
                this.customernteractionExplain = [
                    {
                        title:'运营业务差错',
                        content:'FB/柜面系统记录,按照业务类型分别记分',
                    },
                    {
                        title:'合规/风险案件',
                        content:'出现合规案件扣分,按照红黄蓝牌扣分.红牌-20,黄牌-15,蓝牌-10',
                    },

                    {
                        title:'客户投诉/满意',
                        content:'客户投诉/满意记录,投诉扣分,满意加分',
                    }];
                $('.customernteractionExplainScroll').css('margin-top','350px');
                this.showCustomernteractionExplainModal = true;
//                alert('品质问好弹框');
            },
            clickEvaluate(){
                this.isCenter = true;
                this.explainModalTitle = '主管评分';
                this.customernteractionExplain = [
                    {
                        title:'主管对行员本月表现在0-20内打分',
                        content:'',
                    }],
                        $('.customernteractionExplainScroll').css('margin-top','450px');
                this.showCustomernteractionExplainModal = true;
                // alert('主管评价问好弹框');
            },
            clickDetail(item){
                var url;
                var type;
                if(item.actionDefineName == '产品分享')
                {

                    type = '1';
                    //alert('产品分享'+type);
                    url = location.href.replace(/(\/module\/)(.+)$/g,'$1'+`mine.html#/ShareScoreDetail?type=${type}&year=${this.date.year}&month=${this.date.month}`);
                }else if(item.actionDefineName == '资讯/活动分享')
                {

                    type = '2';
                    // alert('资讯/活动分享'+type);
                    url = location.href.replace(/(\/module\/)(.+)$/g,'$1'+`mine.html#/ShareScoreDetail?type=${type}&year=${this.date.year}&month=${this.date.month}`);
                }else
                {
                    return;
                }
                aladdin.header.forward({
                    url: url
                });
            },
            hiddenCustomernteractionExplainModal(){
                //alert('隐藏客户互动积分说明弹框');
                this.showCustomernteractionExplainModal = false;
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
                if(this.date.year == nowDate.getFullYear()){
                    if(this.date.month >= nowDate.getMonth()){
                        this.date.month = nowDate.getMonth()+1;
                        this.imgRightUrl = require("../../../images/unclick.png");
                    }else{
                        this.imgRightUrl = require("../../../images/rightArrow.png");
                    }

                }
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
                title: '责任积分',
                rightButtonVisible: true,
                rightButtonText: '问题反馈',
                rightButtonFontSize: '16px',
                rightButtonCallback: rightButtonCallback
            });

        },
        filters: {
            showFlag (item) {
                return true;
                if(item.indexOf('%') == -1){
                    return false;
                }else {
                    return true;
                }
            },
            getColorClass (item) {
                if(item.actionPercentFlag){
                    return 'spanPersent1';
                }else {
                    return 'spanPersent';
                }
            },
            addProductionPlusFlag(item){
                var points = item.points;
                if(!points){
                    return item.points;
                }
                if(points == undefined){
                    return '';
                }
                if(points == '--'){
                    return '--';
                }
                if(points>=0)
                {
                    return ("+" + points);
                }else
                {
                    return ("-" + points);
                }

            },
            initPoints(points){
                if(points == undefined||points == ''||points == ''){
                    return '--';
                }else {
                    return points;
                }

            },
            addPlusFlag (item) {
                //spanScore spanStandardScore
//                debugger;
                console.log('**************',item);

                var actionFinishValue = item.actionFinishValue, actionDefineValue = item.actionDefineValue;
                console.log("---"+item.standard);

                if (!actionDefineValue) {
                    return item.points
                }
                if(item.standard == undefined){
                    return ("+" + item.points);
                    //return;
                }
                var pointsStandard = item.standard.replace("%","");
                //pointsStandard
                pointsStandard = Number(pointsStandard)*0.01;
                var actionStandard = (actionFinishValue/actionDefineValue);
                //var pointsStandard = 1.8;
                console.log('**********',actionFinishValue/actionDefineValue,pointsStandard);
                if (actionFinishValue/actionDefineValue >= pointsStandard) {
                    return ("+" + item.points);
                }else if(actionFinishValue/actionDefineValue < pointsStandard){
                    return ("-" + item.points);
                }


            }

        }
    }
</script>
