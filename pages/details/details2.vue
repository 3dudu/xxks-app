<template>
	<view class="content">
		<!-- #ifdef !APP-PLUS -->
		<view class="titlebar">
			<image src="../../static/integral/titlebar.png" class="titlebackground"></image>
			<image src="../../static/integral/lefticon.png" class="lefticon" @click="back"></image>
			<view class="head_title">文章详情</view>
			<view class="right" @click="clickTime">目录</view>
		</view>
		<!-- #endif -->

		<scroll-view class="scroll" scroll-y>
			<view class="scroll-content">
				<view class="introduce-section" v-if="!loading">
					<text class="title">{{detailData.title}}</text>
					<view class="introduce">
						<text>{{detailData.update_time}}</text>
					</view>
					<view>
						<rich-text :nodes="detailData.content"></rich-text>
					</view>
				</view>
				<!-- 加载图标 -->
				<mixLoading class="mix-loading" v-if="loading"></mixLoading>
			</view>
			<popup-layer ref="popupRef" :direction="'right'">
				<scroll-view style="height: 100%;" scroll-y>
					<view class="partListTitle" v-for="(item, index) in partList" :key="index" @click="choseSection(index)">
						<text :style="[{color: index+1 == current ? '#3275fd':''}]"> 第{{index+1}}章 {{item.title}}</text>
					</view>
				</scroll-view>
			</popup-layer>

			<view class="functionButton">
				<image src="../../static/study/la.png" class="icon" v-if="isShowFunctionButton" @click="changeFunctionButtonStatus"></image>
				<image src="../../static/study/la2.png" class="icon" v-if="!isShowFunctionButton" @click="changeFunctionButtonStatus"></image>
				<view class="functionButton_1" v-if="isShowFunctionButton">
					<image class="icon2" v-if="isHasFav=='0'" src="../../static/study/collection.png" @click="collectArticle"></image>
					<image class="icon2" v-if="isHasFav=='1'" src="../../static/study/hascollection.png" @click="cancelCollectArticle"></image>
					<image class="icon2" src="../../static/study/share.png" @click="shareArticle"></image>
				</view>
			</view>


		</scroll-view>

		<view class="shareShowView" v-if="shareShowView" @click="shareArticle">
			<image src="../../static/study/fenxiangbackground.png"></image>
		</view>
		<empty v-if="isShowEmpty" top="44px"></empty>
		<uni-pagination @change="changeIndex" :total="detailData.total" pageSize="1" :current="current"></uni-pagination>

	</view>
</template>

<script>
	var setInter;
	import empty from '@/components/empty/empty.vue';
	import uniPagination from "@/components/uni-pagination/uni-pagination.vue";
	import mixLoading from '@/components/mix-loading/mix-loading.vue';
	import popupLayer from '@/components/popup-layer/popup-layer.vue';


	export default {
		components: {
			empty,
			mixLoading,
			uniPagination,
			popupLayer
		},
		data() {
			return {
				allTitle: '',
				id: '', //文章id
				ap_id: '', //章节id
				loading: true,
				detailData: {},
				newsList: [],
				evaList: [],
				partList: [],
				current: 1,
				isShowEmpty: false,
				cTime: 120, //两分钟
				isShowFunctionButton: false,
				isHasFav: "0", //是否已经收藏
				shareShowView: false,
				imageProp:{
					domain:"http://sqyj.goat.msns.cn:5088",
					mode:"widthFix"
				}
			}
		},
		onLoad(options) {
			if (options.hasOwnProperty('id')) {
				this.id = options.id;
			}
			if (options.hasOwnProperty('ap_id')) {
				this.ap_id = options.ap_id;
			}
			if (this.$utils.isEmpty(this.ap_id)) {
				this.loadStudyDetail("none");
			} else {
				this.loadStudyDetail("ap_first");
			}
			this.allTitle = options.title;
		},
		onShow() {
			// #ifdef H5
			this.$WXConfig.wxShowMenu(this.allTitle);
			// #endif
			this.startSetInter();
		},
		onUnload() {
			var that = this;
			console.log("onUnload");
			clearInterval(setInter); //停止倒计时
		},
		onNavigationBarButtonTap(){
			this.clickTime();
		},
		methods: {
			//开始倒计时
			startSetInter: function() {
				var that = this;
				//将计时器赋值给setInter
				setInter = setInterval(
					function() {
						if (parseInt(that.cTime) > 0) {
							that.cTime = parseInt(that.cTime) - 30;
						} else {
							that.getPointOfStyudy();
						}
					}, 30000);
			},
			//阅读一定时长，上报获取积分
			getPointOfStyudy: function() {
				var that = this;
				clearInterval(setInter);
				var baseUrl = that.$constants.STUDY_SUBMITSTUDY + "?id=" + that.id + "&part_id=" + that.ap_id;
				that.$request
					.get({
						url: baseUrl,
					})
					.then(
						res => { //成功
							clearInterval(setInter); //先停止上一个计时器
							that.cTime = 120; //倒计时时间归位
							that.startSetInter(); //开始倒计时
						},
						res => { //失败
							//that.$api.msg(res.ret_msg)
						}
					);
			},
			//点击时长
			clickTime: function(res) {
				this.$refs.popupRef.show()
			},
			//改变下标记
			changeIndex: function(res) {
				var that = this;
				that.current = res.current;
				that.loadStudyDetail("change");
			},
			//选择章节
			choseSection: function(index) {
				var that = this;
				that.current = index + 1;
				that.loadStudyDetail("change");
				that.$refs.popupRef.close();
			},
			//获取推荐列表
			loadStudyDetail: function(type) {
				var that = this;
				var detailData = {};
				var baseUrl = that.$constants.STUDY_DETAIL + "?id=" + that.id;
				if (type == 'change') {
					baseUrl = baseUrl + "&part_id=" + that.partList[that.current - 1].id;
				}
				if (type == 'ap_first') {
					baseUrl = baseUrl + "&part_id=" + that.ap_id;
				}
				that.loading = true;
				that.$request
					.get({
						url: baseUrl,
					})
					.then(
						res => { //成功
							if (res.studyDetail.hasOwnProperty("cur_part")) {
								detailData.title = res.studyDetail.cur_part.title;
								detailData.update_time = res.studyDetail.cur_part.update_time;
								detailData.content = res.studyDetail.cur_part.content;
								that.ap_id = res.studyDetail.cur_part.id;
							} else {
								that.isShowEmpty = true;
							}
							if (res.studyDetail.hasOwnProperty("log")) {
								that.isHasFav = res.studyDetail.log.fav;
							} else {
								that.isHasFav = "0";
							}
							if (res.studyDetail.hasOwnProperty('partList')) {
								detailData.total = res.studyDetail.partList.length;
								var partList = [];
								for (var i = 0; i < res.studyDetail.partList.length; i++) {
									var item = {
										"id": res.studyDetail.partList[i].id,
										"title": res.studyDetail.partList[i].title,
									}
									partList.push(item);
									if (res.studyDetail.partList[i].id == that.ap_id && type == 'ap_first') {
										that.current = i + 1;
									}
								}
								that.partList = partList;
							}
							that.detailData = detailData;
							that.loading = false;
						},
						res => { //失败
							//that.$api.msg(res.ret_msg)
						}
					);
			},
			//返回
			back: function() {
				var that = this;
				if (getCurrentPages().length > 1) {
					uni.navigateBack({
						delta: 1
					});
				} else {
					uni.switchTab({
						url: "/pages/tabStudy/tabStudy"
					})
				}
			},
			//是否显示功能键
			changeFunctionButtonStatus: function() {
				var that = this;
				that.isShowFunctionButton = !that.isShowFunctionButton;
			},
			//收藏文章
			collectArticle: function() {
				var that = this;
				that.$utils.collectArticle(that.id, that.ap_id);
				setTimeout(() => {
					that.loadStudyDetail("ap_first");
				}, 300)

			},
			//取消收藏文章
			cancelCollectArticle: function() {
				var that = this;
				that.$utils.cancelCollectArticle(that.id, that.ap_id);
				setTimeout(() => {
					that.loadStudyDetail("ap_first");
				}, 300)
			},
			//分享
			shareArticle: function() {
				var that = this;
				that.shareShowView = !that.shareShowView;
			},
		}
	}
