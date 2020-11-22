<template>
	<view class="content">
		<view class="item" v-for="item in papers" :key="item.month">
			<view class="weekTitle">{{item.month}}</view>
			<view class="uni-list">
				<uList v-for="sitem in item.data" :key="sitem.paper_code" :node="sitem.isHasAnswer?'已完成':'未完成'" :nodeColor="sitem.isHasAnswer?'#ff3d5d':''"
				 :title="sitem.title" @eventClick="goToAnswer(sitem)" />
			</view>
		</view>
	</view>
</template>

<script>
	import uList from '@/components/list/mix-list-cell2.vue'
	export default {
		components: {
			uList
		},
		data() {
			return {
				paper_type: '',
				paper_name: '',
				papers: [],
			};
		},
		onLoad(options) {
			var that = this;
			if (options.hasOwnProperty("paper_type")) {
				that.paper_type = options.paper_type;
			}
		},
		onShow() {
			var that = this;
			that.loadData();
		},
		methods: {
			loadData: function() {
				var that = this;
				if (that.$utils.isEmpty(that.paper_type)) {
					return;
				}
				var baseUrl = that.$constants.EXAM_GETPAPERBYTYPE + "?paper_type=" + that.paper_type;
				that.$request
					.get({
						url: baseUrl,
						loadingTip: '加载中...'
					})
					.then(
						res => { //success
							uni.setNavigationBarTitle({
								title: res.paperType.title,
							})
							that.paper_name = res.paperType.title;
							var map = {},
								arr = res.papers,
								papers = [];
							for (var i = 0; i < arr.length; i++) {
								var ai = arr[i];
								ai.month = parseInt(ai.month) + "月";
								if (ai.hasOwnProperty('recod')) {
									if (ai.recod.did == '1') {
										ai.isHasAnswer = true;
									} else {
										ai.isHasAnswer = false;
									}
								} else {
									ai.isHasAnswer = false;
								}
								if (!map[ai.month]) { //依赖分组字段可自行更改！
									papers.push({
										month: ai.month, //依赖分组字段可自行更改！
										data: [ai]
									});
									map[ai.month] = ai; //依赖分组字段可自行更改！
								} else {
									for (var j = 0; j < papers.length; j++) {
										var dj = papers[j];
										if (dj.month == ai.month) { //依赖分组字段可自行更改！
											dj.data.push(ai);
											break;
										}
									}
								}
							}
							that.papers = papers;
						},
						res => { //fail
							that.$api.msg(res.ret_msg)
						}
					);
			},
			goToAnswer: function(sitem) {
				var that = this;
				console.log(sitem)
				if (!sitem.isHasAnswer) {
					var paper_name = that.paper_name + sitem.title;
					uni.navigateTo({
						url: '/pages/answer/answerDetails1?paper_type=' + that.paper_type + "&paper_name=" + paper_name +
							"&paper_code=" + sitem.paper_code
					})
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
		padding-top: 20upx;

		.item {
			display: flex;
			flex-direction: column;
			width: calc(100% - 60upx);
			align-items: center;
			margin-bottom: 40upx;
		}
	}

	.uni-list {
		width: 100%;
		background: #FFFFFF;
		padding: 5upx;
		margin-top: 10upx;
		border-radius: $uni-border-radius-lg;
		box-shadow: 0 0 10upx $uni-bg-color-box-shadow;
	}

	.weekTitle {
		width: 98%;
		padding: 5upx;
		margin-bottom: 10upx;
		font-size: $uni-font-size-lg;
		padding-left: 10upx;
		border-left: 6upx solid #ff5050;
		letter-spacing: 4upx;
		font-weight: 600;
	}
</style>
