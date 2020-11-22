<template>
	<view class="content">
		<image src="../../static/answer/tiaozhanbeijing.png" class="backgroundImg"></image>
		<view class="second">
			<image src="../../static/answer/shengli.png" class="backgroundImg2"></image>
			<text class="username">{{userinfo.true_name}}</text>
			<view class="result">
				<image class="image1" src="../../static/answer/truegou.png"></image>
				<view class="title">本次答对</view>
				<view class="num">{{rightnum}}</view>
				<text class="num2">题</text>
			</view>
			<view class="result">
				<image class="image2" src="../../static/answer/biaoxian.png"></image>
				<view class="title">历史最高答对</view>
				<view class="num">{{max_rightnum}}</view>
				<text class="num2">题</text>
			</view>
		</view>
		<view class="third">
			<view class="look" @click="lookAnswer">答题记录</view>
			<view class="again" @click="again">再来一局</view>
			<view class="back" @click="back">返回</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			var that = this;
			if (options.hasOwnProperty('result')) {
				var result = JSON.parse(decodeURIComponent(options.result));
				that.rightnum = result.rightnum;
				var details = [{
						title: '正确率:',
						content: (result.rightnum * 100 / result.totalnum).toFixed(2) + "%",
					},
					{
						title: '用时:',
						content: result.times
					},
					{
						title: '题数:',
						content: result.totalnum
					},
					{
						title: '积分:',
						content: result.score
					}
				];
				that.id = result.id;
				that.details = details;
			}
			if (options.hasOwnProperty('paper_type')) {
				that.paper_type = options.paper_type
			}
			if (options.hasOwnProperty('paper_name')) {
				that.paper_name = options.paper_name;
			}
			if (options.hasOwnProperty('cTime')) {
				that.cTime = options.cTime;
				that.answerTimer = options.cTime;
			}
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
			if (uni.getStorageSync('max_rightnum')) {
				that.max_rightnum = uni.getStorageSync('max_rightnum');
			}
		},
		data() {
			return {
				id: '',
				details: [{
						title: '正确率:',
						content: '0%'
					},
					{
						title: '用时:',
						content: '00:00:00'
					},
					{
						title: '错题数:',
						content: '0'
					},
					{
						title: '积分:',
						content: '0'
					}
				],
				rightnum: 0,
				paper_type: '',
				paper_name: '',
				cTime: 0,
				userinfo: '',
				max_rightnum: 0,
			};
		},
		methods: {
			//返回
			back: function() {
				var that = this;
				/*
				uni.navigateBack({
					delta: 1
				})*/
				uni.switchTab({
				    url: '/pages/answer/answer'
				});
			},
			//再来一组
			again: function() {
				var that = this;
				if (parseInt(that.max_rightnum) < parseInt(that.rightnum)) {
					uni.setStorageSync("max_rightnum", that.rightnum); //缓存最高答题记录
				}
				uni.redirectTo({
					url: '/pages/answer/answerDetails2?paper_type=' + that.paper_type +
						"&paper_name=" + that.paper_name +
						"&cTime=" + that.cTime
				})
			},
			//查看答题记录
			lookAnswer: function() {
				var that = this;
				uni.navigateTo({
					url: '/pages/answer/examRecodDatas?record_id=' + that.id,
				})
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
	}

	.backgroundImg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}

	.second {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		z-index: 10;
		background: #FFFFFF;
		margin: 40upx 0 40upx 0;
		border-radius: $uni-border-radius-lg;
		width: calc(100vw - 80upx);
		height: 650upx;

		.backgroundImg2 {
			width: 381.6upx;
			height: 267.6upx;
			margin-top: 50upx;
		}

		.username {
			font-size: $uni-font-size-lg + 2;
			letter-spacing: 6upx;
			font-family: "黑体";
			margin-top: 20upx;
			margin-bottom: 50upx;
		}

		.result {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			width: 70%;
			align-items: center;
			margin-bottom: 40upx;
			z-index: 10;

			.image1 {
				height: 40upx;
				width: 40upx;
			}

			.image2 {
				height: 40upx;
				width: 34.55upx;
			}

			.title {
				display: flex;
				flex-direction: row;
				height: 40upx;
				justify-content: flex-start;
				align-items: center;
				font-family: "黑体";
				line-height: 40upx;
				font-size: 32upx;
				margin-left: 30upx;
				margin-right: 30upx;
			}

			.num {
				text-align: right;
				font-family: "黑体";
				line-height: 40upx;
				font-size: 34upx;
				margin-right: 30upx;
				font-weight: 500;
				color: #ffb468;
				flex: 1;
			}

			.num2 {
				font-family: "黑体";
				line-height: 40upx;
				font-size: 32upx;
			}
		}
	}

	.third {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 20upx;
		width: calc(100vw - 80upx);
		margin-bottom: 20upx;
		z-index: 10;

		.back {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			background: #ffb468;
			font-size: 30upx;
			width: calc(100vw - 120upx);
			height: 100upx;
			text-align: center;
			border-radius: 20upx;
			font-size: 34upx;
			margin-bottom: 40upx;
		}

		.look {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			background: #78cb72;
			font-size: 30upx;
			width: calc(100vw - 120upx);
			height: 100upx;
			text-align: center;
			border-radius: 20upx;
			font-size: 34upx;
			margin-bottom: 40upx;
		}

		.again {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			color: #3275fd;
			background: #FFFFFF;
			font-size: 30upx;
			width: calc(100vw - 120upx);
			height: 100upx;
			text-align: center;
			border-radius: 20upx;
			font-size: 34upx;
			margin-bottom: 40upx;
		}
	}
</style>