</script>
<style>
	.status_bar {
	    height: var(--status-bar-height);
	    width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
</style>
<style lang="scss">
	page,
	.content {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		align-items: center;
		overflow: hidden;
		background: $uni-bg-color-grey;
		font-family: "Microsoft YaHei";
	}

	.shareShowView {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		background: rgba(0, 0, 0, 0.5);
		z-index: 12;
		position: fixed;
		top: 0;
		left: 0;

		image {
			position: absolute;
			top: 0upx;
			right: 40upx;
			width: 225upx;
			height: 152upx;
		}
	}

	.titlebar {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100vw;
        height: 44px;

		.titlebackground {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 44px;
		}

		.lefticon {
			width: 46px;
			height: 18px;
			z-index: 10;
			margin-left: 10px;
		}

		.head_title {
			flex: 1;
			z-index: 10;
			font-weight: 700;
			font-size: 16px;
			line-height: 30px;
			text-align: center;
			width: 263upx;
			color: #FFFFFF;
		}

		.right {
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			z-index: 10;
			font-size: 26upx;
			color: #FFFFFF;
			width: 92upx;
			margin-right: 10px;
		}
	}

	.scroll {
		background-color: #f8f8f8;
		height: calc(100vh - 44px - 100upx);
	}

	.scroll-content {
		display: flex;
		flex-direction: column;
	}

	/* 简介 */
	.introduce-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		line-height: 1.5;

		.title {
			font-size: 36upx;
			color: #303133;
			margin-bottom: 16upx;
		}

		.introduce {
			display: flex;
			font-size: 26upx;
			color: #909399;

			text {
				margin-right: 16upx;
			}
		}
	}

	.partListTitle {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-lg;
		width: 60vw;
		height: 100upx;
		border-bottom: 2upx solid #f3f3f9;

		image {
			position: absolute;
			left: 0;
			width: 100%;
			height: 100upx;
		}

		text {
			z-index: 10;
			overflow: hidden;
			text-overflow: ellipsis;
			width: 90%;
			white-space: nowrap;
			text-align: left;
			font-size: $uni-font-size-base;
		}
	}

	.detailDataCcontent img {
		width: 100% !important;
	}

	.functionButton {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: fixed;
		right: -10upx;
		bottom: 360upx;
		height: 206upx;
		z-index: 11;

		.icon {
			width: 50upx;
			height: 147.1upx;
			background: #FFFFFF;
		}

		.functionButton_1 {
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 100upx;
			background: #FFFFFF;
			box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);

			.icon2 {
				width: 80upx;
				height: 80upx;
				margin-right: 20upx;
			}
		}
	}
</style>
