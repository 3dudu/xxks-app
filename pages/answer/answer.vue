<template>
	<view class="content">
		<view class="first">
			<image src="../../static/answer/top.png" class="backgroundImg" />
			<view class="details1" @click="gotoPointRecode()">
				<text class="title">奖励积分</text>
				<text class="num">{{exam_point}}</text>
			</view>
			<view class="headdiv" >
			<image class="headImg" :src="userinfo.head_ico" />
			</view>
			<view class="details2" @click="gotoExamRecode()">
				<text class="title">答题次数</text>
				<text class="num">{{exam_count}}</text>
			</view>
		</view>

		<view class="second" @click="goToAnswer(item)" v-for="item in examTypeList" :key="item.id">
			<view class="challengeItem">
				<image class="logo" :src="item.logo" />
				<view class="details">
					<text class="title">{{item.title}}</text>
					<text class="tip">{{item.description}}</text>
				</view>
				<image src="../../static/answer/rightIcon.png" class="rightIcon" />
			</view>
		</view>

		<view class="third">
			<view class="challengeItem" @click="goToAnswer(item)" v-for="item in limitedTime" :key="item.id">
				<image class="logo" :src="item.logo" />
				<view class="details">
					<text class="title">{{item.title}}</text>
					<text class="tip">{{item.description}}</text>
				</view>
				<image src="../../static/answer/rightIcon.png" class="rightIcon" />
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				examTypeList: [],
				limitedTime: [],
				userinfo: {
					"head_ico":"../../static/mine/table.png",
					"truename":"未登录"
				},
				exam_count: '0',
				exam_point: '0'
			};
		},
		onLoad() {

		},
		onShow() {
			var that = this;
			var that = this;
			let userinfo = this.$utils.getUserInfo();
			if(userinfo){
				this.userinfo = userinfo;
			}else{
				this.userinfo = {
					"head_ico":"../../static/mine/table.png",
					"truename":"未登录"
				};
				this.exam_count = 0;
				this.exam_point = 0;
			}
			that.fetchExamIndex();
			
			that.loadData();
		},
		onNavigationBarButtonTap(){
			uni.navigateTo({
				url: "/pages/answer/questionpool"
			})
		},
		methods: {
			gotoPointRecode:function(){
				uni.navigateTo({
					url: "/pages/tabMine/studyPoint"
				})
			},
			gotoExamRecode:function(){
				uni.navigateTo({
					url: "/pages/answer/examRecodList"
				})
			},
			loadData: function() {
				var that = this;
				var baseUrl = that.$constants.EXAM_GETEXAMTYPE;
				that.$request
					.get({
						url: baseUrl,
						//loadingTip: '加载中...'
					})
					.then(
						res => { //success
							var examTypeList = [];
							var limitedTime = [];
							for (var i = 0; i < res.getExamType.length; i++) {
								if (that.$utils.isEmpty(res.getExamType[i].logo)) {
									res.getExamType[i].logo = "../../static/errorImage.jpg"
								} else {
									if (res.getExamType[i].logo.indexOf('http') == -1) {
										res.getExamType[i].logo = that.$constants.SUQIAN_IMG_URI + res.getExamType[i].logo;
									} else {
										res.getExamType[i].logo = res.getExamType[i].logo;
									}
								}
								if (res.getExamType[i].c_times == "0") {
									examTypeList.push(res.getExamType[i]);
								} else {
									limitedTime.push(res.getExamType[i]);
								}
							}
							that.examTypeList = examTypeList;
							that.limitedTime = limitedTime;
						},
						res => { //fail
							that.$api.msg(res.ret_msg)
						}
					);
			},
			//答题首页数据，包含奖励京粉，答题次数
			fetchExamIndex: function() {
				var that = this;
				var baseUrl = that.$constants.EXAM_INDEX;
				that.$request
					.get({
						url: baseUrl,
						//loadingTip: '加载中...'
					})
					.then(
						res => { //success
						if(res){
							that.exam_count = res.exam_count;
							that.exam_point = res.exam_point;
						}
						},
						res => { //fail
							that.$api.msg(res.ret_msg)
						}
					);
			},
			goToAnswer: function(item) {
				var that = this;
				uni.setStorageSync("max_rightnum", item.max_rightnum); //缓存最高答题记录
				if (item.mode == 2 || item.mode == 3) {
					uni.navigateTo({
						url: '/pages/answer/answerList?paper_type=' + item.id,
					})
				} else {
					if (!that.$utils.isEmpty(item.c_times) && parseInt(item.c_times) > 0) {
						uni.navigateTo({
							url: '/pages/answer/answerDetails2?paper_type=' + item.id +
								"&paper_name=" + item.title +
								"&cTime=" + item.c_times
						})
					} else {
						uni.navigateTo({
							url: '/pages/answer/answerDetails1?paper_type=' + item.id + "&paper_name=" + item.title
						})
					}
				}
			}
		}
	}
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
		font-family: "Microsoft YaHei";
	}

	.first {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100vw;
		height: 300upx;
		box-shadow: 0 0 10upx $uni-bg-color-box-shadow;

		.backgroundImg {
			position: absolute;
			width: 100%;
			height: 300upx;
			z-index: 0;
		}

		.details1,
		.details2 {
			display: flex;
			flex-direction: column;
			padding: 40upx;
			flex: 1;
			justify-content: center;
			align-items: center;
			z-index: 10;
			.title {
				font-size: $uni-font-size-lg;
				color: $uni-bg-color;
				border: 1px solid;
				border-radius: 12px;
				padding: 0 5px;
			}
			.num {
				font-size: 60upx;
				margin-top: 20upx;
				color: $uni-bg-color;
			}
		}
		.headdiv{
			display: flex;
			flex-direction: column;
			flex: 1;
			justify-content: center;
			align-items: center;
			margin-bottom: 40upx;
			
			.headImg {
				width: 200upx;
				height: 200upx;
				border-radius: 200upx;		
				z-index: 100;
				position: absolute;
			}
		}
	}

	.second {
		margin-top: 20upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: $uni-bg-color;
		width: 100vw;
	}

	.third {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 20upx;
		margin-bottom: 20upx;
		background: $uni-bg-color;
		width: 100vw;
	}

	.challengeItem {
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom: 1upx solid $uni-bg-color-grey;
		width: 96vw;
		padding: 20upx;

		.logo {
			width: 120upx;
			height: 120upx;
			border-radius: 120upx;
			margin-right: 30upx;
			margin-left: 30upx;
		}

		.rightIcon {
			width: 18upx;
			height: 30upx;
			margin-right: 30upx;
			margin-left: 30upx;
		}

		.details {
			display: flex;
			flex: 1;
			margin-right: 30upx;
			flex-direction: column;
			justify-content: center;

			.title {
				font-size: $uni-font-size-lg;
				font-weight: bold;
			}

			.tip {
				font-size: $uni-font-size-sm + 2;
				color: $uni-text-color-grey;
				margin-top: 15upx;
			}
		}
	}
</style>
