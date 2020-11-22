import constants from '@/util/constants.js'
import request from '@/util/request.js'
import utils from '@/util/utils.js'
import wx from '@/util/jweixin-module.js';

export default {
	wxShowMenu: function(shareTitle) {
		var that = this;
		if (utils.isEmpty(shareTitle)) {
			shareTitle = "学习宝典"
		}
		request
			.get({
				url: constants.INITWXJSCONFIG + "?oid=6&url=" + encodeURIComponent(window.location.href.split("#")[0]),
			})
			.then(
				res => { //成功
					console.log(res);
					var appId = res.initWXJSConfig.appId;
					var nonceStr = res.initWXJSConfig.nonceStr;
					var signature = res.initWXJSConfig.signature;
					var timestamp = res.initWXJSConfig.timestamp;
					var url = res.initWXJSConfig.url;
					wx.config({
						debug: false, //生产环境需要关闭debug模式  测试环境下可以设置为true  可以在开发者工具中查看问题
						appId: appId, //appId通过微信服务号后台查看
						timestamp: timestamp, //生成签名的时间戳
						nonceStr: nonceStr, //生成签名的随机字符串
						signature: signature, //签名
						jsApiList: [ //需要调用的JS接口列表
							'checkJsApi',
							'updateAppMessageShareData', //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0） 新接口
							'updateTimelineShareData', //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0） 老接口
							'onMenuShareTimeline', //分享到朋友圈 老接口
							'onMenuShareAppMessage', //分享给盆友 老接口
							'onMenuShareQQ',
						]
					});
					that.wechatReady(shareTitle);
				},
				res => { //失败
					console.log("js-sdk(error)=>", res);
				}
			);
	},
	wechatReady: function(shareTitle) {
		var that = this;
		if (utils.isEmpty(shareTitle)) {
			shareTitle = "学习宝典"
		}
		console.log("wechatReady----- refreshUrl()", window.location.href)
		//配置自定义分享内容
		window.share_config = {
			'share': {
				'imgUrl': 'http://wwj.bthgame.com/upload/logo/20190916033207900.png', // 这里是需要展示的图标
				'desc': '点击可以查看更多', // 这是分享展示的摘要
				'title': shareTitle, // 这是分享展示卡片的标题
				'link': window.location.href, // 这里是分享的网址
				'type': 'link',
				'success': function(rr) {
					console.log('微信分享成功' + JSON.stringify(rr))
				},
				'cancel': function(tt) {
					console.log('微信分享失败' + JSON.stringify(tt));
				}
			}
		};
		wx.ready(function(res) {
			console.log("wx.ready=>", res);
			wx.checkJsApi({
				jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData', 'onMenuShareTimeline',
					'onMenuShareAppMessage', 'onMenuShareQQ'
				], // 需要检测的JS接口列表，所有JS接口列表见附录2,
				success: function(res) {
					// 以键值对的形式返回，可用的api值true，不可用为false
					// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
					console.log("wx.checkJsApi(判断当前客户端版本是否支持指定JS接口)=>", res);
				}
			});
			wx.updateTimelineShareData(share_config.share);
			wx.updateAppMessageShareData(share_config.share);
			wx.onMenuShareTimeline(share_config.share);
			wx.onMenuShareAppMessage(share_config.share);
			wx.onMenuShareQQ(share_config.share);
		});

		wx.error(function(res) {
			console.log("wx.error=>", res)
		});
	},
}
