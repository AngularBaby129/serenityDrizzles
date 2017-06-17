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
  routes:[{
    path: '/',
    component: function (resolve) {
      require(['./components/obligation.vue'], resolve)
    }
  }, {
    path: '/obligation',
    component: function (resolve) {
      require(['./components/obligation.vue'], resolve)
    }
  }
  ]
})

//启动应用
//路由器会创建一个App实例，并且挂载到选择符#index匹配的元素上。
new Vue({
  router:router
}).$mount('#dutypoint');

