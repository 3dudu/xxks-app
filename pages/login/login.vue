<template>
	<view class="content">
			<view class="head">
				<image class="logo" src="../../static/logo.png"></image>
				<view class="version"><text>IT学和练</text></view>
			</view>
			<view class="login-card">
			<view class="login-title">
				<text>登录</text>
			</view>
			<view class="uni-form-item uni-column">
				<image class="login_img" src="../../static/login/shouji.png"></image>
				<input type="text" class="uni-input" name="login_info" @input="ilogoinfo" placeholder="输入您的手机号" />
			</view>
			<view class="uni-form-item uni-column">
				<image class="login_img" src="../../static/login/mima.png"></image>
				<input password="true" type="password" class="uni-input" name="password" @input="ipassword" placeholder="输入您的密码" />
			</view>
			<button type="primary" @click="submitLogin">登录</button>
			<button type="default" class="canclelogin" @click="ignorLogin">取消</button>
		</view>
		<view class="links1">
			<view class="links1" @click="gotoRegistration">注册</view>
			<view class="links2" @click="gotoForgetPassword">忘记密码</view>
		</view>
		<!-- #ifdef APP-PLUS || MP-WEIXIN -->
		<view class="links2" @click="WXLogin" v-if="wxok">
			<image style="width: 32px;height: 32px;" src="../../static/login/icon64_wx_logo.png"></image>
			<view>微信登录</view>
		</view>
		<!-- #endif -->
	</view>
</template>
<script>
	import {
		mapMutations
	} from 'vuex';
	var aweixin = null;
	export default {
		data(){
			return {
				login_info:"",
				password: "",
				wxok: false
			};
		},
		onLoad(){
			var that = this;
			// #ifdef APP-PLUS
			let sysInfo = uni.getSystemInfoSync();
			let platform = sysInfo.platform;
			var isWXInstalled = false;
			if(platform=='android'){
				isWXInstalled = true;
			}else{
				var WXApi = plus.ios.import("WXApi");
				isWXInstalled = WXApi?WXApi.isWXAppInstalled():false;
			}

			if(isWXInstalled){
			plus.oauth.getServices(function(services) {
				services.forEach(
					item => {
						if (item['id'] == 'weixin') {
							aweixin = item;
							that.wxok = true;
						}else{
							that.wxok = false;
						}
					}
				)

			}, function(e) {
				that.wxok = false
			});
			}
			// #endif
		},
		methods: {
			WXLogin: function(res) {
				var that = this;
				aweixin.authorize(function(e) {
					let code = e.code;
					that.loginSever(code);
				}, function(e) {
					that.$api.msg("微信授权失败");
				}, {
					scope: 'snsapi_userinfo',
					state: 'authorize',
					appid: 'wx0577b719b008b3fd'
				});
			},
			loginSever: function(code) {
				var that = this;
				that.$request
					.get({
						url: that.$constants.WX_LOGIN + "?oid=5&code=" + code + "&reg=" + 1,
						loadingTip: '加载中...'
					})
					.then(
						res => {
							that.login(res);
							uni.switchTab({
								url: '/pages/tabHome/tabHome'
							})
							return;
							if (this.$store.state.userinfo.user_company == null) {
								console.log("未选择公司");
								uni.navigateTo({
									url: '/pages/login/apply1'
								})
							} else if (this.$store.state.userinfo.user_company.is_accept == 0) {
								uni.navigateTo({
									url: '/pages/personalCenter/personalCenter'
								})
							} else if (this.$store.state.userinfo.user_company.is_accept == 1) {
								uni.switchTab({
									url: '/pages/tabStudy/tabStudy'
								})
							}
						},
						res => {
							that.$api.msg(res.ret_msg)
						}
				);
			},
			ignorLogin: function() {
				uni.switchTab({
					url: '/pages/tabHome/tabHome'
				});
			},
			ilogoinfo: function(event) {
				this.login_info = event.target.value;
			},
			ipassword: function(event) {
				this.password = event.target.value;
			},
			gotoWXLogin: function() {
				uni.navigateTo({
					url: '/pages/login/wxlogin'
				});
			},
			gotoRegistration: function() {
				uni.navigateTo({
					url: '/pages/login/registration1'
				});
			},
			gotoForgetPassword: function() {
				uni.navigateTo({
					url: '/pages/login/forget-password'
				});
			},
			submitLogin: function(res) {
				var that = this;
				var login_info = that.login_info;
				var password = that.password;
				if (that.$utils.isEmpty(login_info)) {
					that.$api.msg("请输入您的手机号");
					return;
				}
				if (that.$utils.isEmpty(password)) {
					that.$api.msg("输入您的密码");
					return;
				}
				that.$request
					.get({
						url: that.$constants.LOGIN + "?login_info=" + login_info + "&password=" + password,
						loadingTip: '加载中...'
					})
					.then(
						res => {
							that.login(res);
							uni.switchTab({
								url: '/pages/tabHome/tabHome'
							})
							return;
							if (this.$store.state.userinfo.user_company == null) {
								console.log("未选择公司");
								uni.navigateTo({
									url: '/pages/login/apply1'
								})
							} else if (this.$store.state.userinfo.user_company.is_accept == 0) {
								uni.navigateTo({
									url: '/pages/personalCenter/personalCenter'
								})
							} else if (this.$store.state.userinfo.user_company.is_accept == 1) {
								uni.switchTab({
									url: '/pages/tabHome/tabHome'
								})
							}
						},
						res => {
							that.$api.msg(res.ret_msg)
						}
				);
			},
			...mapMutations(['login'])
		}
	}
	
</script>

<style lang="scss">
	.wxbtn {
		width: 100%;
		height: 50px;
		display: block;
		border-radius: 5px;
	}

	.content {
		background-color: #FFFFFF;
	}

.head{
	width: 100%;
    margin-bottom: 40upx;
}
.logo{
	height: 100px;
    width: 100px;
	border-radius: 10px;
    margin: 0 auto;
    margin-top: 80upx;
    display: block;
}
.version{
	text-align: center;
	color: #999;
	font-size: 16px;
	line-height: 26px;
}
	.uni-form-item {
		display: flex;
		margin-bottom: 60upx;
		padding-bottom: 26upx;
		border-bottom: 2px solid #e5e4e4;

		.uni-input {
			font-size: 30upx;
			margin-left: 30upx;
			color: #3e4a59;
			placeholder-color: #e5e4e4;
		}

		.login_img {
			height: 50upx;
			width: 50upx;
		}
	}

	.canclelogin {
		margin-top: 5px;
	}

	.login-title {
		padding-bottom: 48upx;
		font-size: 48upx;
		font-weight: bold;
		color: #3e4a59;
		letter-spacing: 10upx;
	}

	.links1 {
		text-align: center;
		margin-top: 50upx;
		font-size: 30upx;
		color: #242424;

		view {
			display: inline-block;
			vertical-align: top;
			margin: 0 10upx;
		}
	}

	.links2 {
		text-align: center;
		margin-top: 40upx;
		margin-bottom: 40upx;
		font-size: 28upx;
		color: #979797;

		view {
			display: inline-block;
			vertical-align: top;
			line-height: 32px;
		}
	}

	.login-card {
		width: 600upx;
		padding: 20px;
		align-items: center;
		background: #FFFFFF;
		border-radius: 12upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		margin: 0 auto;
	}
</style>