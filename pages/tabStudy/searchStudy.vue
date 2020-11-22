<template>
	<view class="content">
		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="0" @refresh="onPulldownReresh"
		 @setEnableScroll="setEnableScroll">
			<scroll-view class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadMore">
				<view v-for="(item, index) in studyList" :key="index" class="news-item" @click="navToDetails(item)">
					<text :class="['title', 'title'+item.type]">{{item.title}}</text>
					<view v-if="item.photo.length > 0" :class="['img-list', item.photo.length === 1 ? 'img-list-single': 'img-list-m']">
						<view v-for="(imgItem, imgIndex) in item.photo" :key="imgIndex" :class="['img-wrapper', 'img-wrapper'+item.type, item.photo.length === 1 ? 'img-wrapper-single': '']">
							<image class="img" :src="imgItem.img" :mode="item.photo.length === 1?'aspectFill':'aspectFill'"></image>
							<view class="video-tip" v-if="item.videoSrc">
								<image class="video-tip-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAEC0lEQVRoQ+2ajVEVMRDHdzuwA6ACpQKxArECtQKxAqECoQKhAqECoQKxAqEDrWCdn7Nx8vJy+bp3T4YhM2+O8S7J/rO7//2IKo9k6CPBIU9Acpo0s10ReSkiPA8mtH0tIncicqOqPDcyZmvEhX8rIu8cQI9gtyJyKSIXc0ENA3EAnxxAj/BT356LyEdV/TWyWDcQM3smIgA4mtjwXkQ4aX4Mngj3QkSYy5PfTmb+laoeLg7EzBDga8aEEB4TOVfVAKAoj2sUc+QXQC0PxMzY8Esi3W8ROVbV05FTDHPMDC1AEBzEcqY1AeLMQQxtXANuZvjMa/cb/i6Oqo9kQKCFI1WtLl7bfOq9mUHd3/w9ND1F5f+WKAJxn/gebQiIg1Y/mAEEUsDX8J0zVZ0iljoQZydAYLuMrYCIwXOQrYc2qREzw4E/RAu/X9KcRrUX5mWBODX+jBY/UdXjuZuNznd5PnscepNjtikgODJpRzCp3VFaHBU+MTEOkSDMIJ0hFKyMNSAZbZA2NMUJn7ujqjebABDWyDDnXpqb5YDEvnGvqsHZi7I5CMgBxiHDxRx5bmSYGZlyyADWmCwHBN8IwjdRH5Im3B+En5UIJuYFBeMnjFtV3Y/frwDJmNV+K/1NAGEvIv+pqp7MUU1GthXzSoHE+VSzWRU0EsuOaUDhw+aWmNdKOEiBxOzQlYkWNJIqAiAI0V0dmhkZNvkXYyUkpEDYhFJ17cOaWXQACUtxaPhgc9JpZvFBr+Rg/xNI8B+0w0lXR0LDzUCIoE0bNPpISdC1uJD7uJQVlzTyEIFQgFGhMpo10pVfDfgIwlAiU9s0af4h+gglARkE8WURZ98G/V65Fhal3zgg3qnqXpVK/IMG0/rhAOYExDh9KgZEcqy4DtlEirKpTgutqLjsnk5RnEaLWeaUhiY0srFOS1KxrqVPtTS+2by8xsdsnkONNN5G0pDCQcVmtcaoLYVVV63e0zDo8L+0OVgvrNy84lIXemRiM022CtjynWsabVCwMdpKXQeSOlZXcGwRsPWbJAgyLZvOPOh2UKZWn6xYS0Dibl/IVF+1VoytJ15wbqyCtmkwKdIZGnZZE+9tmbLI4mC8VRuDAG8xpo00sQFDi2iRJrabU2jGBYVVmbMKxJ0/dzfSXeGVzM3ZiRZt2tGsgmDdJiAFMGiHNPxijk+YGV1NsuHgD82aCB82A4lomdohvf8jrQm3s61XbzgzAMJtVXwWOPZhD7F0AXEwnBrqjzv1sRCACnfp/HvIdsNlTbiDn+pgDuVn3UCCxN4wA1Bods+xrr8R26/yuuuULh8p8D0nSzsTE8ldOZcAhttgKsUhAEM+Ujty1xIm1PJfOK7nCh/LM2xaNVDbfv8EZNsnXtvvDyrmF1FIBKIwAAAAAElFTkSuQmCC"></image>
							</view>
						</view>
					</view>							
					<!-- 空图片占位 -->
					<view v-else class="img-empty"></view>
					<text :class="['desc',item.photo.length > 0 ? '': 'desc3']">{{item.description}}</text>
					<view :class="['bot', 'bot'+item.type]">
						<text class="author">{{item.name}}</text>
						<text class="time">{{item.create_time_v}}</text>
						<text class="time">学习({{item.article_readnum}})</text>
						<text class="time">点赞({{item.article_likenum}})</text>
					</view>
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
				keywords: '',
				total: 1,
				studyList: [],
				enableScroll: true,
				loadMoreStatus: 0, //加载更多 0加载前，1加载中，2没有更多了
			};
		},
		onLoad(options) {
			var that = this;
			if (options.hasOwnProperty('keywords')) {
				that.keywords = options.keywords;
			}
			that.loadData('refresh');
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
				var baseUrl = that.$constants.STUDY_SEARCHSTUDY + "?keywords=" + that.keywords;
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
								item.create_time_v = item.create_time_v.substring(0, 10).replace('-', '年').replace('-', '月') + "日";
								if(item.photo){
									item.photo.forEach(
										img=>{
											if (img.img.indexOf('http') == -1) {
												if(img.img.indexOf('pic') == -1){
													img.img = this.$constants.SUQIAN_IMG_URI+"pic/thumb/w/200/h/200?pic=" + img.img;
												}else{
													img.img = this.$constants.SUQIAN_IMG_URI + img.img;
												}
											}
										}
									)
								}else{
									item.photo = [];
								}
								
								studyList.push(item);
							}
							that.studyList = studyList;
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
					url: `/pages/details/details?id=${item.id}&ap_id=${item.ap_id}&title=${item.ap_title}`
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

	.video-wrapper {
		width: 100%;
		height: 440upx;
		.video {
			width: 100%;
		}
	}
	
	.news-item {
		position: relative;
		padding: 24upx 30upx;
		padding-bottom: 4upx;
		border-bottom-width: 1px;
		border-color: #eee;
		background-color: #fff;
	}
	
	.title {
		font-size: 34upx;
		color: #222222;
		line-height: 46upx;
	}
	.desc{
		font-size: 28upx;
		color: #777777;
		line-height: 46upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
		
	.desc3{
		-webkit-line-clamp: 4;
	}
	.bot {
		flex-direction: row;
		padding-top: 5px;
		border-bottom: 1px solid #eeeeee;
	}
	
	.author {
		font-size: 26upx;
		color: #aaa;
	}
	
	.time {
		font-size: 26upx;
		color: #aaa !important;
		margin-left: 20upx;
		.uni-icon {
			color: #aaa !important;
			padding-right: 2px;
			padding-bottom: 2px !important;
		}
	}
	
	.img-list {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		flex-direction: row;
		background-color: #fff;
	}
	
	.img-wrapper {
		flex: 1;
		flex-direction: row;
		position: relative;
		overflow: hidden;
		padding: 2px;
		height: 160upx;
		vertical-align: middle;
	}
	.img {
		width: 100%;
		height: 100%;
		border-radius: 3px;
	}

	.img-empty {
		height: 0upx;
	}

	/* 图在左 */
	.img-list1 {
		position: absolute;
		left: 30upx;
		top: 24upx;
	}
	
	.title1 {
		padding-left: 240upx;
	}
	
	.bot1 {
		padding-left: 240upx;
		margin-top: 20upx;
	}
	
	/* 图在右 */
	.img-list2 {
		position: absolute;
		right: 30upx;
		top: 24upx;
	}
	
	.title2 {
		padding-right: 210upx;
	}
	
	.bot2 {
		margin-top: 20upx;
	}
	
	/* 底部3图 */
	.img-list3 {
		width: 700upx;
		margin: 16upx 0upx;
	}
	
	.img-wrapper3 {
		margin-right: 4upx;
	}
	
	/* 底部大图 */
	.img-list-single {
		width: 690upx;
		height: 320upx;
		margin: 6upx 0upx;
	}
	
	.img-wrapper-single {
		height: 100%;
		margin-right: 0upx;
	}
	
	.video-tip {
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .3);
	}
	
	.video-tip-icon {
		width: 60upx;
		height: 60upx;
	}
</style>
