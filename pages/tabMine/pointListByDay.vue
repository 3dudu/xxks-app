<template>
	<view class="content">
		<view class="first">
			<image src="../../static/studypoint/beijing.png" class="backgroundImg"></image>
			<scroll-view scroll-x="true" class="dateScroll" :scroll-left="scrollLeft" :scroll-into-view="toindex"
			 scroll-with-animation="true" @scroll="dateHasScroll" @scrolltoupper="scrolltoupper" :upper-threshold="100">
				<view class="dateContent">
					<view class="date" v-for="(item, index) in dayPointList" :key="index" :id="'date'+index" @click="choseDate(item,index)">
						<view class="Cylinder">
							<view class="point" :style="[{color: currentIndex == index?'#ffffff':'#8ec7fe'}]"><text class="point_2">{{item.allPoint}}</text><text
								 class="point_3">分</text></view>
							<view class="Cylinder2" :style="[{height: (item.allPoint+0.5) +'%'}]" v-if="currentIndex == index"></view>
							<view class="Cylinder3" :style="[{height: (item.allPoint+0.5) +'%'}]" v-else></view>
						</view>
						<text class="date2" :style="[{color: currentIndex == index?'#ffffff':'#8ec7fe'}]">{{today==item.date?'今日':item.date}}</text>
					</view>
					<view class="seizeASeat">
						(占位，不显示)
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="second" v-if="dayPointList.length>0">
			<view class="second_1">
				<view class="todayPoint">
					<text class="todayPoint_1">当日积分:</text>
					<text class="todayPoint_2">{{dayPointList[currentIndex].allPoint}}</text>
				</view>
				<view class="dateAll">{{dayPointList[currentIndex].dateAll}}</view>
			</view>

			<view class="second_2">
				<view class="item" v-for="(item, index) in dayPointList[currentIndex].pointFrom" :key="index">
					<image src="../../static/study/jianju.png" class="jianju"></image>
					<view class="item_first">
						<view class="time">{{item.datetime}}</view>
						<view class="title">{{item.title}}</view>
					</view>
					<view class="point"><text class="pointAdd">+{{item.point}}</text>分</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				toindex: '',
				currentIndex: 0,
				dayPointList: [],
				startdate: '',
				enddate: '',
				today: '', //今日日期
				row: 0, //一次获得几天数据
				scrollLeft: 0,
				loaded:false,
			};
		},
		onLoad() {
			var that = this;
			that.fetchPointListByDay();
		},
		onShow() {
			var that = this;
			//that.fetchPointListByDay();
		},
		methods: {
			//选中日期
			choseDate: function(item, index) {
				var that = this;
				console.log(index);
				
				that.currentIndex = index;
				if (index - 1 < 0 || index - 1 == 0) {
					that.toindex = "date" + (index - 1);
				} else {
					that.toindex = "date" + (index - 2);
				}
				
				if (index == 0) {
					that.scrollLeft = 1;
				}
			},
			//滚动条滚动
			dateHasScroll: function(res) {
				var that = this;
				//console.log(res)
				//that.scrollWidth = res.detail.scrollWidth;
				//that.scrollLeft = (res.detail.scrollWidth) / that.dataListLen;
			},
			scrolltoupper: function() {
				var that = this;
				if(that.loaded){
					that.loaded = false;
					that.fetchPointListByDay();
					setTimeout(function(){
						that.loaded = true;
					},8000);
				}
			}, 
			//按天积分记录
			fetchPointListByDay: function() {
				var that = this;
				var first = false;
				var baseUrl = that.$constants.UCENTER_POINTLISTBYDAY;
				if (!that.$utils.isEmpty(that.startdate)) {
					baseUrl = baseUrl + "?enddate=" + that.startdate;
				}
				that.$request
					.get({
						url: baseUrl,
						loadingTip: '加载中...',
						needLogin:true
					})
					.then(
						res => {
							that.startdate = res.startdate;
							that.enddate = res.enddate;
							var daysArray = that.getBetweenDateStr(res.startdate, res.enddate);
							that.row = daysArray.length;

							if (!that.$utils.isEmpty(that.startdate)) {
								var dayPointList = that.dayPointList;
							} else {
								var dayPointList = [];
							}
							if (that.$utils.isEmpty(that.today)) {
								that.today = res.enddate.substring(5, res.enddate.length).replace("-", ".");
							}
							var dayPointList2 = [];

							for (var i = 0; i < daysArray.length; i++) {
								var item = {
									date: daysArray[i].substring(5, daysArray[i].length).replace("-", "."),
									dateAll: daysArray[i].replace("-", ".").replace("-", "."),
									allPoint: 0,
									pointFrom: [],
								};
								if (res.dayPointList.length != 0) {
									var key = daysArray[i];
									if (res.dayPointList[key]) { //说明当天有积分数据产生
										var allPoint = 0; //每一天获得积分和
										res.dayPointList[key].forEach(item => {
											allPoint = parseInt(allPoint) + parseInt(item.point);
											item.datetime = item.datetime.substring(11, 16);
										})
										item = {
											date: key.substring(5, key.length).replace("-", "."),
											dateAll: daysArray[i].replace("-", ".").replace("-", "."),
											allPoint: parseInt(allPoint),
											pointFrom: res.dayPointList[key],
										};
									}
								}
								dayPointList2.push(item);
							}

							//if (dayPointList.length != 0) {
							//	dayPointList.splice(0, 1);
							//}
							
							that.dayPointList = dayPointList2.concat(dayPointList);
							
							
							setTimeout(function(){
									//that.toindex = "date" + (that.row - 1);
									//that.currentIndex = that.row-1;
									console.log(that.dayPointList.length-dayPointList.length);
									that.choseDate(null,that.dayPointList.length-1-dayPointList.length);
								
								that.loaded = true;
							},1000);
						},
						res => {

						}
					);
			},
			//获得两个日期间所有日期
			getBetweenDateStr: function(start, end) {
				var result = [];
				var beginDay = start.split("-");
				var endDay = end.split("-");
				var diffDay = new Date();
				var dateList = new Array;
				var i = 0;
				diffDay.setDate(beginDay[2]);
				diffDay.setMonth(beginDay[1] - 1);
				diffDay.setFullYear(beginDay[0]);
				while (i >= 0) {
					var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
					diffDay.setTime(countDay);
					dateList[2] = diffDay.getDate();
					dateList[1] = diffDay.getMonth() + 1;
					dateList[0] = diffDay.getFullYear();
					if (String(dateList[1]).length == 1) {
						dateList[1] = "0" + dateList[1]
					};
					if (String(dateList[2]).length == 1) {
						dateList[2] = "0" + dateList[2]
					};
					
					result[i] = dateList[0] + "-" + dateList[1] + "-" + dateList[2];
					if(dateList[0] + "-" + dateList[1] + "-" + dateList[2] == end){
						break;
					}
					i++;
				};
				console.log(result);
				return result;
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
		align-items: flex-end;
		width: 100vw;
		overflow: hidden;
		height: 515upx;

		.backgroundImg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 515upx;
		}

		.dateScroll {
			width: 100vw;
			height: 515upx;
			z-index: 10;

			::-webkit-scrollbar {
				width: 0;
				height: 0;
				color: transparent;
			}

			.dateContent {
				display: flex;
				flex-direction: row;
				align-items: flex-end;
				height: 500upx;
				margin-left: 315upx;
				margin-top: 15upx;
			}

			.date {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-left: 25upx;
				padding: 20upx;
				height: calc(100% - 80upx);

				.Cylinder {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-end;
					flex: 1;
					width: 80upx;

					.Cylinder2 {
						width: 80upx;
						background: #FFFFFF;
						border-radius: 6upx;
					}

					.Cylinder3 {
						width: 80upx;
						background: #b5dbff;
						border-radius: 6upx;
					}
				}

				.point {
					margin-bottom: 10upx;
					width: 90upx;
					text-align: center;
					font-size: 26upx;
					font-weight: 400;
					.point_2 {
						font-size: 30upx;
						margin-right: 5upx;
					}
					.point_3 {
						font-size: 26upx;
					}
				}

				.date2 {
					font-size: 30upx;
					margin-top: 10upx;
					width: 90upx;
					text-align: center;
					font-size: 30upx;
					font-weight: 300;
				}
			}
		}
	}

	.second {
		width: calc(100% - 40upx);
		display: flex;
		padding: 20upx;
		flex-direction: column;

		.second_1 {
			flex-direction: row;
			align-items: flex-end;
			display: flex;

			.todayPoint {
				color: #f53434;
				font-weight: bold;
				flex: 1;

				.todayPoint_1 {
					font-size: 30upx;
					letter-spacing: 2upx;
				}

				.todayPoint_2 {
					font-size: 50upx;
					font-weight: 500;
					margin-left: 10upx;
				}
			}

			.dateAll {
				font-size: $uni-font-size-base;
				font-size: 26upx;
				font-weight: 400;
			}
		}

		.second_2 {
			margin-top: 20upx;
			margin-bottom: 20upx;
			flex-direction: column;
			display: flex;

			.item {
				flex-direction: row;
				align-items: flex-end;
				display: flex;
				margin-top: 10upx;

				.jianju {
					width: 14upx;
					height: 100upx;
					transform: translateY(20upx);
				}

				.item_first {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					margin-left: 10upx;
					flex: 1;

					.time {
						font-size: 28upx;
						color: #999999;
					}

					.title {
						margin-top: 10upx;
						font-size: 30upx;
						font-weight: 400;
					}
				}

				.point {
					font-size: 24upx;
					color: #f53434;

					.pointAdd {
						font-size: 38upx;
						font-weight: 600;
						margin-right: 5upx;
					}
				}
			}
		}
	}

	.seizeASeat {
		margin-left: calc(50vw - 100upx);
		width: 1upx;
		color: 0upx;
		opacity: 0;
	}
</style>
