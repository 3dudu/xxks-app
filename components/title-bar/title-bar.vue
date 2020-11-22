<template>
	<view>
		<view class="status_bar"></view>
		<view class="titleBar">
			<view class="left" @click="gotoPersonal()">
				<image :src="image" class="userIcon"></image>
			</view>
			<view class="content-box" @click="serach">
				<text class="icon icon-search">&#xe61c;</text>
				<text class="input">{{placeholder}}</text>
			</view>
			<view class="right" @click="gotoFav()">
				<image :src="imager" class="userIcon"></image>
			</view>
		
		</view>
	</view>
	
</template>

<script>
	export default {
		props: {
			image: {
				type: String,
				default: '../../static/appicon1.png'
			},
			imager: {
				type: String,
				default: '../../static/study/collection.png'
			},
			integral: {
				type: String,
				default: '0'
			}
		},
		data() {
			return {
				placeholder: '搜索资料'
			};
		},
		methods: {
			gotoPersonal:function(){
				uni.switchTab({
					url: '/pages/personalCenter/personalCenter'
				})	
			},
			gotoFav:function(){
				uni.navigateTo({
					url: '/pages/tabStudy/favList'
				})
			},
			serach:function() {
				uni.navigateTo({
					url: '../../pages/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.status_bar {
	    height: var(--status-bar-height);
	    width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: $uni-color-title;
		justify-content: center;
	}
	.titleBar {
		display: flex;
		flex-direction: row;
		height: 88upx;
		width: 100%;
		background: $uni-color-title;
		color: $uni-bg-color;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.title_text {
		font-weight: 700;
		font-size: 16px;
		line-height: 30px;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.content-box {
		width: 65%;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 15px;
		color: rgba($color: #ffffff, $alpha: 0.8);
		background: rgba($color: #549fff, $alpha: 0.8);

		&.center {
			justify-content: center;
		}

		.icon {
			padding: 0 15upx;

			&.icon-del {
				font-size: 38upx;
			}
		}

		.icon-search {
			color: $uni-text-color-inverse;
			font-size: 26upx;
			margin-left: 10upx;
		}

		.input {
			width: 100%;
			max-width: 100%;
			line-height: 60upx;
			height: 60upx;
			transition: all 0.2s linear;
			font-size: 28upx;

			&.center {
				width: 200upx;
			}

			&.sub {
				// position: absolute;
				width: auto;
				color: $uni-text-color-inverse;
			}
		}
	}

	.right {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 100%;
		flex: 1;
		.integralView {
			display: flex;
			align-items: center;
			margin-left: 10upx;
			flex-direction: column;

			.title {
				font-size: 18upx;
				color: #FFFFFF;
				margin-bottom: 4upx;
			}

			.details {
				font-size: 22upx;
				color: #FFFFFF;
				padding: 2.5upx 10upx 2.5upx 10upx;
				border-radius: 30upx;
				background: rgba($color: #549fff, $alpha: 0.8);
				margin-bottom: 4upx;
			}
		}

		.userIcon {
			width: 64upx;
			height: 64upx;
			//border: 4upx solid #FFFFFF;
			border-radius: 64upx;
			margin-left: 10upx;
		}
	}

	.left {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 100%;
		flex: 1;
		
		
		.integralView {
			display: flex;
			align-items: center;
			margin-left: 10upx;
			flex-direction: column;
		
			.title {
				font-size: 18upx;
				color: #FFFFFF;
				margin-bottom: 4upx;
			}
		
			.details {
				font-size: 22upx;
				color: #FFFFFF;
				padding: 2.5upx 10upx 2.5upx 10upx;
				border-radius: 30upx;
				background: rgba($color: #549fff, $alpha: 0.8);
				margin-bottom: 4upx;
			}
		}
		
		.userIcon {
			width: 64upx;
			height: 64upx;
			//border: 4upx solid #FFFFFF;
			border-radius: 60upx;
		}
	}
</style>
