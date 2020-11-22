<template>
	<view class="content">
		<view class="list" v-if="examRecodList.length != 0">
			<view class="item" v-for="item in examRecodList" :key="item.id" @click="navTo(item)">
				<view class="left">
					<text class="title">{{item.title}}</text>
					<view class="left_1">
						<text class="num">{{item.rightnum}}/{{item.totalnum}}题</text>
						<text class="time">{{item.create_time}}</text>
					</view>
				</view>
				<view class="right">
					<text>正确率:{{item.accuracy}}</text>
				</view>
			</view>
			<mix-load-more v-if="total > 1" :status="loadMoreStatus"></mix-load-more>
		</view>
		<empty v-else top="44px" :tips="norecode"></empty>
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
				norecode:'没有做过小测验哦',
				id: '',
				total: 1,
				examRecodList: [],
				loadMoreStatus: 0, //加载更多 0加载前，1加载中，2没有更多了
			}
		},
		onNavigationBarButtonTap(){
			uni.navigateTo({
				url: "/pages/myerror/myerror"
			})
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
						that.examRecodList = [];
						that.fetchexamRecodList();
						break;
					case 'add':
						if (that.loadMoreStatus === 2) {
							return;
						}
						that.loadMoreStatus = 1;
						if (page < total) {
							page++;
							that.loadMoreStatus = 0;
							that.fetchexamRecodList();
						} else {
							that.loadMoreStatus = 2;
						}
						break;
				}
			},
			//获取积分记录
			fetchexamRecodList: function() {
				var that = this;
				if (page == 1) {
					var examRecodList = [];
				} else {
					var examRecodList = that.examRecodList;
				}
				var baseUrl = that.$constants.EXAM_EXAMRECODLIST + "?page=" + page;
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
							for (var i = 0; i < res.examRecodList.length; i++) {
								var item = res.examRecodList[i];
								item.accuracy = ((item.rightnum / item.totalnum) * 100).toFixed(2) + "%";
								item.create_time = item.create_time.substring(0, 10).replace('-', '年').replace('-', '月') + "日";
								item.end_time = item.end_time.substring(0, 10).replace('-', '年').replace('-', '月') + "日";
								examRecodList.push(item);
							}
							that.examRecodList = examRecodList;
						},
						res => { //fail
							that.$api.msg(res.ret_msg)
						}
					);
			},
			//页面跳转
			navTo: function(item) {
				var that = this;
				console.log(item)
				uni.navigateTo({
					url: '/pages/answer/examRecodDatas?record_id=' + item.id,
				})
			}
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
			color: #ff5050;
		}

	}
</style>
