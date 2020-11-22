import Vue from 'vue'
import App from './App'
import utils from './util/utils.js'
import constants from './util/constants.js'
import request from './util/request.js'
import store from './util/store'
import json from './json.js'

// #ifdef H5
import WXConfig from './util/wechatShare' 
// #endif
request.setConfig({
	baseUrl: constants.SUQIAN_HOST_URI,
	debug: true
})

// 请求拦截
request.interceptor.request = (config => {
	// 给data添加全局请求参数uid
	/* if (!config.data.uid) {
		config.data.uid = 100
	} */
	// 给header添加全局请求参数token
	if (!config.header['x-token']) {
		if (store.state.hasLogin && !utils.isEmpty(store.state.userinfo)) {
			if (store.state.userinfo.hasOwnProperty('x-token')) {
				config.header['x-token'] = store.state.userinfo['x-token'];
			} 
		} 
	}
	// 添加一个自定义的参数，默认异常请求都弹出一个toast提示
	if (config.toastError === undefined) {
		config.toastError = true
	}
	//console.info('request: ', config);
	return config;
})
// 全局的业务拦截
request.interceptor.response = ((res, config) => {
	if (res.ret_code === 0) {
		res.success = true;
	} else if (res.ret_code === 99999) {
		// token失效，需要重新登录
		res.success = true;

		store.state.hasLogin = false
		store.state.userinfo = {}
		uni.removeStorage({
			key: 'userinfo'
		});
		if(config.needLogin){
			uni.showModal({
				title:'提示',
				content: '请先登录查看个人数据',
				success: function (res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					} else if (res.cancel) {
						uni.navigateBack({	
							delta: 1,
						});
					}
				}
			})
		}
	}else if(res.ret_code === 999999){
		res.success = false;
		res.ret_msg = "服务器异常";
	}else{
		res.success = false;
	}
	return res;
})

// 全局的错误异常处理
request.interceptor.fail = ((res, config) => {
	let ret = res;
	let msg = ''
	if (res.statusCode === 200) { // 业务错误
		//msg = res.data.ret_msg
		msg = "网络异常，稍后再试!"
		ret = res.data
	} else if (res.statusCode > 0) { // HTTP错误
		//msg = '服务器异常[' + res.statusCode + ']'
		msg = "网络异常，稍后再试!"
	} else { // 其它错误
		//msg = res.data.ret_msg
		msg = "网络异常，稍后再试!"
	}
	if (config.toastError) {
		/* uni.showToast({
			title: msg,
			duration: 2000,
			icon: 'none'
		}) */
	}
	return ret;
})

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}

	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

Vue.config.productionTip = false

Vue.prototype.$utils = utils;
Vue.prototype.$constants = constants;
Vue.prototype.$request = request
Vue.prototype.$json = json

Vue.prototype.$api = {
	msg,
	prePage
};
Vue.prototype.$store = store;
// #ifdef H5
Vue.prototype.$WXConfig = WXConfig
// #endif
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
