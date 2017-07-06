/**
 * Created by ISYP. on 2017/6/12.
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
require('../../main');
Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueRouter);
//配置路由
 const router = new VueRouter({
        routes : [{
            path: '/',
            component: function (resolve) {
                require(['./components/personalScore.vue'], resolve)
            }
        },
            {
                path:'/personalScore',
                component:function (resolve) {
                    require(['./components/personalScore.vue'],resolve)
                },
            },
            {
                path:'/teamImportantScore',
                component:function (resolve) {
                    require(['./components/teamImportantScore.vue'],resolve)
                },
            },
            {
                path:'/incomeInstruction',
                component:function (resolve) {
                    require(['./components/incomeInstruction.vue'],resolve)
                },
            },
            {
                path:'/teamBonusScore',
                component:function (resolve) {
                    require(['./components/teamBonusScore.vue'],resolve)
                },
            },
            {
                path:'/presentFactor',
                component:function (resolve) {
                    require(['./components/presentFactor.vue'],resolve)
                },
            },
            {
                path:'/investmentBenifitsTeamer',
                component:function (resolve) {
                    require(['./components/investmentBenifitsTeamer.vue'],resolve)
                },
            }
        ]
})

//启动应用
//路由器会创建一个App实例，并且挂载到选择符#index匹配的元素上。
new Vue({
    router:router
}).$mount('#teamLeader');

