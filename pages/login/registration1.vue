<template>
	<view class="content">
		<!--第一步输入手机号-->
		<view v-if="step==0">
		
<view class="head">
				<image class="logo" src="../../static/logo.png"></image>
				<view class="version"><text>IT学和练</text></view>
			</view>			
			<view class="login-card">
				<view class="login-title">
					<text>新用户注册</text>
				</view>
				<view class="login-phone">请输入用户手机号</view>
				<view class="uni-form-item-1 phone-itme">
					<text class="area">+86</text>
					<input :value="mobile" @input="changeMobile" type="number" class="uni-input" name="mobile" placeholder="请输入手机号" />
					<image src="../../static/login/phone_del.png" @click="deleteMobile" class="image-del" mode=""></image>
				</view>
				<button type="primary" @click="nextStep" v-if="step==0">下一步</button>
			</view>
			<view class="links2">已有账号？<view class="link-highlight" @tap="gotoLogin">点此登陆</view>
			</view>
		</view>
		<!--第二步输入验证码-->
		<view v-if="step==1" class="content2">
			<view class="titlebar">
				<image src="../../static/integral/titlebar.png" class="titlebackground"></image>
				<image src="../../static/integral/lefticon.png" class="lefticon" @click="back"></image>
				<view class="head_title">请输入验证码</view>
			</view>

			<view class="codeView">
				<view class="title">
					验证码已经发送至手机:
				</view>
				<view class="phone">
					+86 {{mobile}}
				</view>
				<wInput :maxlength="4" @mobileCode="finishInput"></wInput>
			</view>

			<view class="againCode">
				<text>没有接收到验证码?</text>
				<text style="color: #007AFF;" @click="getMobileCode">重新发送</text>
			</view>
		</view>
		<!--第三步输入密码，选择性别等-->
		<view v-if="step==2" class="content2">
		
			<image class="logo_top" src="../../static/shanshui.png" mode=""></image>
		
			<form @submit="sumbitRegister">
				<view class="login-card">
					<view class="login-title">
						<text>注册</text>
					</view>
					<view class="infoView">
						<input :value="true_name" type="text" class="uni-input" name="true_name" placeholder="请输入真实姓名" />
					</view>
					<view class="infoView">
						<input :value="password" type="password" class="uni-input" name="password" placeholder="请输入密码" />
					</view>
					<view class="infoView">
						<text class="uni-input-sex">性别</text>
						<radio-group name="sex" class="sex">
							<label>
								<radio value="1" />男</label>
							<label>
								<radio value="0" />女</label>
						</radio-group>
					</view>
						<button class="canclelogin" type="default" @click="back">上一步</button>
						<button class="canclelogin" type="warn" formType="submit">注册</button>
				</view>
				
				<view class="links">已有账号？<view class="link-highlight" @tap="gotoLogin">点此登陆</view>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import wInput from '@/components/wakary-input/wakary-input2.vue'
	import {
		mapMutations
	} from 'vuex';
	export default {
		components: {
			wInput
		},
		data() {
			return {
				step: 0,
				mobile: '', //手机号码
				mobile_code: '', //手机验证码
				true_name: '',
				sex: '',
				password: '',
			}
		},
		onLoad() {

		},
		methods: {
			//去登录
			gotoLogin: function() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			//输入手机号
			changeMobile: function(event) {
				var that = this;
				that.mobile = event.detail.value;
			},
			//删除手机号
			deleteMobile: function() {
				var that = this;
				that.mobile = "";
			},
			//下一步
			nextStep: function() {
				var that = this;
				if (that.$utils.isEmpty(that.mobile)) {
					that.$api.msg("请输入手机号!");
					return;
				}
				that.getMobileCode();
			},
			//返回
			back: function() {
				var that = this;
				that.step--;
			},
			//输入验证码
			finishInput: function(res) {
				var that = this;
				that.mobile_code = res;
				that.step++;
			},
			//获得手机验证码
			getMobileCode: function() {
				var that = this;
				that.$request
					.get({
						url: that.$constants.SEND_BIND_MOBILE_CODE + "?mobile=" + that.mobile,
						loadingTip: '加载中...'
					})
					.then(
						res => {
							if(res.ret_code==0){
								that.step++;
							}
						},
						res => {
							that.$api.msg(res.ret_msg.desc);
							if(res.ret_code==900006){
								that.step++;
							}
						}
					);
			},
			//注册
			sumbitRegister: function(res) {
				var that = this;
				console.log(res)
				var sex = res.detail.value.sex;
				var true_name = res.detail.value.true_name;
				var password = res.detail.value.password;
				if (that.$utils.isEmpty(true_name)) {
					that.$api.msg("请输入真实姓名!")
					return;
				}
				if (that.$utils.isEmpty(sex)) {
					that.$api.msg("请选择性别!")
					return;
				}
				if (that.$utils.isEmpty(password)) {
					that.$api.msg("请输入密码!")
					return;
				}
				var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/;
				if (!reg.test(password)) {
					that.$api.msg("密码至少8位，要有字母和数字!")
					return;
				}
				that.true_name = true_name;
				that.sex = sex;
				that.password = password;
				that.$request
					.get({
						url: that.$constants.REGISTER +
							"?mobile=" + that.mobile +
							"&password=" + that.password +
							"&repassword=" + that.password +
							"&mobile_code=" + that.mobile_code +
							"&sex=" + that.sex +
							"&true_name=" + that.true_name,
						loadingTip: '注册中...'
					})
					.then(
						res => {
							that.$api.msg("注册成功!");
							that.RegisterLogin();
						},
						res => {
							//that.$api.msg(res.ret_msg.desc)
							that.$api.msg("网络异常，稍后再试！");
						}
					);
			},
			//注册完登录
			RegisterLogin: function() {
				var that = this;
				that.$request
					.get({
						url: that.$constants.LOGIN + "?login_info=" + that.mobile + "&password=" + that.password,
						loadingTip: '加载中...'
					})
					.then(
						res => {
							that.login(res);
							if (this.$store.state.userinfo.user_company == null) {
								uni.navigateTo({
									url: '/pages/login/apply1'
								})
							}
							/* else if (this.$store.state.userinfo.user_company.is_accept == 0) {
								uni.navigateTo({
									url: '/pages/personalCenter/personalCenter'
								})
							} else if (this.$store.state.userinfo.user_company.is_accept == 1) {
								uni.switchTab({
									url: '/pages/tabStudy/tabStudy'
								})
							} */
						},
						res => {
							//that.$api.msg(res.ret_msg)
							that.$api.msg("网络异常，稍后再试！")
						}
					);
			},
			...mapMutations(['login'])
		}
	}
