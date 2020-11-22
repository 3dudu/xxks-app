<template>
	<view class="container">
		<view class="titlebar">
			<image src="../../static/integral/titlebar.png" class="titlebackground"></image>
			<image src="../../static/appicon1.png" class="icon"></image>
		</view>
		<view class="first">
			<image src="../../static/mine/top2.png" mode="scaleToFill" />
		</view>
		<!-- <text class="applicationTitle">我的应用</text> -->
		<view class="second">
			<view v-for="(item, index) in application" :key="index" class="item" @click="navTo(item)">
				<image :src="item.image"></image>
				<text>{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				application: [{
						id: 1,
						title: '在线学习',
						image: '../../static/mine/zaixianxuexi.png',
						url: '/pages/tabStudy/tabStudy'
					}, {
						id: 2,
						title: '答题记录',
						image: '../../static/mine/answer.png',
						url: '/pages/answer/examRecodList'
					},
					{
						id: 3,
						title: '学习积分',
						image: '../../static/mine/studyf.png',
						url: '/pages/tabMine/studyPoint'
					},
					{
						id: 4,
						title: '积分商城',
						image: '../../static/mine/shop.png',
						url: ''
					},
					{
						id: 5,
						title: '学习报表',
						image: '../../static/mine/table.png',
						url: '/pages/integral/integral'
					},
					{
						id: 6,
						title: '意见反馈',
						image: '../../static/mine/freedback.png',
						url: '/pages/feedback/feedback'
					},
					{
						id: 7,
						title: '个人中心',
						image: '../../static/mine/center.png',
						url: '/pages/personalCenter/personalCenter'
					},
					{
						id: 8,
						title: '服务电话',
						image: '../../static/mine/fuwudianhua.png',
						url: ''
					},
				]
			};
		},
		onLoad() {

		},
		methods: {
			navTo(item) {
				if (item.id == 8) {
					uni.showModal({
						content: '服务电话：0527-84366096',
						showCancel: false,
						confirmColor: '#3CC51F',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return;
				} else if (item.id == 1) {
					uni.switchTab({
						url: item.url
					})
				}
				uni.navigateTo({
					url: item.url
				})
			}
		}
	}
</script>

<style lang="scss">
	page,
	.container {
		display: flex;
		flex-direction: column;
		background-color: $uni-bg-color;
		align-items: center;
		width: 100vw;
		overflow-x: hidden;
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

		.icon {
			width: 85.37px;
			height: 35.2px;
		}
	}

	.first {
		width: 96vw;
		height: 55.11vw;
		border-radius: 15upx;
		margin-top: 20upx;

		image {
			width: 100%;
			height: 100%;
			border-radius: 15upx;
		}
	}

	.applicationTitle {
		margin-top: 20upx;
		font-size: $uni-font-size-lg;
	}

	.second {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-bottom: 20upx;
		width: 96vw;

		.item {
			display: flex;
			flex-direction: column;
			width: 25%;
			justify-content: center;
			align-items: center;
			margin-top: 40upx;

			image {
				width: 80upx;
				height: 80upx;
				//border-radius: 10upx;
			}

			text {
				font-size: $uni-font-size-sm;
				margin-top: 20upx;
				font-weight: 600;
			}
		}
	}
</style>
