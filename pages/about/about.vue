<template>
	<view class="content">
		
		<view class="body">
			<view class="head">
				<image class="logo" :src="logo"></image>
				<view class="version"><text>IT学和练 {{version}}</text></view>
			</view>
			<view class="details1">
				IT学和练的技术文章，考试题目均来自网络公开资料。我们会不断努力，不断完善功能，丰富学习内容，提升题库质量！
			</view>
			<view class="details2">
				交流QQ群 2030106
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			version:this.$constants.APP_VERSION,
			logo:'../../static/logo.png'
		};
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

.body {
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
	font-family: 'Microsoft YaHei';
}
.details1{
	padding: 14px;
	color: #999;
	font-size: 16px;
	text-align: left;
	padding-top: 90px;
}
.details2{
	padding: 10px;
	color: #666;
	font-size: 14px;
	position: fixed;
	bottom: 0px;
}
.head{
	height: 300px;
	width: 100%;
	display: contents;
}
.logo{
	height: 120px;
    width: 120px;
    margin: 0 auto;
    margin-top: 80px;
    display: block;
}
.version{
	text-align: center;
	color: #999;
	font-size: 16px;
	line-height: 26px;
}
</style>
