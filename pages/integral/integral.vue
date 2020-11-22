<template>
	<view class="content">
		
		<image src="../../static/integral/top.png" class="backgroundImg"></image>
		<view class="first">
			<image src="../../static/integral/xinxi.png" class="backgroundImg2"></image>
			<view class="item">
				<text class="title">我的排名</text>
				<text class="num">{{userBand.allcount}}</text>
			</view>
			<view class="item">
				<image :src="userinfo.head_ico"></image>
				<text class="name">{{userinfo.true_name}}</text>
			</view>
			<view class="item">
				<text class="title">我的积分</text>
				<text class="num">{{userBand.point}}</text>
			</view>
		</view>
		<view class="second">
			<view class="second_2" v-if="companyTop.length != 0">
				<view class="second_2_title">
					<image src="../../static/integral/xuexibiaobing.png"></image>
				</view>
				<view class="second_2_detail">
					<view class="user" v-for="(item, index) in companyTop" :key="item.true_name">
						<image v-if="index==0" class="nounIcon" src="../../static/integral/first.png"></image>
						<image v-else-if="index==1" class="nounIcon" src="../../static/integral/second.png"></image>
						<image v-else-if="index==2" class="nounIcon" src="../../static/integral/third.png"></image>
						<text v-else class="noun">{{index+1}}</text>
						<image class="userIcon" :src="item.logo"></image>
						<text class="username">{{item.true_name}}</text>
						<view class="pointRow">
							<!-- <image class="jiang" src="../../static/integral/jiangbei.png"></image> -->
							<text class="integralNum">{{item.point}}</text>
							<text class="integralNum2">分</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 	<mix-load-more :status="loadMoreStatus"></mix-load-more> -->
		</view>
	</view>
</template>

