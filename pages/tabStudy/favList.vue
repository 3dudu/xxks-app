<template>
	<view class="content">
		<view class="list" v-if="favList.length != 0">
			<view class="study_item" v-for="(item, index) in favList" :key="index">
				<view class="first" @click="navToDetails(item)">
					<text class="title">{{item.p_title?item.p_title:item.title}}</text>
				</view>
				<text class="describe">{{item.description}}</text>
				<view class="item_bottom">
					<view class="time">{{item.fav_time}}</view>
					<image src="../../static/study/shanchu.png" @click="cancelCollectArticle(item, index)"></image>
				</view>
			</view>
			<mix-load-more v-if="total > 1" :status="loadMoreStatus"></mix-load-more>
		</view>
		<empty v-else top="44px" :tips="nofav"></empty>
	</view>
</template>

<script>
	import empty from '@/components/empty/empty.vue';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	var page = 1; //当前页数
	var total = 1; //总页数
	export default {
		components: {
			empty,
			mixLoadMore,
		},
		data() {
			return {
				nofav:"还没有收藏学习资料",
				total: 1,
				favList: [],
				loadMoreStatus: 0, //加载更多 0加载前，1加载中，2没有更多了
			};
		},
		onLoad() {
			var that = this;
		},
		onShow() {
			var that = this;
			that.loadData('refresh');
		},
		onReachBottom() {
			this.loadData('add');
		},
		methods: {
			loadData: function(type) {
				var that = this;
				switch (type) {
					case 'refresh':
						page = 1;
						that.loadMoreStatus = 0;
						that.favList = [];
						that.fetchFavList();
						break;
					case 'add':
						if (that.loadMoreStatus === 2) {
							return;
						}
						that.loadMoreStatus = 1;
						if (page < total) {
							page++;
							that.loadMoreStatus = 0;
							that.fetchFavList();
						} else {
							that.loadMoreStatus = 2;
						}
						break;
				}
			},
			//获取收藏列表
			fetchFavList: function() {
				var that = this;

				var baseUrl = that.$constants.STUDY_FAVLIST + "?page=" + page;
				that.$request
					.get({
						url: baseUrl,
						loadingTip: '加载中...',
						needLogin:true
					})
					.then(
						res => { //success
							total = res.paging.totalpage;
							if (page == 1) {
								that.total = total;
							}
							if (page == total) {
								that.loadMoreStatus = 2;
							}
							for (var i = 0; i < res.favList.length; i++) {
								var item = res.favList[i];
								item.fav_time = item.fav_time.substring(0, 10).replace('-', '年').replace('-', '月') + "日";
								that.favList.push(item);
							}
						},
						res => { //fail
							that.$api.msg(res.ret_msg)
						}
					);
			},
			//学习详情
			navToDetails(item) {
				console.log(item);
				uni.navigateTo({
					url: '/pages/details/details?id='+item.aid+"&ap_id="+item.apid
				})
			},
			//取消收藏文章
			cancelCollectArticle: function(item, index) {
				var that = this;
				console.log("取消收藏文章")
				uni.showModal({
					title: '提示',
					content: '该篇文章是否取消收藏？',
					confirmColor:'#3CC51F',
					success: function(res){
						if (res.confirm) {
							that.$utils.cancelCollectArticle(item.aid, item.apid);
							var list = that.favList;
							list.splice(index, 1);
							that.favList = list;
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page,
	.content {
		display: flex;
		flex-direction: column;
		background-color: $uni-bg-color-grey;
		width: 100vw;
		overflow: hidden;
	}

	.study_item {
		display: flex;
		flex-direction: column;
		padding: 20upx;
		justify-content: center;
		width: 100%;
		margin-top: 2upx;
		background: $uni-bg-color;

		.describe {
			font-size: $uni-font-size-base;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			margin-top: $uni-spacing-col-sm;
			margin-bottom: $uni-spacing-col-sm;
			letter-spacing: 2upx;
			width: calc(100% - 40upx);
		}

		.item_bottom {
			display: flex;
			flex-direction: row;
			width: calc(100% - 40upx);
			align-items: center;

			.time {
				flex: 1;
				font-size: $uni-font-size-sm;
				text-align: left;
				width: calc(100% - 40upx);
				margin-top: $uni-spacing-col-sm;
			}

			image {
				width: 35upx;
				height: 35upx;
				margin-right: 15upx;
			}
		}

	}

	.first {
		display: flex;
		flex-direction: row;
		width: 100%;
		align-items: center;

		.title {
			font-size: $uni-font-size-lg;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			font-weight: 600;
			width: calc(100% - 40upx);
			letter-spacing: 4upx;
		}

		image {
			width: 30upx;
			height: 30upx;
		}
	}
</style>
