<template>
	<view class="content">
		<view class="first">
			<image src="../../static/login/top.png" class="backgroundImg"></image>
		</view>
		<view class="third">
			<view class="headImg">
				<image :src="userinfo.head_ico" />
			</view>
			<text class="congratulate">恭喜你{{userinfo.true_name}},本次答对题目数</text>
			<view class="rightnum">
				<image src="../../static/answer/shine.png"></image>
				<text>{{rightnum}}</text>
			</view>
			<view class="details">
				<view class="third_1" v-for="item in details" :key="item.title">
					{{item.title}}{{item.content}}
				</view>
			</view>
		</view>

		<view class="btnView">
			<view class="back" @click="back">
				<text>返</text>
				<text>回</text>
			</view>
			<view class="again" @click="lookAnswer">答题记录</view>
		</view>
		<image src="../../static/answer/book.png" class="backgroundImg2"></image>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			var that = this;
			if (options.hasOwnProperty('result')) {
				var result = JSON.parse(decodeURIComponent(options.result));
				that.rightnum = result.rightnum;
				var Time = that.$utils.formatSeconds(result.times);
				var details = [{
						title: '正确率:',
						content: (result.rightnum * 100 / result.totalnum).toFixed(2) + "%",
					},
					{
						title: '用时:',
						content: Time
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
			};
		},
		methods: {
			//返回
			back: function() {
				var that = this;
				uni.navigateBack({
					delta: 1
				})
			},
			//再来一组
			/* again: function() {
				var that = this;
				uni.redirectTo({
					url: '/pages/answer/answerDetails2?paper_type=' + that.paper_type +
						"&paper_name=" + that.paper_name +
						"&cTime=" + that.cTime
				})
			} */
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

	.first {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
		padding: 20upx;
		width: 100vw;
		height: 260upx;

		.backgroundImg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 410upx;
		}
	}

	.third {
		position: absolute;
		top: 360upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: $uni-bg-color;
		width: 88vw;
		margin-bottom: 20upx;
		padding: 70upx 0 30upx 0;
		z-index: 10;
		border-radius: $uni-border-radius-base;
		box-shadow: 0 0 10upx $uni-bg-color-box-shadow;

		.congratulate {
			font-size: $uni-font-size-base;
			margin: 20upx;
			letter-spacing: 1upx;
		}

		.rightnum {
			color: #ffa202;
			font-size: 60upx;
			margin-top: 20upx;
			margin-bottom: 40upx;

			image {
				position: absolute;
				width: 216.8upx;
				height: 93.6upx;
				left: calc(50vw - 150upx);
			}

			text {
				z-index: 10;
			}
		}

		.headImg {
			position: absolute;
			top: -50upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100upx;
			height: 100upx;
			padding: 10upx;
			background: #FFFFFF;
			border-radius: 100upx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 100%;
				border: 2upx solid #ffa202;
			}
		}

		.details {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			width: 100%;
			justify-content: center;
			align-items: center;

			.third_1 {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				width: 40%;
				margin-bottom: 25upx;
				color: #8b8b8b;
				font-size: $uni-font-size-base - 2;
				letter-spacing: 6upx;
			}
		}
	}

	.btnView {
		position: absolute;
		top: 860upx;
		display: flex;
		flex-direction: row;

		.back {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 200upx;
			height: 60upx;
			border-radius: 60upx;
			border: 2upx solid #3275fd;
			color: #3275fd;
			font-weight: 500;
			font-size: $uni-font-size-lg - 2;

			text {
				margin: 10upx;
			}
		}

		.again {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 200upx;
			height: 60upx;
			border-radius: 60upx;
			border: 2upx solid #3275fd;
			background: #3275fd;
			color: #FFFFFF;
			font-weight: 500;
			font-size: $uni-font-size-lg - 2;
			margin-left: 40upx;
		}
	}

	.backgroundImg2 {
		position: absolute;
		top: 1000upx;
		width: 218upx;
		height: 144upx;
		right: 20upx;
	}
</style>
