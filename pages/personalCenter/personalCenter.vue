<template>
	<view class="container">
		<view class="headRow">
			<view class="logodiv">
			<!-- #ifdef APP-PLUS -->
			<image class="logo" :src="userinfo.head_ico" @click="choseLogo()"/>
			<!-- #endif -->
			<!-- #ifdef !APP-PLUS -->
			<image v-if="!hasLogin" class="logo" :src="userinfo.head_ico" @click="choseLogo()"/>
			<avatar v-if="hasLogin" selWidth="180upx" selHeight="180upx" @upload="myUpload" :avatarSrc="userinfo.head_ico" avatarStyle="height: 180upx;width: 180upx;border-radius: 180upx;margin: 20upx;z-index: 10;">
			<!-- #endif -->
			</avatar>
			</view>
			<view class="userInfo_1">
				<text class="name">{{userinfo.truename}}</text>
				<view class="ranking" @click="gotoPoint()" v-if="hasLogin">
					<text>我的积分</text>
					<text class="rankingDetails">{{userinfo.point}}</text>
				</view>
			</view>
			<image src="../../static/mine/top.png" class="backgroundImg" />
		</view>

		<view class="secondRow">
			<view class="item" @click="gotoBand()">
				<image src="../../static/personcenter/danweipaiming.png"></image>
				<text class="title">同岗位排名</text>
				<text class="num">{{userinfo.hycount}}</text>
			</view>
			<view class="item" @click="gotoBand()">
				<image src="../../static/personcenter/gerenpaiming.png"></image>
				<text class="title">同行业排名</text>
				<text class="num">{{userinfo.comcount}}</text>
			</view>
		</view>
		<view class="listRow">
		<list-cell class="list-cell list-cell-f" image="../../static/study/fenxiang.png" :isImg="true" title="资料收藏" @eventClick="navTo('/pages/tabStudy/favList')" />
		<list-cell v-if="hasLogin" class="list-cell" image="../../static/personcenter/shoujihaoma.png" :isImg="true" title="手机号码" :tips="userinfo.mobile" />
		<list-cell v-if="userinfo.companyName" class="list-cell" image="../../static/personcenter/qiye.png" :isImg="true" title="所在企业" :tips="userinfo.companyName" />
		<list-cell v-if="userinfo.hyName" class="list-cell" image="../../static/personcenter/gerenhangye.png" :isImg="true" title="所在行业" :tips="userinfo.hyName" />
		<list-cell class="list-cell list-cell-f" title="问题反馈" @eventClick="gotoFeed()" />
		<list-cell class="list-cell" title="关于" @eventClick="gotoAbout()" />
		<list-cell class="list-cell" title="隐私策略" @eventClick="gotoPrivacy()" />
		</view>
	<view class="login-card">

		<button :type="hasLogin?'warn':'primary'" formType="submit" @click="logouApp">{{hasLogin?"退出":"登录"}}</button>
</view>
	</view>
</template>

