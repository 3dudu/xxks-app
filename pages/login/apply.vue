<template>
	<view class="content">
		<view class="head">
			<image class="logo" src="../../static/logo.png"></image>
			<view class="version"><text>IT学和练</text></view>
		</view>
		<view class="login-card">
			<view class="login-title">
				<text>选择岗位</text>
			</view>
			<view style="width: 80%; margin: auto;margin-bottom: 20px;">
				<xfl-select :list="companylist" :clearable="true" :showItemNum="5" :isCanInput="true" :focusShowList="true"
				 :style_Container="listBoxStyle" :placeholder="'选择公司'" @change="change" @input="inputcompany" @clear="clearCompany">
				</xfl-select>
			</view>

			<view style="width: 80%; margin: auto;margin-bottom: 20px;">
				<xfl-select :list="gw1list" :clearable="true" :showItemNum="5" :isCanInput="false" :focusShowList="true"
				 :style_Container="listBoxStyle" :placeholder="'选择岗位类型'" @clear="clearGw1" @change="selectGw1">
				</xfl-select>
			</view>

			<view style="width: 80%; margin: auto;margin-bottom: 20px;">
				<xfl-select ref="xflSelect" :list="gw2list" :clearable="true" :showItemNum="5" :isCanInput="false" :focusShowList="true"
				 :style_Container="listBoxStyle" :placeholder="'选择岗位'" @clear="clearGw2" @change="selectGw2">
				</xfl-select>
			</view>

		</view>
		<view class="submit-view">
			<button type="primary" @click="joinCompany">提交申请</button>
		</view>
		<view class="links1">
			<view @click="goToLogin">登录</view>
		</view>
	</view>
</template>

<script>
	import xflSelect from '../../components/xfl-select/xfl-select.vue';
	export default {
		data() {
			return {
				listBoxStyle: `height: 40px; font-size: 16px;`,
				companyid: '',
				companylist: [],
				gw1id: '',
				gw1list: [],
				gw2id: '',
				gw2list: [],
			}
		},
		components: {
			'xfl-select': xflSelect
		},
		onLoad() {
			//加载初始数据
			this.serchCompany("");
			this.serchGw("0")
		},
		methods: {
			//选中了一个公司选项
			change({
				newVal,
				oldVal,
				index,
				orignItem
			}) {
				if (orignItem != null && orignItem.id != null) {
					this.companyid = orignItem.id;
				} else {
					this.companyid = null;
				}
				console.log("this.companyid", this.companyid, newVal);
			},
			//选了一个岗位类型
			selectGw1({
				newVal,
				oldVal,
				index,
				orignItem
			}) {
				if (orignItem != null && orignItem.id != null) {
					this.gw1id = orignItem.id;
					this.serchGw(this.gw1id);
				} else {
					this.gw1id = null;
					that.gw2list = [];
				}
				console.log("岗位类型", this.gw1id, newVal);
			},
			//选了一个岗位
			selectGw2({
				newVal,
				oldVal,
				index,
				orignItem
			}) {
				if (orignItem != null && orignItem.id != null) {
					this.gw2id = orignItem.id;
				} else {
					this.gw2id = null;
				}
				console.log("岗位", this.gw2id, newVal);
			},
			//公司输入搜索
			inputcompany(res) {
				if (!this.$utils.isEmpty(res.detail.value)) {
					console.log("inputcompany", res.detail);
					this.serchCompany(res.detail.value);
				} else {
					this.serchCompany("");
				}
			},
			//清除公司输入框
			clearCompany() {
				this.companyid = null;
			},
			//清除岗位类型
			clearGw1() {
				this.gw1id = null;
				this.gw2id = null;
				this.gw2list = [];
				this.$refs.xflSelect.onClear();
			},
			//清除岗位
			clearGw2() {
				this.gw2id = null;

			},
			//调用接口搜索公司
			serchCompany: function(key) {
				var that = this;
				var searchkey = key;
				this.companyid = null;
				that.$request
					.get({
						url: that.$constants.SEARCH_COMPANY + "?keywors=" + key,
						loadingTip: '加载中...'
					})
					.then(
						res => {
							const arr = [],
								orginArr = res.findCompanyList;
							orginArr.forEach((val, index) => {
								arr.push({
									id: val.id,
									value: val.name,
								});
							});
							that.companylist = arr;
						},
						res => {
							that.$api.msg(res.ret_msg)
						}
					);
			},

			//调用接口查询岗位
			serchGw: function(parentid) {
				var that = this;
				var pid = parentid;
				that.$request
					.get({
						url: that.$constants.SEARCH_GW + "?pid=" + pid,
						loadingTip: '加载中...'
					})
					.then(
						res => {
							const arr = [],
								orginArr = res.getGWCateList;
							orginArr.forEach((val, index) => {
								arr.push({
									id: val.id,
									value: val.name,
								});
							});
							if (parentid == "0") {
								that.gw1list = arr;
							} else {
								that.gw2list = arr;
							}
						},
						res => {
							that.$api.msg(res.ret_msg)
						}
					);
			},
			//发起请求，加入公司
			joinCompany: function() {
				var that = this;
				console.log("joinCompany");
				if (that.$utils.isEmpty(that.companyid)) {
					that.$api.msg("请选择公司!")
					return;
				}
				if (that.$utils.isEmpty(that.gw1id)) {
					that.$api.msg("请选择岗位类型")
					return;
				}
				if (that.$utils.isEmpty(that.gw2id)) {
					that.$api.msg("请选择岗位")
					return;
				}
				that.$request
					.get({
						url: that.$constants.JOIN_CINOANY + "?com_id=" + that.gw1id + "&gw_id[]=" + that.gw2id,
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
			//登录
			goToLogin: function() {
				var that = this;
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		},


	}
</script>

<style lang="scss" scoped>
	$color-primary: #ff3d5d;

	.content {
		background-color: #FFFFFF;
	}

	.logo_top {
		image {
			height: 300upx;
			width: 100%;
		}
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
	.uni-form-item {
		margin-bottom: 40upx;
		padding: 0;
		border-bottom: 1px solid #e3e3e3;

		.uni-input {
			font-size: 30upx;
			padding: 7px 0;
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

	.submit-view {
		padding-left: 100upx;
		padding-right: 100upx;
		width: 100%;
		margin-top: -130upx;
	}

	button[type="primary"] {
		height: 84upx;
		line-height: 84upx;
		width: 480upx;
		border-radius: 40upx;
		font-size: 30upx;
		margin-left: 40upx;
		background: #2d86fd;
		letter-spacing: 10upx;
		color: #FFFFFF;

	}

	button[type="default"] {
		background-color: $uni-text-color-inverse;
		color: $color-primary;
		border: 2upx solid $color-primary;
		border-radius: 0;
		font-size: 34upx;
		margin-top: 60upx;
	}

	button[type="warn"] {
		background-color: $color-primary;
		border-radius: 0;
		font-size: 34upx;
		margin-top: 30upx;
	}

	.links {
		text-align: center;
		margin-top: 40upx;
		font-size: 26upx;
		color: #999;

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

	.login-card {
		background: #fff;
		border-radius: 12upx;
		padding-left: 25upx;
		padding-right: 25upx;
		padding-top: 10upx;
		padding-bottom: 110upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		position: relative;
		margin-left: 50upx;
		margin-right: 50upx;
		margin-top: -60upx;
		margin-bottom: 94upx;
	}

	.login-title {
		padding-bottom: 48upx;
		font-size: 48upx;
		font-weight: bold;
		color: #3e4a59;
		letter-spacing: 10upx;
	}

	.links1 {
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
</style>
