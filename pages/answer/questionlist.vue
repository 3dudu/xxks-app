<template>
	<view class="content">
		<view class="item" v-for="(item, index) in examRecodDatasList" :key="index">
			<view class="weekTitle">
				<text class="title" v-if="item.type=='0'">任意题</text>
				<text class="title" v-else-if="item.type=='1'">判断题</text>
				<text class="title" v-else-if="item.type=='2'">单选题</text>
				<text class="title" v-else-if="item.type=='3'">多选题</text>
				<text class="title" v-else-if="item.type=='4'">填空题</text>
			</view>

			<view class="details" >
				<view class="title">{{index+1}}.{{item.question}}</view>
				<image :src="item.thumb" mode="aspectFit" v-if="item.showTitle"></image>
				<view class="option" v-if="item.type!='4'" v-for="(sitem, sindex) in item.items" :key="sindex">
					<view :style="[{color:sitem.checked?'#ff3d5d':''}]">
						{{sitem.item_value}}.{{sitem.item_content}}
					</view>
				</view>
				<!--答题解析-->
				<view class="analysis">
					<view class="weekTitle2">
						<text class="title2">正确答案</text>
					</view>
				<view class="answer">
					<view  v-if="item.type != '1'"><text style="color: #99cc33;">{{item.answer}}</text></view>
					<view  v-if="item.type == '1'"><text style="color: #99cc33;">{{item.answer == '1'?'A':'B'}}</text></view>
				</view>
					<view class="weekTitle2">
						<text class="title2">答题解析</text>
					</view>
					<view class="explain">
						<view>{{item.explain}}</view>
					</view>
				</view>
			</view>
		</view>
		<mix-load-more v-if="total > 1" :status="loadMoreStatus"></mix-load-more>
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
				total: 1, //总页数
				rows: 1, //总题数
				examRecodDatasList: [],
				loadMoreStatus: 0, //加载更多 0加载前，1加载中，2没有更多了
			}
		},
		onLoad(e) {
			var that = this;
			this.id = e.poolid;
			uni.setNavigationBarTitle({
				title: e.title
			})
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
						that.examRecodDatasList = [];
						that.fetchexamRecodDatasList();
						break;
					case 'add':
						if (that.loadMoreStatus === 2) {
							return;
						}
						that.loadMoreStatus = 1;
						if (page < total) {
							page++;
							that.loadMoreStatus = 0;
							that.fetchexamRecodDatasList();
						} else {
							that.loadMoreStatus = 2;
						}
						break;
				}
			},
			//获取积分记录
			fetchexamRecodDatasList: function() {
				var that = this;
				if (page == 1) {
					this.examRecodDatasList = [];
				} 
				var baseUrl = that.$constants.EXAM_QUESTIONLIST + "?page=" + page+"&poolid="+this.id;
				that.$request
					.get({
						url: baseUrl,
						loadingTip: '加载中...',
						needLogin:true
					})
					.then(
						res => { //success
							console.log(res);
							total = res.paging.totalpage;
							if (page == 1) {
								that.total = total;
								that.rows = res.paging.rows;
							}
							if (page == total) {
								that.loadMoreStatus = 2;
							}
							for (var i = 0; i < res.questionList.length; i++) {
								var item = res.questionList[i];
								if (item.hasOwnProperty('items')) {
									if (!that.$utils.isEmpty(item.items)) {
										var options = [];
										item.items.forEach((sitem, sindex) => {
											
											if (!that.$utils.isEmpty(sitem.item_content)) {
												options.push(sitem);
											}
										})
										item.items = options;
									} else {
										if (item.type == '1') { //判断题
											var options = [];
											var trueItem = {
												"item_content": "正确",
												"item_value": "A",
												"item_file": "",
											}
											var errorItem = {
												"item_content": "错误",
												"item_value": "B",
												"item_file": "",
											}
											if (item.answer == '1') {
												trueItem.checked = true;
											} else {
												errorItem.checked = true;
											}
											options.push(trueItem);
											options.push(errorItem);
											item.items = options;
										} else {
											item.inputNum = that.$utils.strNum("" + item.question, "#");
											item.question = "" + item.question.replace(/#/g, "_ ");
										}
									}
								}
								if (that.$utils.isEmpty(item.thumb)) {
									item.showTitle = false;
								} else {
									item.showTitle = true;
									
									if (item.thumb.indexOf('http') == -1) {
										item.thumb = that.$constants.SUQIAN_IMG_URI + item.thumb;
									} else {
										item.thumb = item.thumb;
									}
								}
								that.examRecodDatasList.push(item);
							}
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
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: $uni-bg-color-grey;
		width: 100vw;
		padding-bottom: 20upx;
		overflow: scroll;
		font-family: "Microsoft YaHei";
	}

	.item {
		display: flex;
		flex-direction: column;
		background: $uni-bg-color;
		box-shadow: 10upx 10upx 10upx #f1f1f1;
		margin-top: 20upx;
		z-index: 10;
		width: 90vw;

		.weekTitle {
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 88vw;
			padding: 5upx;
			margin-bottom: 10upx;
			padding-left: 10upx;
			line-height: 30upx;
			letter-spacing: 4upx;
			border-bottom: 2upx solid #F5F5F5;
			padding: 10upx;

			.title {
				border-left: 6upx solid #ff5050;
				margin-left: 10upx;
				padding-left: 10upx;
				font-weight: 600;
				font-size: $uni-font-size-lg;
			}

			.num {
				flex: 1;
				text-align: right;
				margin-right: 10upx;
				font-weight: bold;
				font-size: $uni-font-size-base;
			}
		}

		.details {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			padding: 20upx 0 20upx 0;
			.title {
				width: 94%;
				font-size: $uni-font-size-lg;
				overflow-wrap: break-word;
			}
			.option {
				display: flex;
				flex-direction: row;
				align-items: center;
				width: 88%;
				margin-top: 20upx;
				background: #F5F5F5;
				border-radius: 10upx;
				padding: 15upx;
				color: #8b8b8b;
				font-size: $uni-font-size-lg;

				view {
					flex: 1;
					display: flex;
					flex-direction: row;
					align-items: center;
				}

				image {
					width: 30upx;
					height: 30upx;
				}
			}
		}

	}

	.analysis {
		display: flex;
		flex-direction: column;
		margin-top: 40upx;
		.answer{
				font-weight: 600;
				font-size: 22px;
				padding:4px 12px;
				padding-bottom: 6px;
				color: #39D754;
			}
			.explain{
				font-size: $uni-font-size-base;
				padding: 2px 12px;
				color: #555555;
			}
		.weekTitle2 {
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 88vw;
			padding: 5upx;
			margin-bottom: 10upx;
			padding-left: 10upx;
			line-height: 30upx;
			letter-spacing: 4upx;
			border-bottom: 2upx solid #F5F5F5;
			padding: 10upx;

			.title2 {
				border-left: 6upx solid #ff5050;
				margin-left: 10upx;
				padding-left: 10upx;
				font-weight: 600;
				font-size: $uni-font-size-lg;
			}
		}

		
	}
</style>