<script>
	import listCell from '@/components/list/mix-list-cell';
	import avatar from "../../components/yq-avatar/yq-avatar.vue";
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: mapState(['hasLogin']),
		components: {
			listCell,
			avatar
		},
		data() {
			return {
				userinfo: {
					"head_ico":"../../static/mine/table.png",
					"truename":"未登录"
				}
			};
		},
		onLoad() {
			var that = this;
			that.loadData('new');
		},
		onShow() {
			var that = this;
			that.loadData('');
		},
		methods: {
			gotoAbout:function(){
				uni.navigateTo({
					url: '/pages/about/about'
				})	
			},
			gotoPrivacy:function(){
				uni.navigateTo({
					url: '/pages/privacy/privacy'
				})	
			},
			gotoPoint:function(){
				uni.navigateTo({
					url: '/pages/tabMine/studyPoint'
				})	
			},
			gotoFeed:function(){
				uni.navigateTo({
					url: '/pages/feedback/feedback'
				})
			},
			gotoBand:function(){
				uni.navigateTo({
					url: '/pages/integral/integral'
				})
			},
			loadData: function(init) {
				var that = this;
				if(!this.hasLogin){
					this.userinfo = {
						"head_ico":"../../static/mine/table.png",
						"truename":"未登录"
					};
					return;
				}
				var baseUrl = that.$constants.UCENTER_USERINFO;
				let getObj = {
					url: baseUrl,
					loadingTip: '加载中...'
				};
				if(init!='new'){
					getObj = {
						url: baseUrl
					}; 
				}
				that.$request
					.get(getObj)
					.then(
						res => { //success
							var userinfo = {
								"head_ico":"../../static/mine/table.png",
								"truename":"未登录"
							};
							userinfo.allcount = res.userBand.allcount; //总排名
							userinfo.point = res.userBand.point; //用户积分
							userinfo.hycount = res.userBand.hycount; //行业排名
							userinfo.comcount = res.userBand.comcount; //企业排名
							if (that.$utils.isEmpty(res.member.logo)) {
								res.member.logo = "../../static/mine/table.png"
							} else {
								if (res.member.logo.indexOf('http') == -1) {
									res.member.logo = that.$constants.SUQIAN_IMG_URI+"pic/thumb/w/100/h/100?pic=" + res.member.logo;
								} else {
									res.member.logo = res.member.logo;
								}
							}
							userinfo.head_ico = res.member.logo;
							userinfo.truename = res.member.nickname;
							userinfo.mobile = res.member.mobile;
							userinfo.idcode = res.member.idcode;
							userinfo.gwName = "";
							/*for (var i = 0; i < res.member.gwName.length; i++) {
								userinfo.gwName = userinfo.gwName + res.member.gwName[i];
							} */
							
							if (!that.$utils.isEmpty(res.member.gwName) && res.member.gwName.length != 0) {
								userinfo.gwName = res.member.gwName[res.member.gwName.length - 1];
							}

							userinfo.hyName = "";
							for (var i = 0; !that.$utils.isEmpty(res.member.hyName) && i < res.member.hyName.length; i++) {
								userinfo.hyName = userinfo.hyName + " " + res.member.hyName[i];
							}
							
							if (res.hasOwnProperty("company")) {
								userinfo.companyName = res.company.name;
								userinfo.comfaren = res.company["com_faren"];
								if (res.company.is_accept != 1) {
									//审核未通过
									uni.showModal({
										content: '您的账号正在审核，请审核成功后开始学习',
										showCancel: false,
										confirmColor: '#3CC51F',
										success: function(res) {
											if (res.confirm) {
												console.log('用户点击确定');
											}
										}
									});
								}
							}
					
							that.userinfo = userinfo;

						},
						res => { //fail
							that.userinfo = {
								"head_ico":"../../static/mine/table.png",
								"truename":"未登录"
							};
							that.$api.msg(res.ret_msg)
						}
					);

			},
			navTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			choseLogo(){
				if(!this.hasLogin){
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				var that = this;
				uni.chooseImage({
				    success: (chooseImageRes) => {
				        chooseImageRes.path = chooseImageRes.tempFilePaths[0];
						that.myUpload(chooseImageRes);
					}
				})
			},
			//上传头像
			myUpload: function(rsp) {
				var that = this;
				that.$request
					.upload({
						url: that.$constants.UCENTER_CHANGELOGO,
						filePath: rsp.path, //选择的图片路径
						loadingTip:'上传中...',
						name: 'logo',
						business: null,
						skipInterceptorResponse: true,
						progress: (res2, task) => {
							let p = '上传进度: ' + res2.totalBytesSent + '/' + res2.totalBytesExpectedToSend + ' (' + res2.progress + '%)';
						}
					})
					.then(res2 => {
						that.userinfo.head_ico = that.$constants.SUQIAN_IMG_URI +"pic/thumb/w/100/h/100?pic="+ res2.ret_data.changeLogo.head_ico;
						var data = uni.getStorageSync('userinfo');
						data.userinfo.head_ico = that.$constants.SUQIAN_IMG_URI +"pic/thumb/w/100/h/100?pic="+ res2.ret_data.changeLogo.head_ico;
						uni.setStorage({
							key: 'userinfo',
							data: data
						})
					})
					.catch(res2 => {
						console.log(res2);
					});

			},
			//退出登录
			logouApp: function() {
				var that = this;
				let l = this.hasLogin;
				if(l){
					uni.showModal({
						title:'提示',
						content: '确定要退出登录?',
						success: function (res) {
							if (res.confirm) {
								that.logout();
								that.userinfo = {
									"head_ico":"../../static/mine/table.png",
									"truename":"未登陆"
								};
								uni.reLaunch({
									url: '/pages/tabHome/tabHome'
								})
							} else if (res.cancel) {
								
							}
					}});
				}else{
					that.logout();
					that.userinfo = {
						"head_ico":"../../static/mine/table.png",
						"truename":"未登陆"
					};
					uni.navigateTo({
						url:'/pages/login/login'
					})
				}
			},
			...mapMutations(['logout'])
		}
	}
</script>

<style lang="scss">
	page,
	.container {
		display: flex;
		flex-direction: column;
		background-color: $uni-bg-color-grey;
		width: 100%;
		align-items: center;
		overflow-x: hidden;
	}
	.login-card {
		width: 600upx;
		padding: 20px;
		align-items: center;
		//background: #FFFFFF;
	//	border-radius: 12upx;
		//box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		margin: 0 auto;
	}
	.headRow {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		height: 370upx;
		background-color: $uni-color-title;
		margin-bottom: 20upx;

		.backgroundImg {
			position: absolute;
			width: 100vw;
			height: 370upx;
		}
		.logodiv{
			z-index: 10;
			height: 180upx;
			width: 180upx;
			border-radius: 180upx;
			margin: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.logo {
				position: absolute;
				height: 180upx;
				width: 180upx;
				border-radius: 180upx;
				z-index: 10;
			}
		}
		.userInfo_1 {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 100upx;
			width: 100%;
			margin-left: 60upx;
			margin-right: 60upx;
			color: $uni-bg-color;
			z-index: 10;

			.name {
				font-size: 30upx;
				letter-spacing: 8upx;
			}
			.ranking {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 20upx;
				font-size: 24upx;
				letter-spacing: 4upx;

				.rankingDetails {
					font-size: 32upx;
					padding: 3upx 30upx 3upx 30upx;
					background: #e74844;
					border-radius: 30upx;
					margin-left: 20upx;
				}
			}
		}

		.fraction {
			font-size: 34upx;
			letter-spacing: 4upx;
			color: $uni-bg-color;
			text-align: center;
		}
	}

	.secondRow {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;

		.item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 330upx;
			background: $uni-bg-color;
			border-radius: $uni-border-radius-base;
			padding: 22upx 0 22upx 0;
			margin: 0 10upx;

			image {
				width: 40upx;
				height: 40upx;
			}

			.title {
				font-size: 28upx;
				margin-top: 5upx;
			}

			.num {
				font-size: 34upx;
			}
		}
	}
	.listRow{
		width: 680upx;
		display: flex;
		flex-direction: column;
	}
		.list-cell {
			border-radius: $uni-border-radius-base;
		}
		.list-cell-f{
			margin-top: 20upx;
		}

	.logout {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 20upx;
		margin-bottom: 20upx;
		height: 84upx;
		width: 480upx;
		border-radius: 40upx;
		font-size: 30upx;
		background: #2d86fd;
		color: #FFFFFF;
		letter-spacing: 2upx;
	}
</style>
