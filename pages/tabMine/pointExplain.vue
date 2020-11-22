<template>
	<view class="content">
		
		<view class="body">
			<view class="details1">
				学习积分是“学习宝典”学习平台对用户通过本平台进行学习的行为分析数据，也是兑换奖励的依据。本学习积分规则设计制定和技术开发的知识产权由“学习宝典”学习平台所有。
			</view>
			<view class="details1">
				严禁利用刷分软件等谋取利益。
				一旦发现，将会同网信管理部门、公安机关依法进行严厉打击。用户一旦被技术手段监测到有使用刷分软件的行为，将被封禁。目前，已对使用刷分软件的部分用户进行了封禁处理。
			</view>
			<view class="details1">“学习宝典”学习平台将对以下学习行为进行积分，规则如下：</view>
			<view class="title1">登录</view>
			<view class="details12">每日首次登录积1分。</view>
			<view class="title1">每日学习</view>
			<view class="details12">每学习2分钟得2分。</view>
			<view class="title1">每日答题</view>
			<view class="details12">每日上限积10分。</view>
			<view class="title1">每周答题</view>
			<view class="details12">每日上限积10分。</view>
			<view class="title1">挑战答题。</view>
			<view class="details12">每日上限积10分。</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	onLoad() {},
	onShow() {},
	methods: {
		//返回
		back: function() {
			var that = this;
			if (getCurrentPages().length > 1) {
				wx.navigateBack({
					delta: 1
				});
			} else {
				wx.switchTab({
					url: '/pages/tabMine/tabMine'
				});
			}
		}
	}
};
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
		color: #ffffff;
	}
}
.body {
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
	font-family: 'Microsoft YaHei';
}
.details1 {
	margin-top: 20upx;
	margin-bottom: 20upx;
	width: calc(100% - 80upx);
	font-size: 32upx;
	line-height: 50upx;
	letter-spacing: 2upx;
	color: #000000;
}
.title1 {
	display: flex;
	flex-direction: row;
	width: calc(100% - 100upx);
	justify-content: flex-start;
	font-size: 32upx;
	line-height: 26upx;
	letter-spacing: 2upx;
	color: #000000;
	font-weight: bold;
	padding-left: 20upx;
	border-left: 8upx solid #f5222d;
}
.details12 {
	display: flex;
	flex-direction: row;
	width: calc(100% - 80upx);
	justify-content: flex-start;
	font-size: 30upx;
	letter-spacing: 2upx;
	color: #999999;
	margin-top: 10upx;
	margin-bottom: 60upx;
}
</style>
