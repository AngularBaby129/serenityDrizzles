<template>
    <div>
        <div v-show="!isRole07">
            <!--月份选择器-->
            <div class="modal" v-if="showDateSelect">
                <ScoreDateSelect :date="date"  @cancel="showDateSelect=false" @selectMonth="selectMonth"></ScoreDateSelect>
            </div>
            <div class="fifex">
                <div id="scoreDate">
                    <div id="scoreDate_l">
                        <span class="score_date">评分日期</span>
                    </div>
                    <div id="scoreDate_r">
                        <span class="icon_r" @click="leftDateSelect"></span>
                        <span class="date" @click="showDateSelectComponent">{{currentDate}}</span>
                        <!--@click="showDateSelectComponent"-->
                        <span class="icon_l" v-if="canClick"></span>
                        <span class="icon_l_2" @click="rightDateSelect" v-else></span>
                    </div>
                </div>
                <div class="tipText">次月4号0点之前结算本月评分，请及时完成评分</div>
            </div>
            <!-- TODO 上拉-->
            <div id="monthly-list" :style="{height:WinHeight+'px'}" class="list">
                <div id="scoreList">
                    <ul>
                        <li class="scoreList_li" v-for="(item,index) in monthlyScoreList">
                            <div class="li_gap"></div>
                            <div class="li_info">
                                <div class="info_l">
                                    <!--后端有头像返回才有portraitUrl字段-->
                                    <img class="l_icon" :src="item.portraitUrl" alt="" v-if="item.portraitUrl"/>
                                    <img class="l_icon" :src="item.portraitUrl | peopleUrl" alt="" v-else/>
                                </div>
                                <div class="info_r">
                                    <div class="r_up">
                                        <span class="r_name">{{item.umName}}</span>
                                        <span class="r_identity" v-show="item.jobTitle && item.jobTitle !='' "><span class="space"></span>{{item.jobTitle}}<span class="space"></span></span>
                                        <span class="r_sureButton" @click="change(item.checkStatus,$event,index)" :class="{isChange:item.checkStatus !='1',expired:item.checkStatus =='2',sure:item.checkStatus =='0'}">{{item.checkStatus == '1'? '修改': (item.checkStatus == '2'?'已生效':(item.checkStatus == '0'?'确定':'已过期'))}}</span>
                                    </div>
                                    <div>
                                    </div>
                                    <div class="r_down">
                                        <div class="score_info">
                                            <span class="score_text">评分</span>
                                            <span class="score_num" v-show="item.checkStatus == '0'?false:true">{{item.point}}分</span>
                                            <span class="dateTime" v-show="item.checkStatus == '1' || item.checkStatus == '2'?true:false">{{item.modifyTime}}</span>
                                        </div>
                                        <div class="r_progressBar" v-show="item.checkStatus == '0'?true:false">
                                            <score :cur-index="index" v-on:getScore="saveScore" :current-score="item.point"></score>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 正在建设中 -->
        <div v-show="isRole07" class="mainBody">
            <div  class="mainBodyNo11">
                <b class="que-sheng"></b>
                <div class="noAcNet">
                    <div class="noAcText">月度评分正在建设中,敬请期待~</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    //    import Vue from 'vue'
    //    import MintUI from 'mint-ui'
    require('mint-ui/lib/style.css')
    //    Vue.use(MintUI)
    import ScoreDateSelect from '../../achievement/components/ScoreDateSelect.vue'
    import Score from './../components/Score'
    export default{
        data() {
            return {
//                umCode:App.localStorage.get('PAPPUserInfoRole')["umcode"],
                umCode: '',
                WinHeight: document.body.clientHeight-160,
                isPull: false,
                pageNume:1,
                pageSize:20,
                totalPage:0,
                changeDate:{},
                currentDate: '',
                date: {
                    year: 0,
                    month: 0,
                    // day: 0
                },
                showDateSelect:false,
                datePickShow:false,
                range:false,
                selectScore: 0,
                monthlyScoreList: [],
                monthPointId:'',
                firstIndex:'',
                canClick:true,
                isRole07: false,
                roleType:''
            }
        },
        components: {
            ScoreDateSelect,
            Score
        },
        created:function() {
            App.Header.config({
                title: '月度评分'
            });
            App.localStorage.get('PAPPUserInfoRole', (data) => {
                this.umCode = data.umcode || '';
                this.roleType = data.roleType || '';
                // 请求月度评分数据,默认传空
                this.initRequest(null)
            });
            // 支行长角色（07）时，展示正在建设中
//            this.roleType =  (App.localStorage.get('PAPPUserInfoRole') || {})["roleType"];
//            App.localStorage.get('PAPPUserInfoRole', (data) => {
//                this.roleType = data.roleType || ''
//            });
            this.isRole07 = false;
            var date = new Date();
            var month = date.getMonth() + 1 + '';
            if (month.length == 1) {
                month = '0' + month;
            }
            this.date = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
            this.currentDate = this.date.year + '-' + month;
            // 请求月度评分数据,默认传空
//            this.initRequest(null)
        },
        mounted () {
            var self = this
            if ($('#monthly-list')) {
                window.allScoreScroll = new Refresh($('#monthly-list')[0], {
                    // 是否启用下拉刷新
                    pullDownToRefresh: false,
                    // 是否启用上拉加载
                    pullUpToLoadMore: true,
                    loadMoreContent: function () {
                        if (self.pageNume < self.totalPage) {
                            self.pageNume++;
                            self.initRequest(self.currentDate);
                        }else{
                            window.allScoreScroll && window.allScoreScroll.disablePullUpToLoadMore();
                        }
                    }
                })
            }
        },
        methods:{
            //请求月度评分数据
            initRequest(date_Time){
                var self = this;
                aladdin.aike_tool.getTicket(function(err,ticket){
                    if(err && !ticket){
                        App.Dialog.tip(err.message);
                    }else{
                        $.ajax({
                            url: App.Api.prefix + '/responsePoints/queryMonthlyScore',
//                            url: 'http://localhost:8088/linkTest',
                            type: 'POST',
                            data: {
                                ticket: ticket,
                                dateTime: date_Time,
                                updateBy:self.umCode,
                                pageNum: self.pageNume,
                                pageSize: self.pageSize,
                                roleType: self.roleType
                            },
                            success: (res) => {
                                if (res.returnCode == '0000' && res.returnData && res.returnData.monthlyScoreList.length !=0) {
                                    // 上拉加载更多
                                    self.totalPage = res.returnData.pageTotal
                                    self.monthlyScoreList = self.monthlyScoreList.concat(res.returnData.monthlyScoreList);
                                    if(self.pageNume >= res.returnData.pageTotal) {
                                        window.allScoreScroll && window.allScoreScroll.disablePullUpToLoadMore();
                                        $('#monthly-list .pullWarp').last().css('display','block') //提示没有更多
//                                        if(self.pageNume === 1) {
//                                            $('#monthly-list .pullWarp').last().css('display','none') //没有提示
//                                        }else{
//                                            $('#monthly-list .pullWarp').last().css('display','block') //提示没有更多
//                                        }
                                    } else {
                                        window.allScoreScroll && window.allScoreScroll.enablePullUpToLoadMore();
                                    }
                                    window.allScoreScroll && window.allScoreScroll.enablePullDownToRefresh();
                                    window.allScoreScroll && setTimeout(() => window.allScoreScroll.refresh(), 100);
                                }else if(res.returnCode == '0000' && res.returnData && res.returnData.monthlyScoreList.length ==0 && res.returnData.pageTotal == 0 ){
                                    window.allScoreScroll && window.allScoreScroll.disablePullUpToLoadMore();
                                    App.Dialog.tip('暂无评分数据');
                                }else{
                                    window.allScoreScroll && window.allScoreScroll.disablePullUpToLoadMore();
                                    App.Dialog.tip(res.returnMsg);
                                }
                            }
                        });
                    }
                });
            },
            change(checkStatus,$event,index){
                var self = this,
                    date = self.monthlyScoreList[index],
                    targetEl = $event.toElement.parentNode.parentNode.lastChild;
                if($event.target.innerHTML == '确定'){
                    if(self.firstIndex !=='' && self.firstIndex != index && !date.monthPointId){
                        self.monthPointId = ''
                    };
                    // 确认埋点
                    App.Utils.trackEventDefined('首页1-月度评分','点击确认');
                    aladdin.aike_tool.getTicket(function(err,ticket){
                        var options = {
                            checkStatus:checkStatus,
                            iobsKey: date.picUrl,
                            jobTitle: date.jobTitle,
                            umName: date.umName,
                            umcode: date.umcode,
                            ticket: ticket,
                            updateBy:self.umCode,
                            point: parseInt(targetEl.getElementsByClassName('score-text')[0].innerText),
                            monthPointId: self.monthPointId,
                            dateTime:$('.date').html()
                        };
                        if(err && !ticket){
                            App.Dialog.tip(err.message);
                        }else{
                            $.ajax({
                                url: App.Api.prefix + '/responsePoints/saveMonthlyScore',
//                                url: 'http://localhost:8088/linkTest',
                                type: 'POST',
                                data: options,
                                success: (res) => {
                                    if (res.returnCode == '0000' && res.returnData) {
                                        self.firstIndex = index;
                                        self.monthPointId = res.returnData.monthPointId;
                                        targetEl.lastChild.style.display = "none";
                                        targetEl.firstChild.childNodes[2].style.display = "inline-block";
                                        console.log(targetEl.firstChild.childNodes)
                                        targetEl.firstChild.childNodes[2].innerHTML = targetEl.getElementsByClassName('score-text')[0].innerText;
                                        targetEl.firstChild.lastChild.style.display = 'block';
                                        targetEl.firstChild.lastChild.innerHTML = res.returnData.modifyTime;
//                                        targetEl.firstChild.childNodes[3].style.display = "inline-block";
                                        $event.target.textContent = '修改';
                                    }else{
                                        App.Dialog.tip(res.returnMsg);
                                    }
                                }
                            });
                        }
                        return
                    });
                };
                if($event.target.textContent != '修改'){
                    return
                };
                if($event.target.innerHTML == '修改'){
                    if(date.monthPointId){
                        self.monthPointId = date.monthPointId;
                    };
                    // 修改埋点
                    App.Utils.trackEventDefined( '首页1-月度评分','点击修改');
                    let touchEle = document.createElement('div')
                    touchEle.setAttribute('class','touch-ele')
                    document.getElementsByClassName('mt-range-thumb')[0].appendChild(touchEle)
                    $event.target.textContent = '确定';
                    targetEl.firstChild.lastChild.style.display = "none";
                    targetEl.firstChild.childNodes[2].style.display = "none";
                    targetEl.lastChild.style.display = "block"
                };
            },
            // 获取分数
            saveScore: function (value) {
                this.selectScore = value
            },
            leftDateSelect(){
                var lessMonth = parseInt(this.date.month-1) < 1 ? '12' : parseInt(this.date.month)-1;
                var lessYear = lessMonth === '12' ? parseInt(this.date.year)-1 : this.date.year;
//                $('.icon_l').css("background-image","url('../images/left.png')");
                this.canClick = false;
                this.date = {
                    year:lessYear,
                    month:lessMonth
                }
                if(parseInt(lessMonth) < 10) {
                    lessMonth = '0'+lessMonth;
                }
                this.currentDate = lessYear + '-'+lessMonth;
                this.pageNume = 1;
                this.monthlyScoreList = [];
                this.initRequest(this.currentDate);
            },
            showDateSelectComponent(){
                this.showDateSelect=true;
            },
            rightDateSelect(){
                var nowMonth = new Date();
                var lessMonth = parseInt(this.date.month+1) > 12 ? '1' : parseInt(this.date.month)+1;
                var lessYear = lessMonth === '1' ? parseInt(this.date.year)+1 : this.date.year;
                if(lessYear == nowMonth.getFullYear() && nowMonth.getMonth() == this.date.month){
                    this.canClick = true;
                }
                if(lessYear == nowMonth.getFullYear() && nowMonth.getMonth()+1 == this.date.month){
                    return;
                };
                this.date = {
                    year:lessYear,
                    month:lessMonth
                }
                if(parseInt(lessMonth) < 10) {
                    lessMonth = '0'+lessMonth;
                }
                this.currentDate = lessYear + '-'+lessMonth;
                this.pageNume = 1;
                this.monthlyScoreList = [];
                this.initRequest(this.currentDate);
            },
            selectMonth (month,year) {
                var nowDate = new Date();
                if(year == nowDate.getFullYear() && month == nowDate.getMonth()+1){
                    this.canClick = true;
                }else{
                    this.canClick = false;
                };
                this.date.month = month;
                this.date.year = year;
                month = month+'';
                if(month.length == 1)
                {
                    month = '0'+month;
                }
                this.currentDate = year + '-'+month;
                this.pageNume = 1;
                this.monthlyScoreList = [];
                this.initRequest(this.currentDate);

            }
        },
        filters:{
            peopleUrl(sex){
                return require("../images/people.png")
            }
        }
    }
