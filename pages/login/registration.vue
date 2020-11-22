<template>
	<view class="content">
<view class="head">
				<image class="logo" src="../../static/logo.png"></image>
				<view class="version"><text>IT学和练</text></view>
			</view>
			<form v-if="step==0" @submit="nextStep">
			<view class="login-card">
				<view class="login-title">
					<text >注册</text>
				</view>
				<view class="uni-form-item uni-column">
					<image src="../../static/login/shouji.png" mode=""></image>
					<input :value="mobile" @input="changeMobile" type="tel" class="uni-input" name="mobile" placeholder="请输入手机号" />
				</view>
				<view class="uni-form-item uni-column">
					<image src="../../static/login/mima.png" mode=""></image>
					<input :value="password" type="password" class="uni-input" name="password" placeholder="请输入密码" />
				</view>
				<view class="uni-form-item uni-column">
					<image src="../../static/login/mima.png" mode=""></image>
					<input :value="repassword" type="password" class="uni-input" name="repassword" placeholder="重复密码" />
				</view>
				<view class="uni-form-item uni-column column-with-btn">
					<input :value="mobile_code" type="number" class="uni-input" name="mobile_code" placeholder="请输入验证码" />
					<button :class="{active : !disableCodeBtn}" :disabled="disableCodeBtn" @tap="sendCode">{{codeBtn.text}}</button>
				</view>
				<button type="primary" formType="submit" v-if="step==0">下一步</button>
			</view>
			
		</form>

		<form v-if="step==1" @submit="sumbitRegister">
			<view class="login-card">
				<view class="login-title">
					<text >注册</text>
				</view>
				<view class="uni-form-item uni-column">
					<input :value="true_name" type="text" class="uni-input" name="true_name" placeholder="请输入真实姓名" />
				</view>
				<view class="uni-form-item uni-column">
					<input :value="idcode" type="idcard" class="uni-input" name="idcode" placeholder="请输入身份证号码" />
				</view>
				<view class="uni-form-item uni-column column-with-btn">
					<text class="uni-input">性别</text>
					<radio-group name="sex" class="sex">
						<label>
							<radio value="0" />男</label>
						<label>
							<radio value="1" />女</label>
					</radio-group>
				</view>
			</view>
			<view class="submit-view">
				<button type="default" @click="lastStep" v-if="step==1">上一步</button>
			</view>
			<view class="submit-view-1">
				<button type="warn" formType="submit" v-if="step==1">注册</button>
			</view>
			
		</form>



		<view class="links">已有账号？<view class="link-highlight" @tap="gotoLogin">点此登陆</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				step: 0,
				seconds: 60,
				codeBtn: {
					text: '获取验证码',
					waitingCode: false,
					count: this.seconds
				},
				mobile: '',
				password: '',
				repassword: '',
				mobile_code: '',
				true_name: '',
				idcode: '',
				sex: '',
			}
		},
		onLoad() {

		},
		methods: {
			sendCode: function() {
				var that = this;
				if (that.$utils.isEmpty(that.mobile)) {
					that.$api.msg("请输入手机号!");
					return;
				}
				that.codeBtn.waitingCode = true;
				that.codeBtn.count = that.seconds;
				that.codeBtn.text = that.codeBtn.count + 's';

				let countdown = setInterval(() => {
					that.codeBtn.count--;
					that.codeBtn.text = that.codeBtn.count + 's';
					if (that.codeBtn.count < 0) {
						clearInterval(countdown);
						that.codeBtn.text = '重新发送';
						that.codeBtn.waitingCode = false;
					}
				}, 1000);
				that.$request
					.get({
						url: that.$constants.SEND_BIND_MOBILE_CODE + "?mobile=" + that.mobile,
						loadingTip: '加载中...'
					})
					.then(
						res => {
							console.log(res);
						},
						res => {
							that.$api.msg(res.ret_msg)
						}
					);
			},
			gotoLogin: function() {
				uni.navigateTo({
					url: 'login'
				})
			},
			changeMobile: function(event) {
				var that = this;
				that.mobile = event.detail.value;
			},
			//上一步
			lastStep: function() {
				var that = this;
				that.step = 0;
			},
			//下一步
			nextStep: function(res) {
				var that = this;
				var mobile = res.detail.value.mobile;
				var password = res.detail.value.password;
				var repassword = res.detail.value.repassword;
				var mobile_code = res.detail.value.mobile_code;
				if (that.$utils.isEmpty(mobile)) {
					that.$api.msg("请输入手机号!")
					return;
				}
				if (that.$utils.isEmpty(password)) {
					that.$api.msg("请输入密码!")
					return;
				}
				if (that.$utils.isEmpty(repassword)) {
					that.$api.msg("请重复密码!")
					return;
				}
				if (that.$utils.isEmpty(mobile_code)) {
					that.$api.msg("请输入验证码!")
					return;
				}
				if (password != repassword) {
					that.$api.msg("两次密码不一致!")
					return;
				}
				that.mobile = mobile;
				that.password = password;
				that.repassword = repassword;
				that.mobile_code = mobile_code;
				that.step = 1;
			},
			//注册
			sumbitRegister: function(res) {
				var that = this;
				var idcode = res.detail.value.idcode;
				var sex = res.detail.value.sex;
				var true_name = res.detail.value.true_name;
				if (that.$utils.isEmpty(true_name)) {
					that.$api.msg("请输入真实姓名!")
					return;
				}
				if (that.$utils.isEmpty(idcode)) {
					that.$api.msg("请输入身份证号码!")
					return;
				}
				if (that.$utils.isEmpty(sex)) {
					that.$api.msg("请选择性别!")
					return;
				}
				that.idcode = idcode;
				that.true_name = true_name;
				that.sex = sex;
				that.$request
					.get({
						url: that.$constants.REGISTER +
							"?mobile=" + that.mobile +
							"&password=" + that.password +
							"&repassword=" + that.repassword +
							"&mobile_code=" + that.mobile_code +
							"&sex=" + that.sex +
							"&true_name=" + that.true_name +
							"&idcode=" + that.idcode,
						loadingTip: '加载中...'
					})
					.then(
						res => {
							that.$api.msg("注册成功!");
							uni.reLaunch({
								url: '/pages/login/login'
							})
						},
						res => {
							that.$api.msg(res.ret_msg)
						}
					);
			}
		},
		computed: {
			disableCodeBtn: function() {
				return this.codeBtn.waitingCode;
			}
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
	.logo_top {
			height: 300upx;
			width: 100%;
		
	}

	.uni-form-item {
		display: flex;
		margin-bottom: 60upx;
		padding-bottom: 26upx;
		border-bottom: 2px solid #e5e4e4;
	
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

	.column-with-btn {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		button {
			font-size: 24upx;
			margin: 0;
			width: 180upx;
			text-align: center;

			&:after {
				border: none
			}

			&.active {
				background-color: $color-primary;
				color: $uni-text-color-inverse;
			}
		}
	}

	.img-captcha {
		width: 150upx;
		height: 60upx;
	}

	.links {
		text-align: center;
		margin-top: 38upx;
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

	.sex {
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin-left: 20upx;
		font-size: 30upx;

		radio {
			zoom: 0.6;
			margin-left: 60upx;
			padding: 7px 0;
		}
	}
	
	.login-card{
		width: 600upx;
		padding: 20px;
		align-items: center;
		background: #FFFFFF;
		border-radius: 12upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		margin: 0 auto;
	}
	
	.login-title {
		padding-bottom: 48upx;
		font-size: 48upx;
		font-weight: bold;
		color: #3e4a59;
		letter-spacing: 10upx;
	}
	
	.submit-view {
		padding-left: 100upx;
		padding-right: 100upx;
		width: 100%;
		margin-top: -130upx;
	}
	
	.submit-view-1 {
		padding-left: 100upx;
		padding-right: 100upx;
		width: 100%;
		margin-top: 30upx;
	}
</style>
