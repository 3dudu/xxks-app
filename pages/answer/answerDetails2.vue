<template>
	<view class="content" @blur="stopTimer">

		<image src="../../static/shanshui.png" class="shanshui"></image>
		<view class="timecontent" v-if="examStart"><led ref="led" :mode="submitAnswer.totaltimes>0?5:3" :total="submitAnswer.totaltimes" @timeup="autoFinish"></led></view>

		<!--状态一：用户未确认答案-->
		<view class="contentRow" v-if="questionList[index].userChose==null">
			<view class="first">
				<view :class="{timer:true,timer_2:cTime<=20 && cTime>10,timer_3:cTime<=10&&cTime>5,timer_4:cTime<=5}">{{cTime}}</view>
			</view>
			<view class="details">
				<view class="title">{{index+1}}.{{questionList[index].question}}</view>
				<image :src="questionList[index].thumb" mode="aspectFit" v-if="questionList[index].showTitle"></image>
				<view class="option" v-if="questionList[index].type!='4'" v-for="(sitem, sindex) in questionList[index].items" :key="sindex"
				 @click="choseOption(sitem, sindex)" :style="[{background:sitem.checked?'#99cc33':''}]">
					<view :style="[{color:sitem.checked?'#ffffff':''}]">
						<switch color="#99cc33" v-if="questionList[index].type=='3'" class="switch" :checked="sitem.checked" type="checkbox" />{{sitem.item_value}}.{{sitem.item_content}}
					</view>
				</view>
				<view v-if="questionList[index].type=='4'">
					<wInput :maxlength="questionList[index].inputNum" @finishInput="finishInput"></wInput>
				</view>
				<!-- <view class="sure" @click="sure">确认</view> -->
			</view>
		</view>
		<!--状态二：用户确认答案，答案正确-->
		<view class="contentRow" v-else-if="questionList[index].userChose == questionList[index].answer">
			<view class="first">
				<image src="../../static/answer/dui.png"></image>
			</view>
			<view class="details">
				<view class="title">{{index+1}}.{{questionList[index].question}}</view>
				<image :src="questionList[index].thumb" mode="aspectFit" v-if="questionList[index].showTitle"></image>
				<view :style="[{background:sitem.checked?'#99cc33':''}]" class="option" v-if="questionList[index].type!='4'" v-for="(sitem, sindex) in questionList[index].items"
				 :key="sindex">
					<view :style="[{color:sitem.checked?'#ffffff':''}]">
						<switch color="#99cc33" v-if="questionList[index].type=='3'" class="switch" :checked="sitem.checked" type="checkbox" />{{sitem.item_value}}.{{sitem.item_content}}
					</view>
					<!-- 	<image v-if="sitem.checked" src="../../static/true.png"></image> -->
				</view>
				<!-- <view class="sure" @click="next(true)">下一题</view> -->
			</view>
		</view>
		<!--状态三：用户确认答案，答案错误-->
		<view class="contentRow" v-else-if="questionList[index].userChose != questionList[index].answer">
			<view class="first">
				<image src="../../static/answer/cuo.png"></image>
			</view>
			<view class="details">
				<view class="title">{{index+1}}.{{questionList[index].question}}</view>
				<image :src="questionList[index].thumb" mode="aspectFit" v-if="questionList[index].showTitle"></image>
				<view :style="[{background:sitem.checked?'#ff3d5d':''}]" class="option" v-if="questionList[index].type!='4'" v-for="(sitem, sindex) in questionList[index].items"
				 :key="sindex">
					<view :style="[{color:sitem.checked?'#ffffff':''}]">
						<switch color="#99cc33" v-if="questionList[index].type=='3'" class="switch" :checked="sitem.checked" type="checkbox" />{{sitem.item_value}}.{{sitem.item_content}}
					</view>
					<!-- <image v-if="sitem.checked" src="../../static/fail.png"></image> -->
				</view>
				<!-- <view class="sure" @click="next(false)">提交</view> -->
			</view>
		</view>

	</view>
</template>

