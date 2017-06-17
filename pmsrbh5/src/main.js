/*全局设置*/
import Vue from 'vue'
import VueRouter from 'vue-router'
import FastClick from './libs/fastclick'
window.Vue = Vue;
window.VueRouter = VueRouter;
//实例化Vue的filter
// Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
window.$ = require('./libs/jquery-1.12.4');
window.aladdin = require('./libs/aladdin.ibank');
require('./libs/aladdin.aikeplatform');
require('./libs/aladdin.ext');
/**
 * @description环境配置
 * @param {path} path
 */

var path = {
	//生产环境
	pro: 'https://rsb.pingan.com.cn/bron/pmsrb/emp/banka/',
	//测试环境
	stg: 'https://rsb-stg.pingan.com.cn/bron/pmsrb/emp/banka/',
	//localhost
	loc: 'http://localhost:81/emp/banka/'
}
window.path = path;

/**
 *@description 请求数据
 * @param 参数param
 *
 */
var aladdinRequestData = function(param) {
	aladdin.http.request({
			// 请求的 url 地址
			url: path.stg + param.url || "",
			// 请求的参数，会自动转换为 `querystring`
			// 如 ?name=bob&age=26&hobbies=football&hobbies=basketball
			qs: {},
			// 支持 `get`、`post`、`put`、`delete`、`options`，默认为 `get`
			method: param.type || 'post',
			body: param.data || {},
			// 请求超时时间
			timeout: 3000,
			// 请求头
			headers: param.beforeSend || {}
		}, param.success //带两个参数（err，res）发送请求回调 err相当于错误信息，res相当于成功后取到的数据
	);
}

window.aladdinRequestData = aladdinRequestData;

//取消click延迟时间（300ms）
FastClick.attach(window.document.body);
// 解绑事件
var notNeeded = FastClick.notNeeded(document.body);
$.fn.triggerFast = function(type) {
	this.trigger(type);
	if (!notNeeded) {
		this.trigger(type);
	}
};