</script>

<style lang="scss" scoped>
	$color-primary: #ff3d5d;

	.content {
		background-color: #FFFFFF;
	}
.head{
	width: 100%;
    margin-bottom: 40upx;
}
.logo{
	height: 100px;
    width: 100px;
	border-radius: 10px;
    margin: 0 auto;
    margin-top: 80upx;
    display: block;
}
.version{
	text-align: center;
	color: #999;
	font-size: 16px;
	line-height: 26px;
}
	.content2 {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.logo_top {
			height: 300upx;
			width: 100%;
		
	}

	.uni-form-item {
		display: flex;
		margin-bottom: 60upx;
		padding-bottom: 26upx;

		.uni-input {
			font-size: 30upx;
			margin-left: 30upx;
			color: #3e4a59;
			placeholder-color: #e5e4e4;
		}

		image {
			height: 50upx;
			width: 50upx;
		}
	}

	.uni-form-item-1 {
		display: flex;
		margin-bottom: 40upx;
		margin-left: 50upx;
		margin-right: 50upx;

		.uni-input {
			font-size: 30upx;
			height: 100%;
			padding-left: 20upx;
			color: #3e4a59;
			placeholder-color: #e5e4e4;
			margin-left: 10upx;
			width: 70%;
			border-left: 2px solid #e5e4e4;
		}

	}

	.image-select {
		height: 15upx;
		width: 15upx;
		margin-left: 10upx;
		margin-right: 10upx;
	}

	.image-del {
		height: 30upx;
		width: 30upx;
		margin-left: 10upx;
		margin-right: 10upx;
	}

	.phone-itme {
		border: 3upx solid #e5e4e4;
		border-radius: $uni-border-radius-lg;
		height: 92upx;
		align-items: center;

		.area {
			font-size: 30upx;
			margin-left: 10upx;
			margin-right: 10upx;
		}
	}


	.login-card {
		width: 600upx;
		padding: 20px;
		align-items: center;
		background: #FFFFFF;
		border-radius: 12upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		margin: 0 auto;
	}

	.login-title {
		display: flex;
		flex-direction: row;
		width: 100%;
		border-bottom: 4upx solid #efeff4;

		text {
			font-size: 45upx;
			font-weight: bold;
			color: #3e4a59;
			letter-spacing: 2upx;
			margin: 56upx 30upx 42upx 30upx;
		}

	}

	.item-label {
		font-size: 20upx;
		margin-left: 54upx;
	}

	.login-phone {
		font-size: 35upx;
		margin-top: 70upx;
		margin-bottom: 70upx;
		padding-left: 50upx;
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
			margin-right: 56px;
			font-size: 16px;
			line-height: 30px;
			text-align: center;
			width: 263upx;
			color: #FFFFFF;
		}
	}

	.codeView {
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		margin: 35upx;
		height: 500upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		border-radius: $uni-border-radius-base;

		.title {
			margin-top: 60upx;
			margin-left: 40upx;
			font-size: $uni-font-size-lg+2;
		}

		.phone {
			margin-top: 40upx;
			margin-left: 40upx;
			margin-bottom: 20upx;
			font-size: $uni-font-size-lg;
		}
	}

	.againCode {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: $uni-font-size-lg;
		margin-top: 60upx;
	}

	.infoView {
		display: flex;
		flex-direction: row;
		width: 94%;
		padding-top: 20upx;
		padding-bottom: 20upx;
		border-bottom: 4upx solid #efeff4;

		.uni-input {
			font-size: 30upx;
			margin-left: 30upx;
			color: #3e4a59;
			width: 100%;
			placeholder-color: #e5e4e4;
		}

		.uni-input-sex {
			font-size: 30upx;
			margin-left: 30upx;
			color: #3e4a59;
			placeholder-color: #e5e4e4;
		}

		.sex {
			display: flex;
			flex: 1;
			flex-direction: row;
			height: 30upx;
			align-items: center;
			justify-content: flex-start;
			margin-left: 20upx;
			font-size: 30upx;

			radio {
				zoom: 0.6;
				margin-left: 40upx;
				margin-right: 10upx;
			}
		}
	}
	.canclelogin {
		margin-top: 5px;
	}

	.links {
		position: absolute;
		width: 750upx;
		text-align: center;
		top: 1150upx;
		bottom: 40upx;
		font-size: 30upx;
		color: #242424;

		view {
			display: inline-block;
			vertical-align: top;
			margin: 0 10upx;
		}

		.link-highlight {
			color: $color-primary
		}
	}

	.links2 {
    text-align: center;
    font-size: 16px;
    padding-top: 30px;
    color: #242424;

		view {
			display: inline-block;
			vertical-align: top;
			margin: 0 10upx;
		}

		.link-highlight {
			color: $color-primary
		}
	}
</style>
