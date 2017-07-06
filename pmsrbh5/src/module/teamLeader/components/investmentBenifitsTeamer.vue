<template>
    <div class="wrap resScore">
        <section class="kindsIntegration-wrapper">
            <ul class="kindsIntegration-tips">
                <li>最近更新日期 {{update | initPoints}}</li>
                <li>共创利{{actionPoints | initPoints}}元</li>
            </ul>
            <div class="kindsIntegration-content">
                <ul class="kindsIntegration-contentList">
                    <li >
                        <p class="listLeft">类型</p>
                        <p class="listRight" style="color: #666;font-size: .28rem">创利</p>
                    </li>
                    <li @click="gooToPointHtml()">
                        <p class="listLeft">大额存单</p>
                        <p class="listRight">{{InvestmentScore | initPoints}}<span class="icon icon-arrowLg-r"></span></p>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script>
    require("../../../modulecss/moduleSalespoints.css");
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
                            url:'salesPoints/selProjectInfList.do',
                            type: 'POST',
                            data: {
                                //TODO
                                'ticket':ticket,
                                //'userId': 'SHIXIAOYE002',//ticket,
                                'date': date,//日期 YYYY-MM/YYYY-MM-DD
                                'inputType':'私行团队长|财富团队长'
                            },
                            beforeSend:  {
                                'brcpEaSessionTicket':ticket
                            },
                            success: function(err,res) {
                                aladdin.loading.stop();
                                if(err){
                                    aladdin.toast.show({message: '加载错误 '});
                                    aladdin.loading.stop({canCancel: false});
                                    _self.update = '--';
                                    _self.actionPoints = '--';
                                    _self.InvestmentScore = '--';
                                    return;
                                }
                                _self.update = '--';
                                _self.actionPoints = '--';
                                _self.InvestmentScore = '--';
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
                                    var investmentScore = result.selProjectInf;
                                    _self.update = result.Stat_date ? result.Stat_date : '--';
                                    _self.actionPoints = investmentScore[0].DEPOSIT_SUM ? investmentScore[0].DEPOSIT_SUM : '--';
                                    _self.InvestmentScore = investmentScore[0].CERTIFICATE_DEPOSIT ? investmentScore[0].CERTIFICATE_DEPOSIT : '--';

                                }


                            }

                        });
                    }
                });
            },
            gooToPointHtml(){
                var month = '0'+this.date.month;
                let date = this.date.year.toString();
                let url = '../salespoints/depositProduct.html?financingType=DECD&dateTime='+date + month;
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
                actionPoints:'',
                currentDate:'',
                showDateSelect:false,
                showCustomernteractionExplainModal:false,
                explainModalTitle:'',
                InvestmentScore: '',
                DepositScore: '',
                InvestmentVal: '',
                DepositVal: '',
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

            //调用原生app头部
            var url = '/sicaih5/dist/module/mine.html#/problemFeedback?type=investmentBenifitsTeamer';
            var rightButtonCallback = function () {
                aladdin.Header.forward({url: url});
            };
            rightButtonCallback.keep = true;
            aladdin.Header.config({
                title: '存款创利',
                rightButtonVisible: false,
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