</script>
<style type="text/css">
    .modal{
        position:fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        background-color:rgba(0,0,0,0.5);
        display:-webkit-flex;
        display:flex;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-align-items: center;
        align-items: center;
    }
    #scoreDate {
        height: 4.5rem;
        font-size: 1.4rem;
        color: #666666;
        width: 100%;
        line-height: 4.5rem;
    }

    #scoreDate_r, #scoreDate_l, .date, .info_l, .info_r, .r_name, .r_identity, .r_sureButton, .score_num, .score_text, .score_bar,.space,.l_icon {
        display: inline-block;
    }

    #scoreDate_l {
        margin-left: 1.5rem;
    }

    #scoreDate_r {

        /*overflow: hidden;*/
        position: absolute;

        right: 0.5rem;
        height: 4.5rem;
        width: 12rem;
        line-height: 4.5rem;

    }
    .tipText{
        height:3.5rem;
        line-height:3.5rem;
        color:#333333;
        font-size:1.2rem;
        margin-left: 1.5rem;
        border-top:1px solid  #d1d1d1;
    }
    .scoreList_li {
        background-color: #f5f5f5;
        border-bottom: 1px solid #ebebeb;
    }
    .icon_r {
        padding:5px 10px;
        float: left;
        height: 4.5rem;
        width: 2rem;
        background: url('../images/left.png') no-repeat center left;
    }

    .icon_l {
        padding:5px 10px;
        float: right;
        height: 4.5rem;
        width: 2rem;
        background: url('../../achievement/images/arrow-right-disabled.png')  no-repeat center right;
    }
    .icon_l_2{
        padding:5px 10px;
        float: right;
        height: 4.5rem;
        width: 2rem;
        background: url('../images/right.png')  no-repeat center right;
    }

    .date {
        height: 4.5rem;
        width: 8rem;
        line-height: 4.5rem;
        font-size: 1.4rem;
        color: #666666;
        text-align: center;
        /*margin: 0 1.92px;*/
    }

    .li_gap {
        height: 1rem;
        width: 100%;
        background: #f0f0f0;
    }
    .space {
        width:10px;
    }

    .info_l {
        height: 5.2rem;
        width: 5.2rem;
        margin: 1rem 0 0 1.5rem;
        /*background: url('../images/people.png') no-repeat;*/
    }

    .li_info {
        height: 10.1rem;
        width: 100%;
        position: relative;
    }

    .info_r {
        margin-top: 1rem;
        position:absolute;
        right:1rem;
    }

    .r_up {
        position: relative;
        width: 28.5rem;
    }

    .r_name {
        font-size: 1.6rem;
        color: #000000;
        margin: 0.25rem 0 0 1.6rem;
    }

    .r_identity {
        height: 1.4rem;
        line-height: 1.4rem;
        /*width: 133px;*/
        background: #77beff;
        color: #ffffff;
        text-align: center;
        border-radius: 0.25rem;
        margin-left: 1rem;
        bottom: 0.5rem;
        position: absolute;
    }

    .r_sureButton {
        color: #34a1fc;
        font-size: 1.2rem;
        position: absolute;
        bottom: 0px;
        right: 0px;
        margin-left:30%;
        padding: 5px 10px;
    }
    .r_progressBar {
        margin-left:1rem;
    }
    .r_down {
        margin: 1.3rem 1rem 0 1.6rem;
    }

    .score_text {
        font-size: 1.2rem;
        color: #999999;
    }

    .score_num {
        font-size: 1.6rem;
        margin-left:1rem;
        font-weight: bold;
        color: #f39738;
    }

    .score_bar {
        margin: 1rem 0 0 5rem;
        height: 0.5rem;
        width: 15rem;
    }

    .score_info {
        width:27rem;
        position: relative;
    }
    .isChange {
        color:#000000;
    }
    .expired{
        color:#999999;
    }
    .sure{
        color:#34a1fc;
    }
    .dateTime {
        color:#999999;
        font-size: 1rem;
        position: absolute;
        right: 0px;
        bottom: 0px;
    }
    .mt-range-content{
        margin:0 1.5rem 0 1rem;
    }
    .l_icon{
        height:5rem;
        width:5rem;
        background-size: 5rem 5rem;
        background-repeat:no-repeat;
        border-radius: 5rem;
    }


    .mainBodyNo11 {
        width: 100%;
        /* height: 1012px; */
        text-align: center;
        background-color: #f5f5f5;
        /* padding-top: 280px; */
    }
    .que-sheng {
        margin: 0 auto;
        margin-top: 40%;
        display: inline-block;
        width: 265px;
        height: 265px;
        background: url("../images/que-sheng.png") no-repeat;
    }
    .mainBody .noAcNet {
        width: 100%;
        text-align: center;
    }
    .mainBody .noAcText {
        width: 100%;
        color: #999;
        font-size: 1.4rem;
        text-align: center;
        padding: 40px 0 20px 0;
    }
    .fifex{
        width:100%;
        position:fixed;
        top:0;
        z-index:99;
        background-color: #f5f5f5;
    }
    .list{
        position:relative;
        top:160px;
    }
</style>
