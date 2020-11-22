<template>
	<view class="content">
		<!--*********************题目*************************-->
		<image src="../../static/shanshui.png" class="shanshui"></image>
		<view class="timecontent" v-if="examStart"><led ref="led" :mode="submitAnswer.totaltimes>0?5:3" :total="submitAnswer.totaltimes" @timeup="autoFinish"></led></view>
		
		<view class="item">
			<view class="weekTitle">
				<text class="title" v-if="questionList[index].type=='0'">任意题</text>
				<text class="title" v-else-if="questionList[index].type=='1'">判断题</text>
				<text class="title" v-else-if="questionList[index].type=='2'">单选题</text>
				<text class="title" v-else-if="questionList[index].type=='3'">多选题</text>
				<text class="title" v-else-if="questionList[index].type=='4'">填空题</text>
				<text class="num">{{index+1}}/{{questionList.length}}</text>
			</view>

			<!--状态一：用户未确认答案-->
			<view class="details" v-if="questionList[index].userChose==null">
				<view class="title">{{index+1}}.{{questionList[index].question}}</view>
				<image :src="questionList[index].thumb" mode="aspectFit" v-if="questionList[index].showTitle"></image>
				<view class="option" v-if="questionList[index].type!='4'" v-for="(sitem, sindex) in questionList[index].items" :key="sindex"
				 @click="choseOption(sitem, sindex)">
					<view :style="[{color:sitem.checked?'#99cc33':''}]">
						<switch color="#99cc33" v-if="questionList[index].type=='3'" class="switch"
						 :checked="sitem.checked" type="checkbox" />{{sitem.item_value}}.{{sitem.item_content}}
					</view>
				</view>
				<view v-if="questionList[index].type=='4'">
					<wInput :maxlength="questionList[index].inputNum" @finishInput="finishInput"></wInput>
				</view>
				<view class="sure" @click="sure">确认</view>
			</view>

			<!--状态二：用户确认答案，答案正确-->
			<view class="details" v-else-if="questionList[index].userChose == questionList[index].answer">
				<view class="title">{{index+1}}.{{questionList[index].question}}</view>
				<image :src="questionList[index].thumb" mode="aspectFit" v-if="questionList[index].showTitle"></image>
				
				<view class="option" v-if="questionList[index].type!='4'" v-for="(sitem, sindex) in questionList[index].items" :key="sindex">
					<view :style="[{color:sitem.checked?'#99cc33':''}]">
						<switch color="#99cc33" v-if="questionList[index].type=='3'" class="switch" :checked="sitem.checked" type="checkbox" />{{sitem.item_value}}.{{sitem.item_content}}
					</view>
					<image v-if="sitem.checked" src="../../static/true.png"></image>
				</view>
				<view class="sure" v-if="(index+1) < questionList.length" @click="next">下一题</view>
				<view class="sure" v-else @click="next">提交</view>
			</view>

			<!--状态三：用户确认答案，答案错误-->
			<view class="details" v-else-if="questionList[index].userChose != questionList[index].answer">
				<view class="title">{{index+1}}.{{questionList[index].question}}</view>
				<image :src="questionList[index].thumb" mode="aspectFit" v-if="questionList[index].showTitle"></image>
				
				<view class="option" v-if="questionList[index].type!='4'" v-for="(sitem, sindex) in questionList[index].items" :key="sindex">
					<view :style="[{color:sitem.checked?'#ff3d5d':''}]">
						<switch color="#99cc33" v-if="questionList[index].type=='3'" class="switch" :checked="sitem.checked" type="checkbox" />{{sitem.item_value}}.{{sitem.item_content}}
					</view>
					<image v-if="sitem.checked" src="../../static/fail.png"></image>
				</view>
				<view class="sure" v-if="(index+1) < questionList.length" @click="next">下一题</view>
				<view class="sure" v-else @click="next">提交</view>
			</view>
		</view>

		<!--*********************解析*************************-->
		<view class="item2" v-if="questionList[index].userChose!=null && questionList[index].userChose != questionList[index].answer">
			<view class="weekTitle">
				<text class="title">答案解析</text>
			</view>
			<view class="details">
				<view class="title">正确答案:
					<text style="color: #ff3d5d;margin-left: 20upx;" v-if="questionList[index].type!='1'">
						{{questionList[index].answer}}
					</text>
					<text style="color: #ff3d5d;margin-left: 20upx;" v-else-if="questionList[index].type=='1' && questionList[index].answer=='1'">
						A
					</text>
					<text style="color: #ff3d5d;margin-left: 20upx;" v-else-if="questionList[index].type=='1' && questionList[index].answer=='0'">
						B
					</text>
				</view>
			</view>
			<view class="explain">{{questionList[index].explain}}</view>
		</view>


	</view>
