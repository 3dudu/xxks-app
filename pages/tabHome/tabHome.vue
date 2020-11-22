<template>
	<view class="content">
		<!--标题栏-->

		<!-- 顶部选项卡 -->
		<scroll-view id="nav-bar" class="nav-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft">
			<view v-for="(item,index) in tabBars" :key="item.id" class="nav-item" :class="{current: index === tabCurrentIndex}"
			 :id="'tab'+index" @click="changeTab(index)">{{item.name}}</view>
		</scroll-view>

		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="titleTop" @refresh="onPulldownReresh"
		 @setEnableScroll="setEnableScroll">
			<!-- 内容部分 -->
			<swiper id="swiper" class="swiper-box" :duration="300" :current="tabCurrentIndex" @change="changeTab">
				<swiper-item class="swiper-box-item" v-for="tabItem in tabBars" :key="tabItem.id">
					<scroll-view class="panel-scroll-box" :scroll-y="enableScroll" @scrolltolower="loadMore" lower-threshold='0'>
						<!-- 
							* 新闻列表 
							* 和nvue的区别只是需要把uni标签转为weex标签而已
							* class 和 style的绑定限制了一些语法，其他并没有不同
						-->
						<view v-for="(item, index) in tabItem.newsList" :key="index" class="news-item" @click="navToDetails(item)">
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
						<mix-load-more :status="tabItem.loadMoreStatus"></mix-load-more>
					</scroll-view>
				</swiper-item>
			</swiper>
		</mix-pulldown-refresh>

		
	</view>
</template>

