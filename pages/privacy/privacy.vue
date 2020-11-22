<template>
	<view class="content">
		<view class="body">
			<view class="introduce-section">
			<rich-text :nodes="helpinfo"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			helpinfo:''
		};
	},
	onLoad() {
		
		var baseUrl = this.$constants.TOOLS_HELP+"?id=1";
		
		this.$request
			.get({
				url: baseUrl,
				loadingTip: '加载中...'
			})
			.then(
				res => {
					this.helpinfo = res.helpinfo.content;
		})
	},
	onShow() {},
	methods: {

	}
};
</script>
<style>
	
	/* 简介 */
	.introduce-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		line-height: 1.5;
		font-size: 26upx;
	}
</style>

