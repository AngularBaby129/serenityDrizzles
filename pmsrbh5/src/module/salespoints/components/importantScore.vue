

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
                            {{actionPoints }}
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
                                    <span >

                                        <span :class="item.points>0?'spanScore spanStandardScore':'spanScore'" >{{item | addProductionPlusFlag}}
                                            <span class="adjustArea" v-if="item.actionFinishValue?true:false" style="margin-left: 10px" @click="clickAjust(item.actionFinishName)">{{ item.actionFinishValue}}</span></span>
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
    .adjustArea{
        background-color: #34a1fc;
        float: right;
        color: white;
        height: auto;
        margin-top: 22px;
        line-height: 50px;
        width: auto;
        text-align: center;
        border-radius: 25px;
    }
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
                actionPoints:'--',
                currentDate:'',
                showDateSelect:false,
                showCustomernteractionExplainModal:false,
                explainModalTitle:'',
                responsePointsList:[],
                quanlity:[],
                evaluate:[],
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
                customernteractionExplainG:[],
                customernteractionExplainS:[],
                responsePointsListP:[
                    {
                        "actionDefineName": "投资理财创利",
                        "actionDefineValue": "--",
                        "actionFinishName": "投资理财创利",
                        "actionFinishValue": "",
                        "actionFinishPercent": "",
                        "actionPercentFlag":true,
                        "points": "--"
                    },
                    {
                        "actionDefineName": "存款创利",
                        "actionDefineValue": "--",
                        "actionFinishName": "存款创利",
                        "actionFinishValue": "",
                        "actionFinishPercent": "",
                        "actionPercentFlag":true,
                        "points": "--"
                    },
                    {
                        "actionDefineName": "信用卡新户",
                        "actionDefineValue": "--",
                        "actionFinishName": "信用卡新户",
                        "actionFinishValue": "",
                        "actionFinishPercent": "",
                        "actionPercentFlag":true,
                        "points": "--"
                    }],
                responsePointsListW:[
                    {
                        "actionDefineName": "活动组织",
                        "actionDefineValue": "--",
                        "actionFinishName": "参与活动组织数",
                        "actionFinishValue": "",
                        "actionFinishPercent": "",

                        "points": "--"
                    },
                    {
                        "actionDefineName": "业务员调研",
                        "actionDefineValue": "--",
                        "actionFinishName": "业务员调研完成数",
                        "actionFinishValue": "",
                        "actionFinishPercent": "",
                        "points": "--"
                    },
                    {
                        "actionDefineName": "承接客户商机",
                        "actionDefineValue": "--",
                        "actionFinishName": "承接客户商机数",
                        "actionFinishValue": "",
                        "actionFinishPercent": "",
                        "actionPercentFlag":true,
                        "points": "--"
                    },
                    {
                        "actionDefineName": "其他商机",
                        "actionDefineValue": "--",
                        "actionFinishName": "其他商机数",
                        "actionFinishValue": "",
                        "actionFinishPercent": "",
                        "actionPercentFlag":true,
                        "points": "--"
                    },
                    {
                        "actionDefineName": "分享响应",
                        "points": "--"
                    }],
                quanlityR:
                        [
                            {
                                'actionDefineName':'AUM日均净值',
                                "actionFinishName": "其他商机数",
                                "actionFinishValue": "",
                                'points':'--'
                            },
                            {
                                'actionDefineName':'净增财富客户数',
                                "actionFinishName": "其他商机数",
                                "actionFinishValue": "",
                                'points':'--'
                            },
                            {
                                'actionDefineName':'净增私行客户数',
                                "actionFinishName": "其他商机数",
                                "actionFinishValue": "",
                                'points':'--'
                            },
                            {
                                'actionDefineName':'移交私行客户数',
                                "actionFinishName": "其他商机数",
                                "actionFinishValue": "",
                                'points':'--'
                            }],
                quanlityP:
                        [
                            {
                                'actionDefineName':'AUM日均净值',
                                "actionFinishName": "其他商机数",
                                "actionFinishValue": "",
                                'points':'--'
                            },
                            {
                                'actionDefineName':'净增财富客户数',
                                "actionFinishName": "其他商机数",
                                "actionFinishValue": "",
                                'points':'--'
                            }],
                quanlityW:
                        [
                            {
                                'actionDefineName':'新增月末余额万元户数',
                                "actionFinishName": "其他商机数",
                                "actionFinishValue": "",
                                'points':'--'
                            },
                            {
                                'actionDefineName':'新增柜面非寿险财富客户数',
                                "actionFinishName": "其他商机数",
                                "actionFinishValue": "",
                                'points':'--'
                            },
                            {
                                'actionDefineName':'新增柜面非寿险私行客户数',
                                "actionFinishName": "其他商机数",
                                "actionFinishValue": "",
                                'points':'--'
                            }],
                evaluateP:
                        [
                            {
                                'actionDefineName':'达标客户流失率',
                                "actionFinishName": "其他商机数",
                                "actionFinishValue": "",
                                'points':'--'
                            },
                        ],
                evaluateW:
                        [{
                            'actionDefineName':'一户六开新客户',
                            "actionFinishName": "其他商机数",
                            "actionFinishValue": "",
                            'points':'--'
                        },
                        {
                            'actionDefineName':'一户六开老客户',
                            "actionFinishName": "其他商机数",
                            "actionFinishValue": "",
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

                                    if(actionTotals==undefined||actionTotals==""||actionTotals==null){
                                    }else{
                                        //投资理财创利
                                        _self.responsePointsListP[0].points = dataList_.investFinance;
                                        //存款创利
                                        _self.responsePointsListP[1].points = dataList_.depositScore;
                                        //信用卡新户
                                        _self.responsePointsListP[2].points = dataList_.creditCard;
                                        _self.responsePointsList = _self.responsePointsListP;

                                    }

                                    if(dataList==undefined||dataList==""||dataList==null){

                                    }else{

                                        if(channelType=="RM"){
                                            alert(channelType);
                                            //AUM日军净值
                                            _self.quanlityR[0].points = dataList_.aumDayAvg;
                                            //净增财富客户数
                                            _self.quanlityR[1].points = dataList_.pureIncomeWealth;
                                            //净增私行客户数
                                            _self.quanlityR[3].points = dataList_.pureIncomePbank;
                                            //移交私行客户数
                                            _self.quanlityR[4].points = dataList_.transferPbank;
                                            //达标客户流失率
                                            _self.evaluateP[0].points = dataList_.custLoseScore;
                                            _self.quanlity = _self.quanlityR;
                                            _self.evaluate = _self.evaluateP;

                                        }else if(channelType_ == "PB"){
                                            //AUM日军净值
                                            _self.quanlityP[0].points = dataList_.aumDayAvg;
                                            //净增财富客户数
                                            _self.quanlityP[1].points = dataList_.pureIncomePbank;
                                            //达标客户流失率
                                            _self.evaluateP[0].points = dataList_.custLoseScore;
                                            _self.quanlity = _self.quanlityP;
                                            _self.evaluate = _self.evaluateP;
                                        }else if (channelType_ == "WSM"){
                                            //新增月末余额
                                            _self.quanlityW[0].points = dataList_.incomeTenThousand;
                                            //新增柜面非寿险财富客户数
                                            _self.quanlityW[1].points = dataList_.income_wealth_score;
                                            //新增柜面非寿险私行客户数
                                            _self.quanlityW[3].points = dataList_.income_wealth_score;
                                            //一户六开新客户
                                            _self.evaluateW[0].points = dataList_.oneCustSix;
                                            //一户六开老客户
                                            _self.evaluateW[1].points = dataList_.oneOldCustSix;
                                            _self.quanlity = _self.quanlityP;
                                            _self.evaluate = _self.evaluateP;
                                        }

                                    }
                                    for(var i in salasAdujest_){
                                        if(salasAdujest_[i].QUOTA_ID=="Q020100"){//投资理财创利
                                            _self.responsePointsListP[0].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                        }
                                        if(salasAdujest_[i].QUOTA_ID=="Q020200"){//存款创利
                                            _self.responsePointsListP[1].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                        }
                                        // 			if(salasAdujest_[i].QUOTA_ID=="Q020600"){//信用卡新户
                                        // 				$("#creditCard").text($("#creditCard").text()+"(+"+salasAdujest_[i].ADJUST_POINT+")");
                                        // 				$("#adjustDesc").text(salasAdujest_[i].ADJUST_DESC);
                                        // 				$("#creditCard").click(function(){
                                        // 					$('.adjust').css('display','block');
                                        // 				});
                                        // 			}
                                        if(channelType_=="RM"){
                                            if(salasAdujest_[i].QUOTA_ID=="Q020500"){//AUM日均净值
                                                _self.quanlityR[0].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.quanlityR[0].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                            if(salasAdujest_[i].QUOTA_ID=="Q020600"){//净增财富客户数
                                                _self.quanlityR[1].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.quanlityR[3].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            if(salasAdujest_[i].QUOTA_ID=="Q020700"){//净增私行客户数
                                                _self.quanlityR[2].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.quanlityR[3].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                            if(salasAdujest_[i].QUOTA_ID=="Q020800"){//移交私行客户数
                                                _self.quanlityR[3].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.quanlityR[3].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                            if(salasAdujest_[i].QUOTA_ID=="Q021100"){//达标客户流失率
                                                _self.evaluateP[0].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.evaluateP[0].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                        }
                                        if(channelType_=="PB"){
                                            if(salasAdujest_[i].QUOTA_ID=="Q020500"){//AUM日均净值
                                                _self.quanlityP[0].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.quanlityP[0].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                            if(salasAdujest_[i].QUOTA_ID=="Q020800"){//移交私行客户数
                                                _self.quanlityP[1].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.quanlityP[1].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                            if(salasAdujest_[i].QUOTA_ID=="Q021100"){//达标客户流失率
                                                _self.evaluateP[0].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.evaluateP[0].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                        }
                                        if(channelType_=="WSM"){
                                            if(salasAdujest_[i].QUOTA_ID=="Q020900"){//新增月末余额万元户数
                                                _self.quanlityW[0].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.quanlityW[0].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                            if(salasAdujest_[i].QUOTA_ID=="Q021201"){//一户六开新客户
                                                _self.evaluateW[0].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.evaluateW[0].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                            if(salasAdujest_[i].QUOTA_ID=="Q021202"){//一户六开老客户
                                                _self.evaluateW[1].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.evaluateW[1].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                            if(salasAdujest_[i].QUOTA_ID=="Q021001"){//柜面非寿险新客户_财富
                                                _self.quanlityW[1].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.quanlityW[1].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                            if(salasAdujest_[i].QUOTA_ID=="Q021002"){//柜面非寿险新客户_私行
                                                _self.quanlityW[2].actionFinishValue = salasAdujest_[i].ADJUST_POINT;
                                                _self.quanlityW[2].actionFinishName = salasAdujest_[i].ADJUST_DESC;
                                            }
                                        }
                                    }
                                    if(listStandard.length >0)
                                    {
                                        var explains =[];
                                        for(var i=0;i<salesList_.length;i++)
                                        {
                                            var customernteractionExplainObj={};
                                            var obj = salesList_[i];
                                            var standard = obj.STANDARD_POINTS?obj.STANDARD_POINTS:'--';
                                            var standardPoints = obj.standardPoints ?obj.standardPoints:'--';
                                            var finishCount = obj.finishCount?obj.finishCount:'--'
                                            if(obj.RESERVE_CHAR1 == 'Q020100')
                                            {
                                                customernteractionExplainObj.title = '投资理财创利';
                                                customernteractionExplainObj.content = "每万元创利可得"+standard+"分。";
                                            }else if(obj.typeId == 'Q020200')
                                            {
                                                customernteractionExplainObj.title = '存款创利';
                                                customernteractionExplainObj.content = "每万元创利可得"+standard+"分。大额存单计给销售人，其他按创利五折计给管户人。";


                                            }
                                            explains.unshift(customernteractionExplainObj);

                                        }
                                        _self.customernteractionExplain = explains;


                                    }
                                        if(departmentList_.length >0) {
                                            if (channelType_ == "RM") {
                                                var explains = [];
                                                for (var i = 0; i < departmentList_.length; i++) {
                                                    var customernteractionExplainObj = {};
                                                    var obj = departmentList_[i];
                                                    var standard = obj.STANDARD_POINTS ? obj.STANDARD_POINTS : '--';
                                                    var standardPoints = obj.standardPoints ? obj.standardPoints : '--';
                                                    var finishCount = obj.finishCount ? obj.finishCount : '--'
                                                    if (obj.RESERVE_CHAR1 == 'Q020500') {
                                                        customernteractionExplainObj.title = '投资理财创利';
                                                        customernteractionExplainObj.content = "每百万净增可得" + setPoints1 + "分；<br/>"
                                                                + "每百万流失可扣" + setPoints1 + "分；<br/>"
                                                                + "不封顶不封底。";
                                                    } else if (obj.typeId == 'Q020700') {
                                                        customernteractionExplainObj.title = '存款创利';
                                                        customernteractionExplainObj.content = "每个客户净增可得" + setPoints2 + "分；<br/>"
                                                                + "每个客户流失可扣" + setPoints2 + "分；<br/>"
                                                                + "不封顶不封底。";

                                                    } else if (obj.typeId == 'Q020800') {
                                                        customernteractionExplainObj.title = '存款创利';
                                                        customernteractionExplainObj.content = "每个客户净增可得" + setPoints4 + "分；<br/>"
                                                                + "每个客户流失可扣" + setPoints4 + "分；<br/>"
                                                                + "不封顶不封底。";


                                                    } else if (obj.typeId == 'Q020600') {
                                                        customernteractionExplainObj.title = '存款创利';
                                                        customernteractionExplainObj.content = "每个客户移交可得" + setPoints3 + "分；<br/>";


                                                    }
                                                    explains.unshift(customernteractionExplainObj);

                                                }
                                                _self.customernteractionExplainG = explains;



                                        }else if(channelType_ == "PB"){
                                                var explains = [];
                                                for (var i = 0; i < departmentList_.length; i++) {
                                                    var customernteractionExplainObj = {};
                                                    var obj = departmentList_[i];
                                                    var standard = obj.STANDARD_POINTS ? obj.STANDARD_POINTS : '--';
                                                    var standardPoints = obj.standardPoints ? obj.standardPoints : '--';
                                                    var finishCount = obj.finishCount ? obj.finishCount : '--'
                                                    if (obj.RESERVE_CHAR1 == 'Q020500') {
                                                        customernteractionExplainObj.title = '投资理财创利';
                                                        customernteractionExplainObj.content = "每百万净增可得" + setPoints1 + "分；<br/>"
                                                                + "每百万流失可扣" + setPoints1 + "分；<br/>"
                                                                + "不封顶不封底。";
                                                    } else if (obj.typeId == 'Q020700') {
                                                        customernteractionExplainObj.title = '存款创利';
                                                        customernteractionExplainObj.content = "每个客户净增可得" + setPoints2 + "分；<br/>"
                                                                + "每个客户流失可扣" + setPoints2 + "分；<br/>"
                                                                + "不封顶不封底。";

                                                    }
                                                    explains.unshift(customernteractionExplainObj);

                                                }
                                                _self.customernteractionExplainG = explains;

                                        }else if(channelType_ == "WSM"){
                                            var explains = [];
                                            for (var i = 0; i < departmentList_.length; i++) {
                                                var customernteractionExplainObj = {};
                                                var obj = departmentList_[i];
                                                var standard = obj.STANDARD_POINTS ? obj.STANDARD_POINTS : '--';
                                                if (obj.RESERVE_CHAR1 == 'Q020900') {
                                                    customernteractionExplainObj.title = '投资理财创利';
                                                    customernteractionExplainObj.content = "当月每个入金万元的客户可得"+standard+"分";
                                                } else  {

                                                    if (obj.RESERVE_CHAR1 == 'Q020600') {
                                                        setPoints2 = obj.STANDARD_POINTS;
                                                    }else if("Q020700"== obj.RESERVE_CHAR1){
                                                        setPoints3 = obj.STANDARD_POINTS;
                                                    }
                                                    customernteractionExplainObj.title = '存款创利';
                                                    customernteractionExplainObj.content = "非寿险客户按3个月后客户资产等级计算分；<br/>"
                                                            + "新增每个财富客户净增可得" + setPoints2 + "分；<br/>"
                                                            + "新增每个私行客户净增可得" + setPoints3 + "分；"
                                                }
                                                        explains.unshift(customernteractionExplainObj);
                                                }
                                            _self.customernteractionExplainG = explains;

                                            }
                                            if(qualityList_.length>0){
                                                for(var i = 0 ;i<qualityList_.length;i++){
                                                    if("P0011"== qualityList_[i].POINT_ID){//底线值
                                                        var setPoints1 = qualityList_[i].STANDARDS ? qualityList_[i].STANDARDS : '--';
                                                        //setPoints1 = qualityList_[i].RESERVE_CHAR2; //极小值
                                                    }else if("P0013"== qualityList_[i].POINT_ID){//封顶值
                                                        var setPoints2 = qualityList_[i].STANDARDS ? qualityList_[i].STANDARDS : '--';
                                                        //setPoints2 = qualityList_[i].RESERVE_CHAR2;  //极大值
                                                    }else if("P0012"== qualityList_[i].POINT_ID){//标准值
                                                        var setPoints5 = qualityList_[i].STANDARDS ? qualityList_[i].STANDARDS : '--';
                                                    }
                                                }
                                                var temp1 = qualityListScore_[0].STANDARD_POINTS;
                                                var divScore = parseInt(setPoints2) - parseInt(setPoints1);
                        //						var lsStr = "流失率=0%可得"+setPoints2+"分。每流失0.1%的客户，则对应扣除"+divScore+"/15分。"
                        //									+"最高扣除分为"+setPoints2+"分，超过1.5%的流失率也扣除"+setPoints1+"分。"
                                                var tempScore = temp1-(temp1*(setPoints5-0.001)/(setPoints5-setPoints2));
                                                var customernteractionExplainObj = {};
                                                customernteractionExplainObj.title = '存款创利';
                                                customernteractionExplainObj.content = "流失率=0%可得"+qualityListScore_[0].STANDARD_POINTS+"分。每流失0.1%的客户，则对应扣除"+Math.round(tempScore)+"分。"
                                                        +"最高扣除分为"+qualityListScore_[0].STANDARD_POINTS+"分，超过1.5%的流失率也扣除"+qualityListScore_[0].STANDARD_POINTS+"分。"
                                                customernteractionExplainS.push(customernteractionExplainObj)
                                            }
                                            if(serveList_.length > 0){
                                                for(var i = 0 ;i<serveList_.length;i++){
                                                    if("Q021202"== serveList_[i].RESERVE_CHAR1){
                                                        var setPoints1 = serveList_[i].STANDARD_POINTS ? serveList_[i].STANDARD_POINTS : '--';
                                                    }else if("Q021201"== serveList_[i].RESERVE_CHAR1){
                                                        var setPoints2 = serveList_[i].STANDARD_POINTS ? serveList_[i].STANDARD_POINTS : '--';;
                                                    }
                                                }
                                                var customernteractionExplainObj = {};
                                                customernteractionExplainObj.title = '存款创利';
                                                customernteractionExplainObj.content = "当月完成一户六开的每个新客户数可得"+setPoints1+"分，老客户可得"+setPoints2+"分计给最后一开的办理人。";
                                                customernteractionExplainS.push(customernteractionExplainObj)
                                            }
                                        }


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
                this.explainModalTitle = '产品销售积分说明';
                this.customernteractionExplain = this.customernteractionExplain;
                $('.customernteractionExplainScroll').css('margin-top','103px');
                this.showCustomernteractionExplainModal = true;

            },
            clickQuality(){
                this.isCenter = false;
                this.explainModalTitle = '规模积分说明';
                this.customernteractionExplain = this.customernteractionExplainG;
                $('.customernteractionExplainScroll').css('margin-top','350px');
                this.showCustomernteractionExplainModal = true;
//                alert('品质问好弹框');
            },
            clickEvaluate(){
                this.isCenter = true;
                this.explainModalTitle = '品质积分说明';
                this.customernteractionExplain = this.customernteractionExplainS;
                        $('.customernteractionExplainScroll').css('margin-top','450px');
                this.showCustomernteractionExplainModal = true;
                // alert('主管评价问好弹框');
            },
            clickAjust(context){
                this.isCenter = true;
                this.explainModalTitle = '手工调整原因';
                this.customernteractionExplain = [
                    {
                        title:'',
                        content:context,
                    }],
                $('.customernteractionExplainScroll').css('margin-top','450px');
                this.showCustomernteractionExplainModal = true;
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

            var url = '/sicaih5/dist/module/mine.html#/problemFeedback?type=important';
            var rightButtonCallback = function () {
                aladdin.header.forward({url: url});
            };
            rightButtonCallback.keep = true;
            aladdin.header.config({
                title:"关键积分",
                color:"#000000",
                backgroundColor:"#FFFFFF",
                fontSize:'16px',
                underlineVisible:true,
                leftButtonText:'',
                leftButtonVisible:true,
                leftButtonFontSize: '16px',
                rightButtonVisible:true,
                rightButtonTextColor:"#34a1fc",
                rightButtonText:"问题反馈",
                rightButtonFontSize: '16px',
                rightButtonBackgroundColor:"#ffffff",
                leftButtonIcon:"/sicaih5/dist/static/back.png",
                leftButtonCallback:function(){aladdin.navigator.back()},
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