<script>
	var setInter = null;
	import wInput from '@/components/wakary-input/wakary-input.vue'
	import led from '@/components/mehaotian-numled/mehaotian-numled.vue';

	var page = 1; // 当前答题题目组数，第一组
	var row = 0; //当前组未作答题数
	export default {
		components: {
			wInput,
			led
		},
		data() {
			return {
				index: 0,
				mode: '', //考试模式
				questionList: [{'userChose':null}], //考试题目列表
				paper_type: '',
				paper_name: '',
				paper_code: '',
				cTime: 0,
				answerTimer: 0, //题目时长
				//提交答题参数
				submitAnswer: {
					"doit":[],
					"paper_id": '', //试卷id                         T
					"record_id": '', //考试记录id，继续考试时需要      F
					"times": '', //耗时                               T
					"totalnum": 0, //总题数                          T
					"rightnum": 0, //正确数                          T
					"totaltimes": '', //总时间，限时考试需要           F
					"finish": 1, //限时考试时传                      F
					"donum": '', //已答题数                           T
					"q_id": [], //	题目id                       T
					"q_answer": [], //题目答案                       T
					"q_times": [], //题目耗时                        T
					"q_isright": [], //是否正确                      T
					"q_type": [], //题型                             T
				},
				centerTime: 0, //一道题目消耗时长
				endTime: 0, //考试结束时间
				paus:false,
				examStart:false
			};
		},
		onUnload(){
			console.log('setInter Hide')
			this.$refs.led.stop(); //停止倒计时
			
			clearInterval(setInter); //停止倒计时
			setInter = null;
		},
		onBackPress(){
			console.log('setInter Hide')
			this.$refs.led.stop(); //停止倒计时
			
			clearInterval(setInter); //停止倒计时
			setInter = null;
			
		},
		onHide(){
			console.log('setInter Hide')
			
			clearInterval(setInter); //停止倒计时
			setInter = null;
			this.paus = true;
		},
		onShow(){
			if(this.paus){
				this.startSetInter();
				this.paus = false;
			}
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
			if (options.hasOwnProperty('cTime')) {
				that.cTime = options.cTime;
				that.answerTimer = options.cTime;
			}
			that.loadData();
		},
		methods: {
			stopTimer:function() {
				console.log('stopTimer Hide')
				clearInterval(setInter); //停止倒计时
				setInter = null;
			},
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

							if (page == 1) { //第一次条用此接口是，填充下面数据，ps.固定无变化
								if (res.paperType.hasOwnProperty('paper')) {
									submitAnswer.paper_id = res.paperType.paper.id; //试卷id
								}
								
								if (res.paperType.hasOwnProperty('times')) {
									submitAnswer.totaltimes = res.paperType.times * 60; //总时间，限时考试需要
								}
								if (res.paperType.hasOwnProperty('mode')) {
									that.mode = res.paperType.mode; //考试模式
								}
								var questionList = [];
							} else {
								var questionList = that.questionList;
							}


							if (res.paperType.hasOwnProperty('questionList')) {

								row = res.paperType.questionList.length; //当前组未作答题数


								for (var i = 0; i < res.paperType.questionList.length; i++) {
									submitAnswer['doit'].push(0);
									var item = res.paperType.questionList[i];
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
							submitAnswer.totalnum = that.questionList.length; //当前试卷总题数
							if (page > 1) { //获取下一组题目的时候，题目下标也得切换
								that.index++;
								that.cTime = that.answerTimer;
							}
							that.submitAnswer = submitAnswer;
							that.centerTime = new Date().getTime();
							that.examStart = true;
							that.startSetInter();
							uni.setStorageSync("max_rightnum", res.paperType.max_rightnum); //缓存最高答题记录
						},
						res => { //fail
							that.$api.msg(res.ret_msg)
						}
					);
			},
			//开始倒计时
			startSetInter: function() {
				var that = this;
				//将计时器赋值给setInter
				if(setInter==null){
					setInter = setInterval(
						function() {
							if (parseInt(that.cTime) > 0) {
								that.cTime = parseInt(that.cTime) - 1;
							} else {
								that.sure();
							}
						}, 1000);
				}
			},
			//选择答案
			choseOption: function(item, sindex) {
				var that = this;
				var questionList = that.questionList;
				switch (questionList[that.index].type) {
					case "1": //判断
						//break;
					case "2": //单选
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
				that.sure();
			},
			//确认答案
			sure: function() {
				var that = this;
				clearInterval(setInter); //停止倒计时
				var submitAnswer = that.submitAnswer;
				var questionList = that.questionList;
				var result = "";
				if (!that.$utils.isEmpty(questionList[that.index].items)) {
					questionList[that.index].items.forEach((sitem, sindex) => {
						if (sitem.checked) {
							//判断题 答案转换 A==1:正确  B==0:错误
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
				submitAnswer['doit'][that.index]=1;
				
				questionList[that.index].userChose = result;
				that.questionList = questionList;

				submitAnswer.donum++; //确认之后， 试卷已答题数增加

				//用户对题目的回答
				var q_answer = submitAnswer['q_answer'];
				q_answer.push(result);
				submitAnswer['q_answer'] = q_answer; //用户回答

				//用户回答是否正确  1：正确  0：错误
				var q_isright = submitAnswer['q_isright'];
				if (result == questionList[that.index].answer) { //答案正确，试卷正确数增加
					submitAnswer.rightnum++;
					q_isright.push("1");
				} else {
					q_isright.push("0");
				}
				submitAnswer['q_isright'] = q_isright;

				//当前题目的id
				var q_id = submitAnswer['q_id'];
				q_id.push(questionList[that.index].id);
				submitAnswer['q_id'] = q_id;
				
				//当前题目的类型
				var q_type = submitAnswer['q_type'];
				q_type.push(questionList[that.index].type);
				submitAnswer['q_type'] = q_type;

				//挑战模式当前题目消耗时间
				var q_times = submitAnswer['q_times'];
				q_times.push(parseInt((new Date().getTime() - that.centerTime) / 1000));
				that.centerTime = new Date().getTime();
				submitAnswer['q_times'] = q_times;

				that.submitAnswer = submitAnswer;

				//挑战模式答题错误，直接提交答案
				if (result != questionList[that.index].answer) {
					//console.log("答题错误，答题结束")
					var time = that.endTime;
					submitAnswer['q_times'].forEach(item => {
						time = parseInt(time) + parseInt(item);
					})
					that.endTime = time;
					submitAnswer.times = time; //耗时
					that.next(false);
				} else { //挑战答题正确
					that.next(true);
				}
			},
			//下一题按钮
			next: function(result) {
				var that = this;
				var submitAnswer = that.submitAnswer;
				if (result) { //答题正确 提交 或者 下一题按钮事件
					/* if (that.index < that.questionList.length - 1) { //当前题数小于试卷总体数
						that.index++;
						that.cTime = that.answerTimer;
						that.startSetInter();
					} else {
						var time = that.endTime;
						submitAnswer['q_times'].forEach(item => {
							time = parseInt(time) + parseInt(item);
						})
						that.endTime = time;
						submitAnswer.times = time; //耗时
						that.submitPaper();
					} */
					row--; //当前组未作答题数 减 1
					if (row > 0) {
						that.index++; //切换下一题
						that.cTime = that.answerTimer;
						that.startSetInter();
					} else {
						page++;
						that.loadData();
					}
				} else { //答题错误，提交按钮事件
					this.$refs.led.stopTimerMode3();
					clearInterval(setInter); //停止倒计时
					this.$refs.led.stop(); //停止倒计时
					
					setInter = null;
					setTimeout(() => {
						that.submitPaper();
					}, 1000)
				}
			},
			autoFinish:function(){
				var that = this;
				this.$refs.led.stopTimerMode3();
				that.submitAnswer.times = that.submitAnswer.totaltimes; //耗时
				
				clearInterval(setInter); //停止倒计时
				setInter = null;
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
				that.sure();
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
				} else { //rightnum没有值，说明一道题目都没答对
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

				that.$request
					.post({
						url: baseUrl,
						loadingTip: '提交成绩中...',
						needLogin:true	
					})
					.then(
						res => { //success
							//提交答案成功，跳转到答题成功页面
							if(res){
								var result = encodeURIComponent(JSON.stringify(res.examRecodResult));
								uni.redirectTo({
									url: '/pages/answer/answerResult2?result=' + result + '&paper_type=' + that.paper_type +
										"&paper_name=" + that.paper_name +
										"&cTime=" + that.answerTimer
								})
							}
							
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
		justify-content: center;
		background-color: $uni-bg-color-grey;
		width: 100vw;
		overflow: hidden;
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

	.contentRow {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 90vw;
		margin-top: 16upx;
		margin-bottom: 3vw;
		max-height: 88vh;
		background: $uni-bg-color;
		box-shadow: 0 0 10upx $uni-bg-color-box-shadow;
		z-index: 10;
	}

	.first {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 90vw;
		margin: 20upx;
@keyframes blink{
  0%{opacity: 1;}
  100%{opacity: 0;} 
}
		.timer {
			display: flex;
			flex-direction: column;
			width: 66upx;
			height: 66upx;
			justify-content: center;
			align-items: center;
			font-size: 40upx;
			padding: 5upx;
			border-radius: 50%;
			border: 4upx solid #999999;
			background: $uni-bg-color;
			border-color:#39D754;
			color:#39D754;
		}
		.timer_2{
			border-color:#F48F00;
			color:#F48F00;
		}
		.timer_3{
			border-color:#FF3404;
			color:#FF3404;
		}
		.timer_4{
			border-color:#F5222D;
			color:#fff;
			animation: blink 1s linear infinite;  
			background-color: #FF3404;
		}
		image {
			width: 82upx;
			height: 82upx;
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
</style>
