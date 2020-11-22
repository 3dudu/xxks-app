<template>
	<view class="content">
		<mSearch @search="search($event,0)" />
		<!-- 搜索历史 -->
		<view class="searchBotBox">
			<view class="ov">
				<view class="fl">搜索历史</view>
				<image @tap="clearKey" src="../../static/delete.png"></image>
			</view>
			<view class="searchHistoryBox">
				<view class="searchHistoryBoxItem" v-for="(item,index) in searchKey" :key='index' @click="navTo(item)">
					{{item}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue'
	export default {
		components: {
			mSearch
		},
		data() {
			return {
				searchKey: [],
			};
		},
		onShow() {
			var that = this;
			var keywords = uni.getStorageSync('searchLocal');
			if (!that.$utils.isEmpty(keywords)) {
				var keywordsArray = keywords.split("-");
			} else {
				var keywordsArray = [];
			}

			this.searchKey = keywordsArray;
		},
		methods: {
			clearKey() {
				var that = this;
				uni.showModal({
					title: '提示',
					content: '点击确定将删除所有历史信息，确定删除吗？',
					confirmColor: '#3CC51F',
					success: function(res) {
						if (res.confirm) {
							uni.removeStorageSync('searchLocal');
							that.searchKey = [];
						} else if (res.cancel) {

						}
					}
				});

			},
			search(res) {
				var that = this;
				var newArr = that.searchKey;
				newArr.forEach((item,index) =>{
					if(item == res){
						newArr.splice(index, 1);
					}
				})
				newArr.push(res);
				this.searchKey = newArr;
				var newStr = newArr.join('-');
				uni.setStorage({
					key: 'searchLocal',
					data: newStr
				});
				uni.navigateTo({
					url: '../tabStudy/searchStudy?keywords=' + res
				})
			},
			//页面跳转
			navTo: function(item) {
				var that = this;
				uni.navigateTo({
					url: '../tabStudy/searchStudy?keywords=' + item
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
		background-color: $uni-bg-color-grey;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.searchBotBox {
		width: 100%;
		margin-top: 30upx;
		padding: 15upx 3%;
		box-sizing: border-box;
	}

	.searchHistoryBox {
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		margin-top: 40upx;
	}

	.searchHistoryBoxItem {
		float: left;
		font-size: 26upx;
		color: #666;
		line-height: 46upx;
		height: 46upx;
		padding: 0 20upx;
		border-radius: 23upx;
		margin-left: 15upx;
		margin-bottom: 20upx;
		border: 1px solid #ccc;
		max-width: 630upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.ov {
		display: flex;
		flex-direction: row;
		align-items: center;

		image {
			height: 50upx;
			width: 50upx;
		}
	}

	.fl {
		flex: 1;
		font-size: 30upx;
		color: #303133;
	}

	.fr {
		float: right;
	}
</style>
