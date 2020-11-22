<template>
	<view class="content">
		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="0" @refresh="onPulldownReresh"
		 @setEnableScroll="setEnableScroll">
			<scroll-view class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadMore">
				<view class="study_item" :style="[{color:item.log != null ? '#75787b':''}]" v-for="item in studyList" :key="item.id"
				 @click="navToDetails(item)">
					<text class="title">{{item.title}}</text>
					<!-- <text class="describe">{{item.name}}</text> -->
					<text class="time">{{item.update_time}}</text>
				</view>
				<!-- 上滑加载更多组件 -->
				<mix-load-more v-if="total > 1" :status="loadMoreStatus"></mix-load-more>
			</scroll-view>
		</mix-pulldown-refresh>
		<empty v-if="studyList.length == 0" top="44px"></empty>
	</view>
</template>

<script>
	import empty from '@/components/empty/empty.vue';
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	var page = 1; //当前页数
	var total = 1; //总页数
	export default {
		components: {
			empty,
			mixPulldownRefresh,
			mixLoadMore,
		},
		data() {
			return {
				id: '',
				total: 1,
				studyList: [],
				enableScroll: true,
				loadMoreStatus: 0, //加载更多 0加载前，1加载中，2没有更多了
			};
		},
		onLoad(options) {
			var that = this;
			if (options.hasOwnProperty("id")) {
				that.id = options.id;
			}
			if (options.hasOwnProperty("title")) {
				uni.setNavigationBarTitle({
					title: options.title,
				})
			}
			that.loadData('refresh');
			
		},
		onShow() {
			var that = this;
			//that.loadData('refresh');
		},
		methods: {
			loadData: function(type) {
				var that = this;
				switch (type) {
					case 'refresh':
						page = 1;
						that.loadMoreStatus = 0;
						that.studyList = [];
						that.fetchSyudyList();
						break;
					case 'add':
						if (that.loadMoreStatus === 2) {
							return;
						}
						that.loadMoreStatus = 1;
						if (page < total) {
							page++;
							that.loadMoreStatus = 0;
							that.fetchSyudyList();
						} else {
							that.loadMoreStatus = 2;
						}
						break;
				}
			},
			//下拉刷新
			onPulldownReresh: function() {
				this.loadData('refresh');
			},
			//上滑加载
			loadMore: function() {
				this.loadData('add');
			},
			//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
			setEnableScroll: function(enable) {
				if (this.enableScroll !== enable) {
					this.enableScroll = enable;
				}
			},
			//获取学习列表
			fetchSyudyList: function() {
				var that = this;
				if (page == 1) {
					var studyList = [];
				} else {
					var studyList = that.studyList;
				}
				var baseUrl = that.$constants.STUDY_LOAD_MORE + "?cid=" + that.id + "&page=" + page;
				that.$request
					.get({
						url: baseUrl,
						loadingTip: '加载中...'
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
							for (var i = 0; i < res.studyList.length; i++) {
								var item = res.studyList[i];
								item.update_time = item.update_time.substring(0, 10).replace('-', '年').replace('-', '月') + "日";
								studyList.push(item);
							}
							that.studyList = studyList;
							console.log(that.studyList)
							that.$refs.mixPulldownRefresh && that.$refs.mixPulldownRefresh.endPulldownRefresh();
						},
						res => { //fail
							that.$api.msg(res.ret_msg)
						}
					);
			},
			//学习详情
			navToDetails(item) {
				uni.navigateTo({
					url: `/pages/details/details?id=${item.id}&title=${item.title}`
				})
			},
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

	.panel-scroll-box {
		height: 100%;
		width: 100%;
	}

	.study_item {
		display: flex;
		flex-direction: column;
		padding: 20upx;
		justify-content: center;
		width: 100%;
		margin-top: 2upx;
		background: $uni-bg-color;

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
		}

		.time {
			font-size: $uni-font-size-sm;
			text-align: left;
			width: calc(100% - 40upx);
			margin-top: $uni-spacing-col-sm;
		}
	}
</style>
