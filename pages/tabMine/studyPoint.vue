<template>
	<view class="content">
		<view class="first">
			<image src="../../static/studypoint/top.png" class="backgroundImg"></image>
			<image :src="userinfo.head_ico" class="headImg" />
			<view class="pointRow" @click="navTo('/pages/tabMine/pointListByDay')">
				<text class="title">成长总积分</text>
				<text class="num">{{ userinfo.point }}</text>
			</view>
			<view class="left" @click="navTo('/pages/tabMine/pointExplain')">
				<image src="../../static/mine/jifenshuoming.png" class="leftback"></image>
				<text class="title">积分说明</text>
			</view>
		</view>
		<image v-if="false" class="second" src="../../static/studypoint/shangcheng.png" @click="goToShop"></image>
		<view class="third">
			<view class="titleRow">
				<text class="title1">积分规则</text>
				<view class="titleRow_right">
					<text class="title2">今日累计</text>
					<text class="title3">{{ todayPoint }}</text>
					<text class="title2" style="color: #e74844;">积分</text>
				</view>
			</view>

			<view class="item" v-for="item in normal_task" :key="item.name">
				<view class="left">
					<text class="title1">{{ item.name }}</text>
					<text class="title2">{{ item.mark }}</text>
					<view class="left_bottom">
						<cmd-progress :percent="item.percent" :show-info="false" :stroke-color="'#e74844'"></cmd-progress>
						<text class="title2">已获{{ item.point * item.log_count }}分/每日上限{{ item.point * item.task_num }}分</text>
					</view>
				</view>
				<view class="right" v-if="item.log_count == item.task_num">已完成</view>
				<view class="right2" @click="navTo(item.url)" v-else-if="item.log_count != item.task_num && item.event == 'study'">去看看</view>
			</view>

			<view class="item" v-for="item in exam_task" :key="item.title">
				<view class="left">
					<text class="title1">{{ item.title }}</text>
					<text class="title2">{{ item.description }}</text>
					<view class="left_bottom">
						<cmd-progress :percent="item.percent" :show-info="false" :stroke-color="'#e74844'"></cmd-progress>
						<text class="title2">已获{{ item.got_score }}分/每日上限{{ item.maxScore }}分</text>
					</view>
				</view>
				<view class="right" v-if="item.got_score == item.maxScore">已完成</view>
				<view class="right2" @click="navTo(item.url)" v-else>去看看</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cmdProgress from '@/components/cmd-progress/cmd-progress.vue';
	export default {
		components: {
			cmdProgress
		},
		data() {
			return {
				userinfo: '',
				normal_task: [], //正常任务
				exam_task: [], //答题任务
				todayPoint: 0
			};
		},
		onLoad() {
			var that = this;
			if (uni.getStorageSync('userinfo')) {
				var userinfo = uni.getStorageSync('userinfo').userinfo;
				if (that.$utils.isEmpty(userinfo.head_ico)) {
					userinfo.head_ico = '../../static/moren.jpg';
				} else {
					if (userinfo.head_ico.indexOf('http') == -1) {
						userinfo.head_ico = that.$constants.SUQIAN_IMG_URI + userinfo.head_ico;
					} else {
						userinfo.head_ico = userinfo.head_ico;
					}
				}
				that.userinfo = userinfo;
			}
			that.fetchPointTaskList();
		},
		onShow() {

		},
		onNavigationBarButtonTap(){
			navTo('/pages/tabMine/pointListByDay');
		},
		methods: {
			//积分面板
			fetchPointTaskList: function() {
				var that = this;
				var baseUrl = that.$constants.UCENTER_POINTTASKLIST;
				that.$request
					.get({
						url: baseUrl,
						loadingTip: '加载中...',
						needLogin:true
					})
					.then(
						res => {
							var exam_task = [];
							for (var i = 0; i < res.exam_task.length; i++) {
								var item = {
									id: res.exam_task[i].id,
									title: res.exam_task[i].title,
									description: res.exam_task[i].description,
									maxScore: parseInt(res.exam_task[i].maxScore), //总分
									got_score: res.exam_task[i].got_score, //已得分
									percent: parseInt((res.exam_task[i].got_score / res.exam_task[i].maxScore) * 100), //完成率
									url: '/pages/answer/answer'
								};

								if (res.exam_task[i].id == '1') {
									//每日答题
									item.url = '/pages/answer/answerDetails1?paper_type=' + res.exam_task[i].id + '&paper_name=' + res.exam_task[
										i].title;
								}
								if (res.exam_task[i].id == '2') {
									//每周答题
									item.url = '/pages/answer/answerList?paper_type=' + res.exam_task[i].id;
								}

								if (res.exam_task[i].id == '3') {
									//跳转答题
									item.url =
										'/pages/answer/answerDetails2?paper_type=' +
										res.exam_task[i].id +
										'&paper_name=' +
										res.exam_task[i].title +
										'&cTime=' +
										res.exam_task[i].c_times;
								}

								exam_task.push(item);
							}
							that.exam_task = exam_task;

							var normal_task = [];
							for (var i = 0; i < res.normal_task.length; i++) {
								var item = {
									id: res.normal_task[i].id,
									name: res.normal_task[i].name,
									mark: res.normal_task[i].mark,
									event: res.normal_task[i].event,
									point: parseInt(res.normal_task[i].point), //单次积分
									task_num: res.normal_task[i].task_num, //任务积分上限 = task_num*point
									log_count: res.normal_task[i].log_count, //已获得次数，已得分 = point*log_count
									percent: parseInt((res.normal_task[i].log_count / res.normal_task[i].task_num) * 100) //完成率
								};
								if (res.normal_task[i].event == 'study') {
									item.url = '/pages/tabStudy/tabStudy';
									item.name = '每日学习';
								}
								normal_task.push(item);
								//console.log(normal_task)
							}
							that.normal_task = normal_task;

							if (res.hasOwnProperty('pointSummer')) {
								that.todayPoint = res.pointSummer.today;
								//更新缓存中的用户总积分
								var data = uni.getStorageSync('userinfo');
								data.userinfo.point = res.pointSummer.total;
								uni.setStorage({
									key: 'userinfo',
									data: data
								});
								that.userinfo.point = res.pointSummer.total;
							}
						},
						res => {
							that.$api.msg(res.ret_msg);
						}
					);
			},
			//页面跳转
			navTo: function(url) {
				var that = this;
				if (url == "/pages/tabStudy/tabStudy") {
					uni.switchTab({
						url: url,
					})
				} else {
					uni.navigateTo({
						url: url
					});
				}
			},
			//前往商场
			goToShop: function() {
				var that = this;
				uni.showModal({
					content: '抱歉,亲爱的用户,此功能暂未开放。',
					confirmColor: '#52C41A',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
						}
					}
				});
			},
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
		width: 100%;
		overflow-x: hidden;
		font-family: "Microsoft YaHei";
	}

	.titlebar {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
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
			margin-right: 56px;
			font-size: 16px;
			line-height: 30px;
			text-align: center;
			width: 263upx;
			color: #ffffff;
		}

		.right {
			position: absolute;
			right: 10px;
			z-index: 10;
			color: #ffffff;
			font-size: 12px;
		}
	}

	.first {
		display: flex;
		position: absolute;
		top: 0px;
		left: 0;
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
		padding-top: 60upx;
		width: 100vw;
		height: 260upx;

		.backgroundImg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 260upx;
		}

		.headImg {
			width: 100upx;
			height: 100upx;
			border-radius: 100upx;
			z-index: 10;
			border: 4upx solid $uni-bg-color;
		}

		.pointRow {
			display: flex;
			flex-direction: column;
			position: absolute;
			align-items: center;
			right: 80upx;
			top: 60upx;
			color: white;
			z-index: 10;

			.title {
				font-size: $uni-font-size-sm + 2;
			}

			.num {
				font-size: 32upx;
				padding: 3upx 30upx 3upx 30upx;
				background: #e74844;
				border-radius: 30upx;
				margin-top: 14upx;
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			position: absolute;
			align-items: center;
			justify-content: center;
			width: 158.88upx;
			height: 54.24upx;
			left: 0upx;
			top: 45upx;
			color: white;
			z-index: 10;

			.title {
				font-size: $uni-font-size-sm + 2;
				z-index: 11;
			}

			.leftback {
				position: absolute;
				width: 158.88upx;
				height: 54.24upx;
			}
		}
	}

	.second {
		position: absolute;
		top: calc(150upx + 0px);
		width: 710upx;
		height: 198.5upx;
	}

	.third {
		display: flex;
		flex-direction: column;
		padding: 30upx;
		width: 640upx;
		margin-top: 270upx;
		margin-bottom: 20upx;
		background: $uni-bg-color;
		box-shadow: 0 0 10upx $uni-bg-color-box-shadow;
		border-radius: $uni-border-radius-base;

		.titleRow {
			display: flex;
			flex-direction: row;
			width: 100%;
			padding-bottom: 20upx;
			align-items: center;

			.titleRow_right {
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-end;
			}

			.title1 {
				font-size: 38upx;
				font-weight: bold;
				color: #000000;
			}

			.title2 {
				font-size: 26upx;
			}

			.title3 {
				font-size: 26upx;
				color: #f13031;
				margin-left: 10upx;
			}
		}

		.item {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 20upx 0 20upx 0;
			border-top: 2upx solid $uni-bg-color-grey;

			.left {
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				margin-left: 5upx;
				flex: 1;

				.left_bottom {
					display: flex;
					flex-direction: row;
					flex: 1;
					align-items: center;

					.title2 {
						width: 400upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size: 20upx;
						color: #9b9b9b;
					}
				}

				.title1 {
					font-size: 32upx;
					margin-bottom: 20upx;
					//font-weight: bold;
					color: #000000;
				}

				.title2 {
					width: 400upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 26upx;
					color: #9b9b9b;
				}
			}

			.right {
				font-size: 26upx;
				color: #687078;
				background: #f2f3f5;
				padding: 10upx 10upx 10upx 10upx;
			}

			.right2 {
				font-size: 26upx;
				color: #ba9e83;
				background: #fdf7ef;
				padding: 10upx 10upx 10upx 10upx;
			}
		}
	}
</style>