<script>
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	/* var page = 1;
	var total = 0;
	var pagesize = 0; */
	export default {
		components: {
			mixLoadMore,
		},
		data() {
			return {
				id: '',
				//pagesize: 0,
				userBand: '',
				companyBand: '',
				companyTop: [],
				loadMoreStatus: 0, //加载更多 0加载前，1加载中，2没有更多了
				userinfo: '',
			};
		},
		onLoad() {
			var that = this;
			if (uni.getStorageSync('userinfo')) {
				var userinfo = uni.getStorageSync('userinfo').userinfo;
				if (that.$utils.isEmpty(userinfo.head_ico)) {
					userinfo.head_ico = "../../static/moren.jpg"
				} else {
					if (userinfo.head_ico.indexOf('http') == -1) {
						userinfo.head_ico = that.$constants.SUQIAN_IMG_URI + userinfo.head_ico;
					} else {
						userinfo.head_ico = userinfo.head_ico;
					}
				}
				that.userinfo = userinfo;
			}
			that.loadData('refresh');
		},
		onShow() {

		},
		onReachBottom() {
			var that = this;
			//that.loadData('add');
		},
		methods: {
			loadData: function(type) {
				var that = this;
				switch (type) {
					case 'refresh':
						/* page = 1;
						that.loadMoreStatus = 0; */
						that.companyTop = [];
						that.fetchPointBand();
						break;
						/* case 'add':
							if (that.loadMoreStatus === 2) {
								return;
							}
							that.loadMoreStatus = 1;
							if (that.companyTop.length < total) {
								page++;
								that.loadMoreStatus = 0;
								that.fetchPointBand();
							} else {
								that.loadingType = 2;
							}
							break; */
				}
			},
			//积分榜单
			fetchPointBand: function() {
				var that = this;
				var baseUrl = that.$constants.UCENTER_POINTBAND;
				that.$request
					.get({
						url: baseUrl,
						loadingTip: '加载中...',
						needLogin:true
						
					})
					.then(
						res => { //success
							that.companyBand = res.companyBand;
							var companyTop = [];
							for (var i = 0; i < res.companyTop.length; i++) {
								var item = res.companyTop[i];
								if (that.$utils.isEmpty(item.logo)) {
									item.logo = "../../static/moren.jpg"
								} else {
									if (item.logo.indexOf('http') == -1) {
										item.logo = that.$constants.SUQIAN_IMG_URI + item.logo;
									} else {
										item.logo = item.logo;
									}
								}
								if (i < 8) {
									companyTop.push(item);
								}
							}
							that.companyTop = companyTop;
							that.userBand = res.userBand;
						},
						res => { //fail
							that.$api.msg(res.ret_msg);
						}
					);
			},
			//页面跳转
			navTo: function(url) {
				uni.navigateTo({
					url: url
				})
			},
			//返回
			back: function() {
				var that = this;
				if (getCurrentPages().length > 1) {
					wx.navigateBack({
						delta: 1
					});
				} else {
					wx.switchTab({
						url: "/pages/tabMine/tabMine"
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page,
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: $uni-bg-color-grey;
		width: 100vw;
		overflow-x: hidden;
		font-family: "Microsoft YaHei";
	}

	.backgroundImg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 258upx;
	}

	.titlebar {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 44px;

		.titlebackground {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 44px;
		}

		.lefticon {
			width: 46px;
			height: 18px;
			z-index: 10;
			margin-left: 10px;
		}

		.head_title {
			flex: 1;
			z-index: 10;
			font-weight: 700;
			margin-right: 56px;
			font-size: 16px;
			line-height: 30px;
			text-align: center;
			width: 263upx;
			color: #FFFFFF;
		}
	}

	.first {
		display: flex;
		flex-direction: row;
		width: 94vw;
		height: 250upx;
		justify-content: center;
		align-items: center;
		z-index: 10;
		margin-top: 40upx;

		.backgroundImg2 {
			position: absolute;
			width: 94vw;
			height: 250upx;
		}

		.item {
			display: flex;
			flex: 1;
			align-items: center;
			flex-direction: column;
			z-index: 11;

			image {
				width: 128upx;
				height: 128upx;
				border-radius: 128upx;
				box-shadow: 0 0 10upx $uni-bg-color-box-shadow;
			}

			.title {
				font-size: 30upx;
				color: #999999;
			}

			.num {
				font-size: 45upx;
				color: #e74845;
				margin-top: 10upx;
			}

			.name {
				font-size: 36upx;
				margin-top: 10upx;
				font-weight: bold;
			}
		}
	}

	.second {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: auto;
		margin-bottom: 20upx;
		width: 94vw;

		.second_2 {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 20upx 20upx 0 20upx;
			width: 640upx;
			margin-top: 15upx;
			border-radius: $uni-border-radius-base;
			background: $uni-text-color-inverse;
			box-shadow: 0 0 10upx #f2f3f5;

			.second_2_title {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: $uni-font-size-lg + 5;
				margin-bottom: 15upx;
				width: 640upx;
				border-bottom: 3upx solid #f2f3f5;
				font-weight: bold;

				image {
					height: 38.5upx;
					width: 290.5upx;
					margin-bottom: 20upx;
				}
			}

			.second_2_detail {
				display: flex;
				flex-direction: column;
				margin-top: 20upx;
				width: 100%;

				.user {
					display: flex;
					flex-direction: row;
					align-items: center;
					padding-bottom: 40upx;
					width: 100%;

					.nounIcon {
						width: 60upx;
						height: 60upx;
					}

					.noun {
						width: 60upx;
						text-align: center;
						font-size: 30upx;
						font-weight: bold;
					}

					.pointRow {
						display: flex;
						align-items: center;
						flex: 1;
						justify-content: flex-end;
						flex-direction: row;

						.jiang {
							width: 35upx;
							height: 37.1upx;
						}

						.integralNum {
							color: #e74845;
							font-size: 34upx;
							margin-left: 10upx;
							font-weight: bold;
						}

						.integralNum2 {
							color: #e74845;
							font-size: 34upx;
							margin-left: 6upx;
							font-weight: bold;
						}
					}

					.userIcon {
						width: 74upx;
						height: 74upx;
						border-radius: 74upx;
						margin-left: 24upx;
						margin-right: 24upx;
						box-shadow: 0 0 5upx $uni-bg-color-box-shadow;
					}

					.username {
						font-size: 30upx;
						font-weight: bold;
					}

				}
			}

		}
	}
</style>
