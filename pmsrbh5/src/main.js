/*全局设置*/
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from'vue-resource';
import FastClick from './libs/fastclick';
Vue.use(VueRouter);
Vue.use(VueResource);
window.Vue = Vue;
window.VueRouter = VueRouter;
window.$ = require('./libs/jquery-1.12.4');
window.aladdin = require('./libs/aladdin.ibank');
require('./libs/aladdin.aikeplatform');
require('./libs/aladdin.ext');
require('./libs/flexible');

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

//vue-resource http 访问数据

/**
 * 设置导航
 * @param {Object} opts
 *   opts参数:
 *      title  | String  | 导航头标题
 *      color | String | 标题字体颜色
 *      backgroundColor | String | 背影色
 *      fontSize | String | 字体大小
 *      leftButtonVisible | String | 是否显示左侧按钮(默认true)
 *      leftButtonText | String |左侧按钮文字
 *      leftButtonFontSize | String | 左侧按钮文字大小
 *      leftButtonIcon | String | 左侧按钮Icon
 *      leftButtonTextColor | String | 左侧按钮字体颜色
 *      leftButtonBackgroundColor | String | 左侧按钮背影色
 *      leftButtonCallback | Function | 左侧按钮回调
 *      rightButtonVisible | String | 是否显示右侧按钮(默认false)
 *      rightButtonText | String |右侧按钮文字
 *      rightButtonFontSize | String | 右侧按钮文字大小
 *      rightButtonIcon | String | 右侧按钮Icon
 *      rightButtonTextColor | String | 右侧按钮字体颜色
 *      rightButtonBackgroundColor | String | 右侧按钮背影色
 *      rightButtonCallback | Function | 右侧按钮回调
 */
let u = navigator.userAgent;
let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
let Header = {
	config(opts) {
		opts.title = opts.title || '';
		opts.color = opts.color || '#000000';
		opts.fontSize = opts.fontSize || '18px';
		opts.backgroundColor = opts.backgroundColor || '#ffffff';
		opts.leftButtonVisible = opts.leftButtonVisible === undefined ? true : opts.leftButtonVisible;
		opts.leftButtonText = opts.leftButtonText || '';
		opts.leftButtonCallback = opts.leftButtonCallback || function() {
				aladdin.navigator.back()
			};
		opts.leftButtonFontSize = opts.leftButtonFontSize || '16px';
		opts.leftButtonIcon = opts.leftButtonIcon === undefined ? '/sicaih5/dist/static/back.png' : opts.leftButtonIcon;
		opts.rightButtonFontSize = opts.rightButtonFontSize || '16px';
		opts.leftButtonTextColor = opts.leftButtonTextColor || '#34a1fc';
		opts.rightButtonTextColor = opts.rightButtonTextColor || '#34a1fc';
		opts.rightButtonVisible = opts.rightButtonVisible || false;
		aladdin.header.config(opts, function() {});
	},
	forward(opts) {
		var options;
		if (isAndroid) {
			options = {
				title: opts.title || '',
				url: opts.url || '',
				type: opts.type || 'webapp',
				header: {
					visible: opts.visible === undefined ? true : opts.visible
				}
			};
		} else {
			options = {
				title: opts.title || '',
				url: opts.url || '',
				type: opts.type || 'webapp',
				header: {
					visible: opts.visible === undefined ? true : opts.visible,
					config: {
						color: opts.color || '#000000',
						fontSize: opts.fontSize || '18px',
						backgroundColor: opts.backgroundColor || '#ffffff',
						leftButtonVisible: opts.leftButtonVisible === undefined ? true : opts.leftButtonVisible,
						rightButtonVisible: opts.rightButtonVisible || false,
						leftButtonText: opts.leftButtonText || '',
						leftButtonFontSize: opts.leftButtonFontSize || '16px',
						leftButtonIcon: opts.leftButtonIcon || '/sicaih5/dist/static/back.png'
					}
				}
			};
		}
		aladdin.navigator.forward(options);
	}
};

window.aladdin.Header = Header;

/**
 * 获取URL参数对象
 * @param queryString
 * @returns {{}}
 */
var getQueryMap = function(queryString) {
	debugger;
	if(typeof queryString !== 'string') return queryString;
	if(!queryString) return queryString;
	//queryString = "?" + queryString;
	queryString = "?" + decodeURIComponent(queryString);
	var paramObj = {},
		paramList,
		oneQueryMatch,
		//regGlobal = /[\?\&][^\?\&]+=[^\?\&#]*/g,
		//regOne = /[\?\&]([^=\?]+)=([^\?\&#]*)/;
		regGlobal = /[\?\&][^\?\&]+=[^\?\&]*/g,
		regOne = /[\?\&]([^=\?]+)=([^\?\&]*)/;

	queryString = queryString || location.href;

	paramList = queryString.match(regGlobal);

	if (!paramList) {
		return paramObj;
	}

	for (var i = 0, len = paramList.length; i < len; i++) {
		oneQueryMatch = paramList[i].match(regOne);
		if (null === oneQueryMatch) {
			continue;
		}
		paramObj[oneQueryMatch[1]] = oneQueryMatch[2];
	}

	return paramObj;
};

window.getQueryMap = getQueryMap;