</template>

<script>
	import wInput from '@/components/wakary-input/wakary-input.vue'
	import led from '@/components/mehaotian-numled/mehaotian-numled.vue';
	
	export default {
		components: {
			wInput,
			led
		},
		data() {
			return {
				index: 0,
				mode: '', //考试模式
				questionList: [{}],
				paper_type: '',
				paper_name: '',
				paper_code: '',
				//提交答题参数
				submitAnswer: {
					"doit":[],
					"paper_id": '', //试卷id                         T
					"record_id": '', //考试记录id，继续考试时需要      F
					"times": '', //耗时                               T
					"totalnum": '', //总题数                          T
					"rightnum": 0, //正确数                          T
					"totaltimes": 0, //总时间，限时考试需要           F
					"finish": 1, //限时考试时传                      F
					"donum": 0, //已答题数                           T
					"q_id": [], //	题目id                       T
					"q_answer": [], //题目答案                       T
					"q_times": [], //题目耗时                        T
					"q_isright": [], //是否正确                      T
					"q_type": [], //题型                             T
				},
				startTime: 0, //考试开始时间
				endTime: 0, //考试结束时间
				centerTime: 0, //上一题时间
				examStart:false
			};
		},
		onUnload(){
			this.$refs.led.stop(); //停止倒计时
		},
		onBackPress(){
			this.$refs.led.stop();
		},
		onLoad(options) {
			var that = this;
			if (options.hasOwnProperty('paper_type')) {
				that.paper_type = options.paper_type
			}
			if (options.hasOwnProperty('paper_name')) {
				that.paper_name = options.paper_name;
				uni.setNavigationBarTitle({
					title: options.paper_name
				})
			}
			if (options.hasOwnProperty('paper_code')) {
				that.paper_code = options.paper_code
			}
			that.loadData();
		},
		methods: {
			loadData: function() {
				var that = this;
				var baseUrl = that.$constants.EXAM_GENPAPAER + "?paper_type=" + that.paper_type +
					"&paper_name=" + that.paper_name +
					"&paper_code=" + that.paper_code;
				that.$request
					.get({
						url: baseUrl,
						loadingTip: '加载中...'
					})
					.then(
						res => { //success
							var submitAnswer = that.submitAnswer;
							if (res.paperType.hasOwnProperty('paper')) {
								submitAnswer.paper_id = res.paperType.paper.id; //试卷id
							}
							if (res.paperType.hasOwnProperty('times')) {
								submitAnswer.totaltimes = res.paperType.times * 60; //总时间，限时考试需要
							}
							if (res.paperType.hasOwnProperty('mode')) {
								that.mode = res.paperType.mode; //考试模式
							}
							// if (res.paperType.hasOwnProperty('recod')) {
							// 	submitAnswer.record_id = res.recod.id; 
							// }
							var questionList = [];
							if (res.paperType.hasOwnProperty('questionList')) {
								submitAnswer.totalnum = res.paperType.questionList.length; //试卷总题数
								var idsArray = [];
								var typesArray = [];
								for (var i = 0; i < res.paperType.questionList.length; i++) {
									var item = res.paperType.questionList[i];
									idsArray.push(item.id);
									submitAnswer["q_id"] = idsArray; // 试卷中题目id
									submitAnswer['doit'][i] = 0,
									typesArray.push(item.type);
									submitAnswer['q_type'] = typesArray; // 试卷中题目类型
									item.userChose = null;
									if (item.hasOwnProperty('items')) {
										if (!that.$utils.isEmpty(item.items)) {
											var options = [];
											item.items.forEach((sitem, sindex) => {
												sitem.checked = false;
												if (!that.$utils.isEmpty(sitem.item_content)) {
													options.push(sitem);
												}
											})
											item.items = options;
										} else {
											if (item.type != '4') {
												var options = [];
												var trueItem = {
													"item_content": "正确",
													"item_value": "A",
													"item_file": "",
													"checked": false
												}
												var errorItem = {
													"item_content": "错误",
													"item_value": "B",
													"item_file": "",
													"checked": false
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
									
									questionList.push(item);
								}
							}
							that.questionList = questionList;
							that.submitAnswer = submitAnswer;
							that.startTime = new Date().getTime();
							that.examStart = true;
							
							that.centerTime = that.startTime;
						},
						res => { //fail
							that.$api.msg(res.ret_msg)
						}
					);
			},
			//选择答案
			choseOption: function(item, sindex) {
				var that = this;
				var questionList = that.questionList;
				switch (questionList[that.index].type) {
					case "1": //判断
						//break;
					case "2": //单选
						//questionList[that.index].userChose = item['item_value'];
						questionList[that.index].items.forEach((titem, tindex) => {
							if (sindex == tindex) {
								titem.checked = true;
							} else {
								titem.checked = false;
							}
						})
						break;
					case "3": //多选
						questionList[that.index].items[sindex].checked = !questionList[that.index].items[sindex].checked;
						break;
				}
				that.questionList = questionList;
			},
			//确认按钮
			sure: function() {
				var that = this;
				var submitAnswer = that.submitAnswer;
				var questionList = that.questionList;
				var result = "";
				if (!that.$utils.isEmpty(questionList[that.index].items)) {
					questionList[that.index].items.forEach((sitem, sindex) => {
						if (sitem.checked) {
							//判断题结果转换 A==1：正确    B==0:错误
							if (questionList[that.index].type == "1") {
								if (sitem.item_value == "A") {
									result = result + "1";
								} else {
									result = result + "0";
								}
							} else {
								result = result + sitem.item_value;
							}
						}
					})
				}
				questionList[that.index].userChose = result;
				that.questionList = questionList;
				submitAnswer['doit'][submitAnswer.donum]=1;

				submitAnswer.donum++; //确认之后， 试卷已答题数增加
				var q_answer = submitAnswer['q_answer'];
				q_answer.push(result);
				submitAnswer['q_answer'] = q_answer; //用户回答
				//题目作答结果， 1：正确； 0：错误
				var q_isright = submitAnswer['q_isright'];
				if (result == questionList[that.index].answer) { //答案正确，试卷正确数增加
					submitAnswer.rightnum++;
					q_isright.push("1");
				} else {
					q_isright.push("0");
				}
				submitAnswer['q_isright'] = q_isright;
				//每道题消耗时间
				var q_times = submitAnswer['q_times'];
				q_times.push(parseInt((new Date().getTime() - that.centerTime) / 1000));
				that.centerTime = new Date().getTime();
				submitAnswer['q_times'] = q_times;

				that.submitAnswer = submitAnswer;
			},
			//下一题按钮
			next: function() {
				var that = this;
				var submitAnswer = that.submitAnswer;
				if (that.index < that.questionList.length - 1) {
					that.index++;
				} else {
					console.log("答题结束")
					var time = that.endTime;
					submitAnswer['q_times'].forEach(item => {
						time = parseInt(time) + parseInt(item);
					})
					that.endTime = time;
					submitAnswer.times = time; //耗时
					//console.log(that.submitAnswer);
					that.submitPaper();
				}

			},
			autoFinish:function(){
				var that = this;
				that.submitAnswer.times = that.submitAnswer.totaltimes; //耗时
				//console.log(that.submitAnswer);
				that.submitPaper();
			},
			//填空题作答
			finishInput: function(res) {
				console.log(res)
				var that = this;
				var item = {
					"item_content": "",
					"item_value": res,
					"item_file": "",
					"checked": true
				}
				var result = [];
				result.push(item);
				that.questionList[that.index].items = result;
				that.questionList = that.questionList;
			},
			//提交试卷
			submitPaper: function() {
				var that = this;
				var submitAnswer = that.submitAnswer;
				var baseUrl = that.$constants.EXAM_SUBMITPAPER;
				if (!that.$utils.isEmpty(submitAnswer['paper_id'])) {
					baseUrl = baseUrl + "?paper_id=" + submitAnswer['paper_id'];
				} else {
					return;
				}
				if (!that.$utils.isEmpty(submitAnswer['record_id'])) {
					baseUrl = baseUrl + "&record_id=" + submitAnswer['record_id'];
				}
				if (!that.$utils.isEmpty(submitAnswer['times'])) {
					baseUrl = baseUrl + "&times=" + submitAnswer['times'];
				} else {
					return;
				}
				if (!that.$utils.isEmpty(submitAnswer['totalnum'])) {
					baseUrl = baseUrl + "&totalnum=" + submitAnswer['totalnum'];
				} else {
					return;
				}
				if (!that.$utils.isEmpty(submitAnswer['rightnum'])) {
					baseUrl = baseUrl + "&rightnum=" + submitAnswer['rightnum'];
				} else {
					baseUrl = baseUrl + "&rightnum=0";
				}
				if (!that.$utils.isEmpty(submitAnswer['totaltimes'])) {
					baseUrl = baseUrl + "&totaltimes=" + submitAnswer['totaltimes'];
				}
				if (!that.$utils.isEmpty(submitAnswer['finish'])) {
					baseUrl = baseUrl + "&finish=" + submitAnswer['finish'];
				}
				if (!that.$utils.isEmpty(submitAnswer['donum'])) {
					baseUrl = baseUrl + "&donum=" + submitAnswer['donum'];
				} else {
					baseUrl = baseUrl + "&donum=0";
				}
				if (!that.$utils.isEmpty(submitAnswer['q_id'])) {
					submitAnswer['q_id'].forEach((item,index) => {
							baseUrl = baseUrl + "&q_id[]=" + item;
							baseUrl = baseUrl + "&q_type[]=" + submitAnswer['q_type'][index];
							if(submitAnswer['doit'][index]==1){
								baseUrl = baseUrl + "&q_answer[]=" + encodeURIComponent(submitAnswer['q_answer'][index]);
								baseUrl = baseUrl + "&q_times[]=" + submitAnswer['q_times'][index];
								baseUrl = baseUrl + "&q_isright[]=" + submitAnswer['q_isright'][index];
								
							}else{
								baseUrl = baseUrl + "&q_answer[]=";
								baseUrl = baseUrl + "&q_times[]=0";
								baseUrl = baseUrl + "&q_isright[]=0";
							}
					})
				}

				console.log(baseUrl)
				this.$refs.led.stopTimerMode3();
				that.$request
					.post({
						url: baseUrl,
						loadingTip: '提交成绩中...',
						needLogin:true
					})
					.then(
						res => { //success
							//提交答案成功，跳转到答题成功页面
							var result = encodeURIComponent(JSON.stringify(res.examRecodResult));
							uni.redirectTo({
								url: '/pages/answer/answerResult?result=' + result + '&paper_type=' + that.paper_type +
									"&paper_name=" + that.paper_name
							})
						},
						res => { //fail
							//提交答案失败，回到上一页（进行延迟1s），并提示错误原因，
							that.$api.msg(res.ret_msg)
							setTimeout(() => {
								uni.navigateBack({
									delta: 1,
								})
							}, 1000)
						}
					);
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
	}
.timecontent{
	width:200upx;
	text-align: center;
}
	.shanshui {
		width: 750upx;
		height: 220upx;
		position: absolute;
		top: 0;
		left: 0;
	}

	.item {
		display: flex;
		flex-direction: column;
		width: 90vw;
		margin-top: 16upx;
		background: $uni-bg-color;
		box-shadow: 10upx 10upx 10upx #f1f1f1;
		z-index: 10;
	}

	.item2 {
		display: flex;
		flex-direction: column;
		width: 90vw;
		margin-top: 60upx;
		background: $uni-bg-color;
		box-shadow: 10upx 10upx 10upx #f1f1f1;
		z-index: 10;
	}

	.weekTitle {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 88vw;
		padding: 5upx;
		margin-bottom: 10upx;
		padding-left: 10upx;
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
			font-size: $uni-font-size-base;
		}
	}

	.details {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding: 20upx 0 20upx 0;
.explain{
				font-size: $uni-font-size-base;
				padding: 2px 12px;
				color: #555555;
			}
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

		.sure {
			margin-top: 20upx;
			background: #99cc33;
			color: #FFFFFF;
			font-size: $uni-font-size-lg;
			padding: 10upx 20upx 10upx 20upx;
			border-radius: $uni-border-radius-base;
			box-shadow: 0 0 10upx $uni-bg-color-box-shadow;
		}
	}

	.switch {
		zoom: 0.7;
		margin: 10upx;
	}
</style>
