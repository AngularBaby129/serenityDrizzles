<template>
    <div class="wrap resScore">
        <section class="monthlyBonusStatement-wrapper">
            <h2 class="monthlyBonusStatement-title">本月收入=基本工资+月度奖金</h2>
            <dl class="monthlyBonusStatement-content">
                <dt>基本工资=职级基本工资</dt>
                <dd>您目前职级基本工资
                    <mark>{{BasicSalary | initPoints}}</mark>
                    元
                </dd>
            </dl>
            <dl class="monthlyBonusStatement-content mt20">
                <dt>月度奖金=【（团队总关键积分*奖励系数*产能达标系数+团队总奖励积分）*20%+个人积分】*积分单价</dt>
                <dd>1、团队总关键积分=团队成员（含自己）的关键积分总和；</dd>
                <dd>2、奖励系数：由团队总关键积分决定，设定分档系数；</dd>
                <dd>3、产能达标系数：由团队成员（不含自己）的关键积分合格率来决定分档系数；</dd>
                <dd>4、团队总奖励积分=团队成员的奖励积分总和；</dd>
                <dd>5、个人积分：投资理财的创利得分和存款类大额存单的创利得分；</dd>
                <dd>6、积分单价：1分=
                    <mark>{{UnitPrice | initPoints}}</mark>
                    元；
                </dd>
                <dd>7、底线分：按关键积分标准的
                    <mark>{{UppLimit | initPoints}}</mark>
                    设定，积分标准值=MAX（职级标准，下属标准值总和），您当前的积分标准值为
                    <mark>{{KeyStandard | initPoints}}</mark>
                    分，小于底线分则月度奖金为0；
                </dd>
                <dd>8、信用卡积分不计入关键积分奖金，不影响月度奖励系数、底线分和产能达标率，在半年考核中计入关键积分；  </dd>
            </dl>
        </section>
    </div>
</template>

<script>
    require("../../../modulecss/moduleMainpage.css");

    export default {
        components: {},
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
                            url: 'regimentLeader/getIncomeStatement.do',
                            type: 'POST',
                            data: {
                                //TODO
                                'ticket': '',
                                'userId': 'WUHAN428',//ticket,
                                'date': '201705',//日期 YYYY-MM/YYYY-MM-DD,
                                'inputType': '私行团队长|财富团队长'

                            },
                            beforeSend: {
                                'brcpEaSessionTicket': '',
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
                                debugger;
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

                                var basicSalary = result.levelSalary;//基本工资
                                var unitPrice = result.priceOneScore;//单价
                                var uppLimit = result.rangUppLimit;
                                var keyStandard = result.keyStandard;


                                if (result.responseCode == 0) {
                                    _self.BasicSalary = basicSalary;
                                    _self.UnitPrice = unitPrice;
                                    _self.UppLimit = uppLimit;
                                    _self.KeyStandard = keyStandard;
                                }
//                            }
//
//                        })
                    }
                });
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
                    isCenterLeft: true,
                    isCenterRight: true,
                    actionPoints: '',
                    currentDate: '',
                    showDateSelect: false,
                    showCustomernteractionExplainModal: false,
                    explainModalTitle: '',
                    BasicSalary: '',
                    UnitPrice: '',
                    UppLimit: '',
                    KeyStandard: ''
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
                    varmapMonth = mapDateTime.substring(5, 6);
                    this.date.month = parseInt(mapMonth);
                    this.date.year = parseInt(mapYear);
//                this.date = {
//                    year: parseInt(mapMonth),
//                    month: parseInt(mapYear), //                    day:date.getDate() //                };
                    var month = mapMonth + '';
                    if (month.length == 1) {
                        month =
                                '0' +
                                month;
                    }
                    this.queryResponsePoints
                    (
                            mapDateTime);
                    this.currentDate = mapYear + '年' + month + '月'
                } else {
                    var month =
                            date.getMonth() + 1 + '';
                    if (month.length == 1) {
                        month
                                = '0' + month;
                    }
                    var dateTime = date.getFullYear().toString(
                            ) + month;
                    //            var dateTime = date.format("YYYYMM");
                    console.log(
                            'dateTime=' +
                            dateTime)

                    ;
                    this.queryResponsePoints(
                            dateTime);
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
                    ;

                }
                ;

                var url ='/sicaih5/dist/module/mine.html#/problemFeedback?type=incomeInstruction';
                var rightButtonCallback = function () {
                            aladdin.Header.forward({url: url});
                        };
                rightButtonCallback.keep = true;
                aladdin.Header.config({
                    title: '收入说明',
                    rightButtonVisible: true,
                    rightButtonText: '问题反馈',
                    rightButtonFontSize: '16px',
                    rightButtonCallback: rightButtonCallback
                });
            },
            filters: {
                intPoint(inlineTemplate){
                    if (inlineTemplate) {
                        return inlineTemplate;
                    } else {
                        return '--';
                    }
                }
            }
        }
    }
</script>

<style>

</style>