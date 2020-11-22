import constants from '@/util/constants.js'
import request from '@/util/request.js'
import store from '@/util/store.js'
/**
 * 判断字符串是否为空 or null
 */
const isEmpty = (obj) => {
	if (typeof obj == "undefined" || obj == null || obj == "" || obj.length == 0) {
		return true;
	} else {
		return false;
	}
}
//统计某字符在字符串中出现频率
const strNum = (str, s) => {
	var num = 0;
	for (var i = 0; i < str.length; i++) {
		var key = str.charAt(i);
		if (key == s) {
			num++;
		}
	}
	return num;
}

//将秒数转换为时分秒格式
const formatSeconds = (value) => {

	var theTime = parseInt(value); // 秒
	var middle = 0; // 分
	var hour = 0; // 小时

	if (theTime > 60) {
		middle = parseInt(theTime / 60);
		theTime = parseInt(theTime % 60);
		if (middle > 60) {
			hour = parseInt(middle / 60);
			middle = parseInt(middle % 60);
		}
	}
	var result = "";
	if (parseInt(theTime) > 10) {
		result = "" + parseInt(theTime);
	} else {
		result = "0" + parseInt(theTime);
	}

	if (middle > 0) {
		if (parseInt(middle) > 10) {
			result = "" + parseInt(middle) + ":" + result;
		} else {
			result = "0" + parseInt(middle) + ":" + result;
		}
	} else {
		result = "00" + ":" + result;
	}
	if (hour > 0) {
		if (parseInt(hour) > 10) {
			result = "" + parseInt(hour) + ":" + result;
		} else {
			result = "0" + parseInt(hour) + ":" + result;
		}
	} else {
		result = "00" + ":" + result;
	}
	return result;
}

//获取个人信息
const getUserInfo = () => {
	var that = this;
	var baseUrl = constants.UCENTER_USERINFO;
	if(store.state.hasLogin){
		request
			.get({
				url: baseUrl,
			})
			.then(
				res => { //success
				if(res){
					if (res.hasOwnProperty('member')) {
						if (isEmpty(res.member.logo)) {
							userinfo.head_ico = "../../static/moren.jpg"
						} else {
							if (userinfo.head_ico.indexOf('http') == -1) {
								userinfo.head_ico = constants.SUQIAN_IMG_URI +"pic/thumb/w/100/h/100?pic="+ res.member.logo;
							} else {
								userinfo.head_ico = userinfo.head_ico;
							}
						}
					}
					if (res.hasOwnProperty('userBand')) {
						userinfo.point = res.userBand.point;
					}
					store.state.userinfo = userinfo;
					uni.setStorage({
						key: 'userinfo',
						data: store.state
					})
				}else{
					store.logout(store.state);
				}
				}
			);
	}else{
		return null;
	}
	var userinfo = uni.getStorageSync('userinfo').userinfo;
	return userinfo;
}

//收藏文章
const collectArticle = (id, part_id) => {
	var that = this;
	var baseUrl = constants.STUDY_ADDFAV + "?id=" + id + "&part_id=" + part_id;
	console.log("收藏文章", baseUrl)
	request
		.get({
			url: baseUrl,
			loadingTip: '加载中...',
			needLogin:true
		})
		.then(
			res => { //success
				uni.showToast({title:"收藏成功,我的收藏查看"});
			},
			res => { //fail

			}
		);
}

//取消收藏文章
const cancelCollectArticle = (id, part_id) => {
	var that = this;
	var baseUrl = constants.STUDY_DELFAV + "?id=" + id + "&part_id=" + part_id;
	request
		.get({
			url: baseUrl,
			loadingTip: '加载中...',
			needLogin:true
		})
		.then(
			res => { //success
				uni.showToast({title:"取消收藏成功"});
			},
			res => { //fail

			}
		);

}

//收藏文章
const likeArticle = (id, part_id,like=1) => {
	var that = this;
	var baseUrl = constants.STUDY_LIKE + "?id=" + id + "&part_id=" + part_id;
	console.log("喜欢文章", baseUrl)
	request
		.get({
			url: baseUrl,
			loadingTip: '加载中...',
			needLogin:true
		})
		.then(
			res => { //success
			if(like==1){
				uni.showToast({title:"不喜欢"});
			}else{
				uni.showToast({title:"喜欢"});
			}
			},
			res => { //fail

			}
		);
}

export default {
	isEmpty,
	strNum,
	formatSeconds,
	getUserInfo,
	collectArticle,
	cancelCollectArticle,
	likeArticle
}