<script>
	import titleBar from '@/components/title-bar/title-bar.vue'
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
		
	let statusBarHeight = 0;
	// #ifdef APP-PLUS
	statusBarHeight = uni.getSystemInfoSync().statusBarHeight;	
	// #endif
	let windowWidth = 0,
		scrollTimer = false,
		tabBar;
	export default {
		components: {
			titleBar,
			mixPulldownRefresh,
			mixLoadMore,
		},
		data() {
			return {
				tabBars: [{
					"name":"推荐",
					"id":0,
					"newsList":[]
				}],
				tabCurrentIndex: 0, //当前选项卡索引
				scrollLeft: 0, //顶部选项卡左滑距离
				enableScroll: true,
				userinfo: {
					"head_ico":"../../static/mine/table.png",
					"truename":"未登录"
				},
				titleTop:statusBarHeight,
				loaded:true
			};
		},
		onNavigationBarSearchInputClicked(){
			uni.navigateTo({
				url: '../../pages/search/search'
			})
		},
		onShow(){
			/*
				if (uni.getStorageSync('userinfo') && uni.getStorageSync('userinfo').hasLogin) {
				var userinfo = uni.getStorageSync('userinfo').userinfo;
				if (this.$utils.isEmpty(userinfo.head_ico)) {
					userinfo.head_ico = "../../static/mine/table.png"
				} else {
					if (userinfo.head_ico.indexOf('http') == -1) {
						userinfo.head_ico = this.$constants.SUQIAN_IMG_URI + userinfo.head_ico;
					} else {
						userinfo.head_ico = userinfo.head_ico;
					}
				}
				this.userinfo = userinfo;	
				}else{
					this.userinfo = {
					"head_ico":"../../static/mine/table.png",
					"truename":"未登录"
				};
				}
			*/
		},
		onLoad() {
			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			this.loadcache();
			let that = this;
			setTimeout(function(){
				that.loadhome();
			},2000);
		},
		methods: {
			loadcache(){
				let res = this.$json.tabList.ret_data;
				let tabList = res.topCat;
				tabList.forEach(item => {
					item.newsList = [];
					item.loadMoreStatus = 0; //加载更多 0加载前，1加载中，2没有更多了
					item.refreshing = 0;
					item.loaded = false;
					this.tabBars.push(item);
				});
				this.tabBars[0].paging = res.paging;
				let list = res.studyList;
				list.forEach(item => {
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
					this.tabBars[0].newsList.push(item);
				})
			},
			/**
			 * 数据处理方法在vue和nvue中通用，可以直接用mixin混合
			 * 这里直接写的
			 * mixin使用方法看index.nuve
			 */
			//获取分类
			loadhome() {
				var baseUrl = this.$constants.STUDY_HOME;
				this.$request
					.get({
						url: baseUrl,
						loadingTip: '数据更新中...'
					})
					.then(
						res => {
							this.tabBars = [{
								"name":"推荐",
								"id":0,
								"newsList":[]
							}];
							let tabList = res.topCat;
							tabList.forEach(item => {
								item.newsList = [];
								item.loadMoreStatus = 0; //加载更多 0加载前，1加载中，2没有更多了
								item.refreshing = 0;
								item.loaded = false;
								this.tabBars.push(item);
							});
							this.tabBars[0].paging = res.paging;
							let list = res.studyList;
							list.forEach(item => {
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
								this.tabBars[0].newsList.push(item);
							})
							if (this.tabBars[0].paging.index == this.tabBars[0].paging.totalpage) {
								this.tabBars[0].loadMoreStatus = 2;
							}else{
								this.tabBars[0].loadMoreStatus = 0;
							}
							this.loaded = true;
					})
			},
			//新闻列表
			loadNewsList(type,index=this.tabCurrentIndex) {
				let tabItem = this.tabBars[index];
				let page = 0;
				//type add 加载更多 refresh下拉刷新
				if (type === 'add') {
					if (tabItem.loadMoreStatus === 2) {
						return;
					}
					tabItem.loadMoreStatus = 1;
					if(tabItem.paging){
						page = tabItem.paging.index+1;
					}
				}
				// #ifdef APP-PLUS
				else if (type === 'refresh') {
					tabItem.refreshing = true;
				}
				// #endif
				if(index==0){
					var baseUrl = this.$constants.STUDY_HOME+"?page="+page;
				}else{
					var baseUrl = this.$constants.STUDY_LOAD_MORE+"?cid="+tabItem.id+"page="+page;
				}
				this.$request
					.get({
						url: baseUrl,
						loadingTip: '加载中...'
					})
					.then(
						res => {
							if (type === 'refresh') {
								tabItem.newsList = []; //刷新前清空数组
							}
							let list = res.studyList;
							list.forEach(item => {
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
								tabItem.newsList.push(item);
							})
							//下拉刷新 关闭刷新动画
							if (type === 'refresh') {
								this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
								// #ifdef APP-PLUS
								tabItem.refreshing = false;
								// #endif
							}
							tabItem.paging = res.paging;
							//上滑加载 处理状态
							if (tabItem.paging.index >= tabItem.paging.totalpage) {
								tabItem.loadMoreStatus = 2;
							}else{
								tabItem.loadMoreStatus = 0;
							}
							this.loaded = true;
				})
			},
			//新闻详情
			navToDetails(item) {
				uni.navigateTo({
					url: `/pages/details/details?id=${item.id}&title=${item.title}`
				})
			},

			//下拉刷新
			onPulldownReresh() {
				if(this.loaded){
					this.loaded = false;
					this.loadNewsList('refresh');
				}
			},
			//上滑加载
			loadMore() {
				if(this.loaded){
					this.loaded = false;
					this.loadNewsList('add');
				}
			},
			//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
			setEnableScroll(enable) {
				if (this.enableScroll !== enable) {
					this.enableScroll = enable;
				}
			},

			//tab切换
			async changeTab(e) {

				if (scrollTimer) {
					//多次切换只执行最后一次
					clearTimeout(scrollTimer);
					scrollTimer = false;
				}
				let index = e;
				//e=number为点击切换，e=object为swiper滑动切换
				if (typeof e === 'object') {
					index = e.detail.current
				}
				if (typeof tabBar !== 'object') {
					tabBar = await this.getElSize("nav-bar")
				}
				//计算宽度相关
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
				let nowWidth = 0;
				//获取可滑动总宽度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('tab' + i);
					width += result.width;
					if (i === index) {
						nowWidth = result.width;
					}
				}
				if (typeof e === 'number') {
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
					this.tabCurrentIndex = index;
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(() => {
					if (width - nowWidth / 2 > windowWidth / 2) {
						//如果当前项越过中心点，将其放在屏幕中心
						this.scrollLeft = width - nowWidth / 2 - windowWidth / 2;
					} else {
						this.scrollLeft = 0;
					}
					if (typeof e === 'object') {
						this.tabCurrentIndex = index;
					}
					this.tabCurrentIndex = index;
					let tabItem = this.tabBars[index];
					if (index !== 0 && tabItem.loaded !== true) {
						this.loadNewsList('add',index);
						tabItem.loaded = true;
					}
					
				}, 300);
				//第一次切换tab，动画结束后需要加载数据
				
			},
			//获得元素的size
			getElSize(id) {
				return new Promise((res, rej) => {
					let el = uni.createSelectorQuery().select('#' + id);
					el.fields({
						size: true,
						scrollOffset: true,
						rect: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
		}
	}
</script>

<style lang="scss">

	page,.content {
		display: flex;
		flex-direction: column;
		background-color: $uni-bg-color-grey;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	/* 顶部tabbar */
	.nav-bar {
		z-index: 10;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0, 0, 0, .06);
		background-color: $uni-bg-color;

		.nav-item {
			display: inline-block;
			//min-width: 25%;
			padding-left: 16upx;
			padding-right: 16upx;
			height: 90upx;
			text-align: center;
			line-height: 90upx;
			font-size: 30upx;
			color: #303133;
			position: relative;

			&:after {
				content: '';
				width: 0;
				height: 0;
				border-bottom: 6upx solid $uni-color-title;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				transition: .3s;
			}
		}

		.current {
			color: $uni-color-title;
			font-size: 40upx;
			font-weight: 900;
			&:after {
				width: 75%;
			}
		}
	}

	.swiper-box {
		height: 100%;
	}
	.swiper-box-item {
		height: 100%;
	}

	.panel-scroll-box {
		height: 100%;

		.panel-item {
			background: #fff;
			padding: 30px 0;
			border-bottom: 2px solid #000;
		}
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
