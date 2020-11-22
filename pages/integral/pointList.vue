<template>
	<view class="content">
		<view class="list" v-if="pointList.length != 0">
			<view class="item" v-for="item in pointList" :key="item.id">
				<view class="left">
					<text class="title">{{item.intro}}</text>
					<view class="left_1">
						<!-- <text class="num">0/10题</text> -->
						<text class="time">{{item.datetime}}</text>
					</view>
				</view>
				<view class="right">
					<text>+{{item.value}}</text>
				</view>
			</view>
			<mix-load-more v-if="total > 1" :status="loadMoreStatus"></mix-load-more>
		</view>
		<empty v-else top="44px"></empty>
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
				id: '',
				total: 1,
				pointList: [],
				loadMoreStatus: 0, //加载更多 0加载前，1加载中，2没有更多了
			}
		},
		onLoad() {
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
						that.pointList = [];
						that.fetchPointListt();
						break;
					case 'add':
						if (that.loadMoreStatus === 2) {
							return;
						}
						that.loadMoreStatus = 1;
						if (page < total) {
							page++;
							that.loadMoreStatus = 0;
							that.fetchPointListt();
						} else {
							that.loadMoreStatus = 2;
						}
						break;
				}
			},
			//获取积分记录
			fetchPointListt: function() {
				var that = this;
				if (page == 1) {
					var pointList = [];
				} else {
					var pointList = that.pointList;
				}
				var baseUrl = that.$constants.UCENTER_POINTLIST + "?page=" + page;
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
							for (var i = 0; i < res.pointList.length; i++) {
								var item = res.pointList[i];
								item.datetime = item.datetime.substring(0, 10).replace('-', '年').replace('-', '月') + "日";
								pointList.push(item);
							}
							that.pointList = pointList;
						},
						res => { //fail
							that.$api.msg(res.ret_msg)
						}
					);
			},
		}
	}
</script>

<style lang="scss">
	page,
	.content {
		background-color: $uni-bg-color-grey;
		width: 100vw;
		overflow-x: hidden;
	}

	.list {
		display: flex;
		flex-direction: column;
		margin: 30upx;
		width: calc(100vw - 60upx);
		height: 100%;
		background: $uni-bg-color;
		border-radius: $uni-border-radius-base;
	}

	.item {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 30upx 30upx 0 30upx;
		padding-bottom: 30upx;
		border-bottom: 2upx solid $uni-bg-color-grey;

		.left {
			display: flex;
			flex-direction: column;
			flex: 1;

			.title {
				font-size: $uni-font-size-lg + 5;
			}

			.left_1 {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 20upx;
			}

			.num {
				color: #8b8b8b;
				margin-right: 20upx;
				font-size: $uni-font-size-lg;
			}

			.time {
				color: #8b8b8b;
				margin-right: 20upx;
				font-size: $uni-font-size-base;
			}
		}

		.right {
			font-size: $uni-font-size-lg + 5;
			color: $uni-color-title;
		}

	}
</style>
