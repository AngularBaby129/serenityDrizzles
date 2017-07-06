<template>
    <section class="monthlyBonusStatement-wrapper">
        <h2 class="monthlyBonusStatement-title">月度奖金=团队积分奖金+个人积分奖金</h2>
        <dl class="monthlyBonusStatement-content">
            <dt>团队积分奖金=MAX（下辖人员积分奖金和*20%，下辖人员人均积分奖金）</dt>
            <dd>1、下辖人员包括渠道经理、柜员、理财服务经理、社区支行负责人；</dd>
        </dl>
        <dl class="monthlyBonusStatement-content mt20">
            <dt>个人积分奖金=个人积分*积分单价</dt>
            <dd>1、个人积分为投资理财创利得分和存款类大额存款和创利得分；</dd>
            <dd>2、积分单价：1分=<mark>{{UnitPrice | intPoint}}</mark>元。</dd>
        </dl>
    </section>
</template>
<script>
    require("../../../modulecss/moduleMainpage.css");

    export default {
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
                            url:'subbranchManager/getMonthBonusStatement.do',
                            type: 'POST',
                            data: {
                                //TODO
                                'ticket':ticket,
                                'userId': 'SHIXIAOYE002',//ticket,
                                'date': date,//日期 YYYY-MM/YYYY-MM-DD
                                'inputType':'支行长'
                            },
                            beforeSend:  {
                                'brcpEaSessionTicket':ticket
                            },
                            success: function(err,res) {
                                aladdin.loading.stop();
                                _self.actionPoints = '--';
                                _self.BasicSalary = '';
                                _self.UnitPrice = '';
                                if(err){
                                    aladdin.toast.show({message: '加载错误 '});
                                    aladdin.loading.stop({canCancel: false});
                                    _self.actionPoints = '--';
                                    _self.BasicSalary = '';
                                    _self.UnitPrice = '';
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
                                var unitPrice = result.priceOneScore.AMOUNT;//单价
                                if(result.responseCode==0){
                                    _self.BasicSalary = basicSalary;
                                    _self.UnitPrice = unitPrice
                                }
                            }
                        });
                    }
                });
            },
        },
        data(){
            return{
                actionPoints:'',
                currentDate:'',
                showDateSelect:false,
                showCustomernteractionExplainModal:false,
                explainModalTitle:'',
                BasicSalary:'',
                UnitPrice:'',

            }

        },
        mounted () {
            var thisURL = document.URL;
            var  getval =thisURL.split('?')[1];
            var mapDateTime= getval.split("=")[1];
            var date = new Date();
            let _self = this;
            if (mapDateTime){
                var mapYear = mapDateTime.substring(0,4);
                var mapMonth = mapDateTime.substring(5,6);
                this.date.month = parseInt(mapMonth);
                this.date.year = parseInt(mapYear);
                this.date.day = date.getDate();
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
            //调用原生APP头部
            aladdin.Header.config({
                title: '月度奖金说明',
                rightButtonVisible: false
            });
        },
        filters:{
            intPoint(inlineTemplate){
                if (inlineTemplate){
                    return inlineTemplate;
                }else{
                    return '--';
                }
            }
        }

    }

</script>