<template>
	<view class="content">
		<image class="backgroundImg" src="../../static/advert.jpg" @click="advetTap"></image>
		<view class="mix-advert-btn" @click.stop.prevent="advetTap">
			<text class="mix-advert-timer">跳过 {{timer}}</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: mapState(['hasLogin', 'userinfo']),
		components: {

		},
		data() {
			return {
				timer: 0,
				interval: null
			}
		},
		onLoad() {
			var that = this;
			that.startTimedown();
		},
		methods: {
			...mapMutations(['logout']),
			advetTap() {
				var that = this;
				clearInterval(that.interval);
				if (that.hasLogin) {

					that.getUseinfo();

				} else {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			},
			startTimedown() {
				var that = this;
				that.interval = setInterval(() => {
					that.timer -= 1;
					if (that.timer < 1) {
						that.advetTap();
					}
				}, 1000)
			},

			getUseinfo() {
				var that = this;
				var baseUrl = that.$constants.UCENTER_USERINFO;
				that.$request
					.get({
						url: baseUrl,
						loadingTip: '加载中...'
					})
					.then(
						res => { //success
							if (res == null) {
								that.logout();
								uni.reLaunch({
									url: '/pages/login/login'
								})
							} else {
								uni.switchTab({
									url: '/pages/tabStudy/tabStudy'
								});
								return;
								if (res.hasOwnProperty("company")) {
									if (res.company.is_accept == 1) {
										//审核通过，跳转到tab页面
										uni.switchTab({
											url: '/pages/tabStudy/tabStudy'
										})
									} else {
										// that.$store.state.userinfo.user_company.is_accept = 0;
										//未审核通过，跳转到个人信息页面
										uni.reLaunch({
											url: '/pages/personalCenter/personalCenter'
										})
									}
								} else {
									uni.reLaunch({
										url: '/pages/login/apply1'
									})
								}

							}
						},
						res => { //fail
							//that.$api.msg(res.ret_msg)
						});
			},
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		background-color: $uni-bg-color-grey;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}

	.backgroundImg {
		height: 100vh;
		width: 100vw;
	}

	.mix-advert-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 30upx;
		bottom: 30upx;
		z-index: 10;
		height: 50upx;
		padding: 0 20upx;
		background: rgba(0, 0, 0, .3);
		border-radius: 100px;
	}

	.mix-advert-timer {
		color: #fff;
		font-size: 26upx;
		line-height: 1;
	}
</style>
