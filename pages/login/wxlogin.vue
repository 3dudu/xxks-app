<template>
	<view class="content">
		<view class="logo_top">
			<image src="../../static/shanshui.png"></image>
		</view>
			<view class="login-card">
				<image class="wxbtn" src="../../static/login/icon48_wx_button.png" @tap="submitLogin"></image>
			</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	var aweixin = null;
	export default {
		data() {
			return {
				aweixin:null
			}
		},
		onLoad() {
			var that = this;
			plus.oauth.getServices(function(services){
				console.log(JSON.stringify(services));
					aweixin = services[0];
				}, function(e){
				} 
			);
		},
		methods: {
			submitLogin: function(res) {
				var that = this;
				aweixin.authorize(function(e){
						let code = e.code;
						
						that.loginSever(code);
					}, function(e){
						plus.nativeUI.alert("授权失败");
					}, {scope:'snsapi_userinfo',state:'authorize',appid:'wx51b2bf480e20a9da'});
				/**
				uni.login({
					provider: 'weixin',
					success: (res) => {
						let code = res.authResult.code;
						that.loginSever(code);
					},
					fail: (err) => {
						console.error('授权登录失败：' + JSON.stringify(err));
					},
					}
				)*/
			},
			loginSever:function(code){
				var that = this;
				that.$request
					.get({
						url: that.$constants.WX_LOGIN + "?oid=5&code=" + code + "&reg=" + 1,
						loadingTip: '加载中...'
					})
					.then(
						res => {
							console.log(JSON.stringify(res));
							that.login(res);
							console.log(this.$store.state.hasLogin);
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
			...mapMutations(['login'])
		}
	}
</script>

<style lang="scss" scoped>
	$color-primary: #ff3d5d;
	.wxbtn{
		height: 42px;
	}
	.content {
		background-color: #FFFFFF;
	}

	.logo_top {
		image {
			height: 300upx;
			width: 100%;
		}
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

		image {
			height: 50upx;
			width: 50upx;
		}
	}

	.login-title {
		margin-top: 50upx;
		padding-bottom: 78upx;

		text {
			font-size: 48upx;
			font-weight: bold;
			color: #3e4a59;
			letter-spacing: 10upx;
		}

	}

	.submit-view {
		padding-left: 100upx;
		padding-right: 100upx;
		width: 100%;
		margin-top: -130upx;
	}

	.links1 {
		text-align: center;
		margin-top: 38upx;
		font-size: 30upx;
		color: #242424;

		view {
			display: inline-block;
			vertical-align: top;
			margin: 0 10upx;
		}

		.link-highlight {
			color: $color-primary
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
			margin: 0 20upx;
		}

		.link-highlight {
			color: $color-primary
		}
	}

	.login-card {
		background: #fff;
		border-radius: 12upx;
		padding-left: 25upx;
		padding-right: 25upx;
		padding-top: 10upx;
		padding-bottom: 110upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		position: relative;
		margin-left: 50upx;
		margin-right: 50upx;
		margin-top: -60upx;
		margin-bottom: 94upx;
	}
</style>
