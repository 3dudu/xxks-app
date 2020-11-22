<template>
	<view class="content">
			<view class="head">
				<image class="logo" src="../../static/logo.png"></image>
				<view class="version"><text>IT学和练</text></view>
			</view>
			<view v-if="!changeSuccess">
				<view class="login-card">
					<view class="login-title">
						<text>找回密码</text>
					</view>
					<view class="uni-form-item uni-column">
						<image class="login_img" src="../../static/login/shouji.png" mode=""></image>
						<input @input="changeMobile" class="uni-input" name="phone" placeholder="输入您的手机号" />
					</view>
					<view class="uni-form-item uni-column">
						<image class="login_img" src="../../static/login/email.png" mode=""></image>
						<input @input="changeremobileCode" class="uni-input" name="mobileCode" placeholder="请输入验证码" />
						<button :class="{columnwithbtn:true,active : !disableCodeBtn}" :disabled="disableCodeBtn" @tap="sendCode">{{codeBtn.text}}</button>
					</view>
					<view class="uni-form-item uni-column">
						<image class="login_img" src="../../static/login/mima.png" mode=""></image>
						<input @input="changePassword" password="true" class="uni-input" name="password" placeholder="设置新密码" />
					</view>
					<view class="uni-form-item uni-column">
						<image class="login_img" src="../../static/login/mima.png" mode=""></image>
						<input @input="changerePassword" password="true" class="uni-input" name="repassword" placeholder="请再次输入新密码" />
					</view>
					<button type="primary" formType="submit" @click="sumbitRegister">确认修改</button>
					<button type="default" class="canclelogin" @click="gotoLogin">取消</button>
					
				</view>
				
		</view>
		<view v-if="changeSuccess">
			<view class="login-card">
				<view class="text-reset">重置成功，新密码已生效！</view>
			</view>
			<view class="submit-view">
				<button type="primary" @tap="gotoLogin">立即登陆</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				seconds: 60,
				codeBtn: {
					text: '获取验证码',
					waitingCode: false,
					count: this.seconds
				},
				changeSuccess: false,
				mobile: '',
				password:'',
				repassword:'',
				mobileCode:''
			}
		},
		onLoad() {

		},
		methods: {
			//输入手机号
			changeMobile: function(event) {
				this.mobile = event.target.value;
			},
			changePassword: function(event) {
				this.password = event.target.value;
			},
			changerePassword: function(event) {
				this.repassword = event.target.value;
			},
			changeremobileCode: function(event) {
				this.mobileCode = event.target.value;
			},
			sendCode: function() {
				var phone = this.mobile;
				if (this.$utils.isEmpty(phone)) {
					this.$api.msg("请先输入您的手机号!")
					return;
				}
				this.codeBtn.waitingCode = true;
				this.codeBtn.count = this.seconds;
				this.codeBtn.text = this.codeBtn.count + 's';

				let countdown = setInterval(() => {
					this.codeBtn.count--;
					this.codeBtn.text = this.codeBtn.count + 's';
					if (this.codeBtn.count < 0) {
						clearInterval(countdown);
						this.codeBtn.text = '重新发送';
						this.codeBtn.waitingCode = false;
					}
				}, 1000);

				this.$request
					.get({
						url: this.$constants.ACCOUNT_RESETMOBILECODE +
							"?mobile=" + phone,
						loadingTip: '获取中...'
					})
					.then(
						res => {},
						res => {
							this.$api.msg(res.ret_msg.desc)
						}
					);

			},
			gotoLogin: function() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			
			//注册
			sumbitRegister: function(res) {
				var that = this;
				var mobileCode = this.mobileCode; //手机验证码
				var password = this.password; //密码
				var repassword = this.repassword; //确认密码
				var phone = this.phone; //手机号
				if (that.$utils.isEmpty(phone)) {
					that.$api.msg("请输入您的手机号!")
					return;
				}
				if (that.$utils.isEmpty(mobileCode)) {
					that.$api.msg("验证码不能为空!")
					return;
				}
				if (that.$utils.isEmpty(password)) {
					that.$api.msg("请输入新的密码!")
					return;
				}
				if (that.$utils.isEmpty(repassword)) {
					that.$api.msg("请再次输入新密码!")
					return;
				}
				if (password != repassword) {
					that.$api.msg("两次输入的密码不一致")
					return;
				}
				var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/;
				if (!reg.test(password)) {
					that.$api.msg("密码至少8位，要有字母和数字!")
					return;
				}

				that.$request
					.get({
						url: that.$constants.RESET_PASSWORD_MOBILE +
							"?mobile=" + phone +
							"&password=" + password +
							"&repassword=" + repassword +
							"&find_mobile_code=" + mobileCode,
						loadingTip: '重置密码中...'
					})
					.then(
						res => {
							that.changeSuccess = true;
						},
						res => {
							that.$api.msg(res.ret_msg.desc)
						}
					);
			},
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
	.canclelogin {
		margin-top: 5px;
	}
	.uni-form-item {
		display: flex;
		margin-bottom: 60upx;
		padding-bottom: 26upx;
		border-bottom: 2px solid #e5e4e4;

		.uni-input {
			font-size: 30upx;
			margin-left: 30upx;
			width: 280upx;
			color: #3e4a59;
			placeholder-color: #e5e4e4;
		}

		.login_img {
			height: 50upx;
			width: 50upx;
		}
	}

	.columnwithbtn {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 24upx;
		text-align: center;

		&:after {
			border: none
		}

		&.active {
			background-color: $color-primary;
			color: $uni-text-color-inverse;
		}
		
	}

	.img-captcha {
		width: 150upx;
		height: 60upx;
	}

	.text-reset {
		text-align: center;
		margin-bottom: 100upx;
		margin-top: 100upx;
		font-size: 36upx;
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
		padding-bottom: 48upx;
		font-size: 48upx;
		font-weight: bold;
		color: #3e4a59;
		letter-spacing: 10upx;
	}
</style>
