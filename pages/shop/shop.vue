<template>
	<view class="content">
		<view class="first">
			<view class="first_1">
				<image src="../../static/appicon1.png" class="icon" />
				<view class="title2">我的点点通</view>
				<view class="details">积分明细</view>
			</view>
			<view class="first_2">
				<view class="point">0</view>
				<view class="details">兑换不减少学习积分</view>
				<view class="explain">点点通说明</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
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

	.first {
		display: flex;
		flex-direction: column;
		width: 100vw;
		background: #1890FF;

		.first_1 {
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100vw;
			height: 70upx;

			.icon {
				width: 97.5upx;
				height: 40.2upx;
				margin-left: 20upx;
			}

			.title2 {
				flex: 1;
				text-align: center;
				color: #FFF;
				font-size: 18upx;
				letter-spacing: 2upx;
			}

			.details {
				display: flex;
				flex-direction: row;
				font-size: 16upx;
				padding: 5upx 20upx 5upx 20upx;
				background: #3275FD;
				border-top-left-radius: 40upx;
				border-bottom-left-radius: 40upx;
				color: #FFF;
			}
		}
		.first_2{
			display: flex;
			flex-direction: column;
			width: 100vw;
			justify-content: flex-start;
			align-items: center;
			.point{
				font-size: 60upx;
				color: #fff;
			}
			.details{
				font-size: 18upx;
				color: #fff;
				letter-spacing: 1upx;
			}
			.explain{
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				padding: 8upx 30upx 8upx 30upx;
				background: #FFFFFF;
				margin-top: 20upx;
				margin-bottom: 20upx;
				font-size: 18upx;
				color: #1890FF;
				border-radius: 40upx;
			}
		}
	}
</style>
