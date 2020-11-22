<template>

	<view class="content">
		<view class="login-title">
			<image src="../../static/login/apply_icon.png" class="image-select" mode=""></image>
			<text>完善信息</text>
		</view>

		<view class="login-card">
			<view class="item">
				<text style="white-space:pre">单位名称</text>
				<xfl-select :list="companylist" :clearable="true" :showItemNum="companylist.length" :isCanInput="true"
				 :focusShowList="true" :style_Container="listBoxStyle" :placeholder="'选择您所在的公司'" @change="change" @input="inputcompany"
				 @clear="clearCompany">
				</xfl-select>
			</view>

			<view class="item">
				<text>岗位类别</text>
				<xfl-select :list="gw1list" :clearable="true" :showItemNum="gw1list.length" :isCanInput="false" :focusShowList="true"
				 :style_Container="listBoxStyle" :placeholder="'选择您所属的岗位类别'" @clear="clearGw1" @change="selectGw1">
				</xfl-select>
			</view>

			<view class="item" v-if="gw2list.length != 0">
				<text style="white-space:pre">具体工种</text>
				<xfl-select ref="xflSelect" :list="gw2list" :clearable="true" :showItemNum="gw2list.length" :isCanInput="false"
				 :focusShowList="true" :style_Container="listBoxStyle" :placeholder="'选择您所属的具体工种'" @clear="clearGw2" @change="selectGw2">
				</xfl-select>
			</view>

			<view class="item" v-if="gw3list.length != 0">
				<text style="white-space:pre">工作岗位</text>
				<xfl-select ref="xflSelect" :list="gw3list" :clearable="true" :showItemNum="gw3list.length" :isCanInput="false"
				 :focusShowList="true" :style_Container="listBoxStyle" :placeholder="'选择您所属的工作岗位'" @clear="clearGw3" @change="selectGw3">
				</xfl-select>
			</view>

			<view class="item" v-if="gw4list.length != 0">
				<text style="white-space:pre">具体工种</text>
				<xfl-select ref="xflSelect" :list="gw4list" :clearable="true" :showItemNum="gw4list.length" :isCanInput="false"
				 :focusShowList="true" :style_Container="listBoxStyle" :placeholder="'选择您所属的具体工种'" @clear="clearGw4" @change="selectGw4">
				</xfl-select>
			</view>

			<view class="item" v-if="gw5list.length != 0">
				<text style="white-space:pre">具体工种</text>
				<xfl-select ref="xflSelect" :list="gw5list" :clearable="true" :showItemNum="gw5list.length" :isCanInput="false"
				 :focusShowList="true" :style_Container="listBoxStyle" :placeholder="'选择您所属的具体工种'" @clear="clearGw5" @change="selectGw5">
				</xfl-select>
			</view>

			<view class="item" v-if="gw6list.length != 0">
				<text style="white-space:pre">具体工种</text>
				<xfl-select ref="xflSelect" :list="gw6list" :clearable="true" :showItemNum="gw6list.length" :isCanInput="false"
				 :focusShowList="true" :style_Container="listBoxStyle" :placeholder="'选择您所属的具体工种'" @clear="clearGw6" @change="selectGw6">
				</xfl-select>
			</view>

			<view class="item" v-if="gw2list.length != 0 && isShowSafetyCertificate">
				<text style="white-space:pre">安全合格证</text>
				<input class="input" style="font-size: 30upx;" placeholder-style="color: #bbb;font-size: 30upx;" type="text"
				 placeholder="请输入安全合格证号" @input="onInput1" />
			</view>
			<view class="item" v-if="gw2list.length != 0 && isShowOperationCertificate">
				<text style="white-space:pre">特种作业操作证号</text>
				<input class="input2" style="font-size: 30upx;" placeholder-style="color: #bbb;font-size: 30upx;" type="text"
				 placeholder="请输入特种作业操作证号" @input="onInput2" />
			</view>

			<view class="item" v-if="isShowSafetyCertificate || isShowOperationCertificate">
				<text style="white-space:pre">初领时间</text>
				<ruiDatePicker fields="day" start="1970-00-00" end="2050-12-30" :value="collectionTime" @change="changeCollectionTime"></ruiDatePicker>
			</view>
			<view class="item" v-if="isShowSafetyCertificate || isShowOperationCertificate">
				<text style="white-space:pre">换证时间</text>
				<ruiDatePicker fields="day" start="1970-00-00" end="2050-12-30" :value="replaceTime" @change="changeReplaceTime"></ruiDatePicker>
			</view>
			<view class="item" v-if="isShowSafetyCertificate || isShowOperationCertificate">
				<text style="white-space:pre">复审时间</text>
				<ruiDatePicker fields="day" start="1970-00-00" end="2050-12-30" :value="recheckTime" @change="changeRecheckTime"></ruiDatePicker>
			</view>
			<view class="item" v-if="isShowSafetyCertificate || isShowOperationCertificate">
				<text style="white-space:pre">证书图片</text>
				<image :src="certificatePicture==''?'../../static/uploadimg.png':certificatePicture" class="certificatePicture"
				 @click="chooseImage"></image>
			</view>

			<view class="submit-view">
				<button type="primary" @click="joinCompany">提交申请</button>
			</view>

		</view>

	</view>
</template>

<script>
	import xflSelect from '../../components/xfl-select/xfl-select.vue';
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
	export default {
		data() {
			return {
				listBoxStyle: `height: 40px; font-size: 30upx;`,
				companyid: '',
				companylist: [],
				gw1id: '',
				gw1list: [],
				gw2id: '',
				gw2list: [],
				gw3id: '',
				gw3list: [],
				gw4id: '',
				gw4list: [],
				gw5id: '',
				gw5list: [],
				gw6id: '',
				gw6list: [],
				index: '', //当前行业
				isShowSafetyCertificate: false,
				safetyCertificate: '',
				isShowOperationCertificate: false,
				operationCertificate: '',
				collectionTime: '', //初领时间
				replaceTime: '', //换证时间
				recheckTime: '', //复审时间
				certificatePicture: '', //证书图片
			}
		},
		components: {
			'xfl-select': xflSelect,
			ruiDatePicker,
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
					this.index = 1;
				} else {
					this.gw1id = null;
					this.gw2list = [];
				}
				if (newVal == "生产经营单位主要负责人" || newVal == "安全生产管理人员") {
					this.isShowSafetyCertificate = true;
					this.isShowOperationCertificate = false;
				} else if (newVal == "特种作业人员") {
					this.isShowSafetyCertificate = false;
					this.isShowOperationCertificate = true;
				} else {
					this.isShowSafetyCertificate = false;
					this.isShowOperationCertificate = false;
				}
				this.safetyCertificate = "";
				this.operationCertificate = "";
				console.log("岗位类型", this.gw1id, newVal);
			},
			//选了一级岗位
			selectGw2({
				newVal,
				oldVal,
				index,
				orignItem
			}) {
				if (orignItem != null && orignItem.id != null) {
					this.gw2id = orignItem.id;
					this.index = 2;
					this.serchGw(this.gw2id);
				} else {
					this.gw2id = null;
					this.gw3list = [];
				}
				console.log("一级岗位", this.gw2id, newVal);
			},

			//选了二级岗位
			selectGw3({
				newVal,
				oldVal,
				index,
				orignItem
			}) {
				console.log("二级岗位")
				if (orignItem != null && orignItem.id != null) {
					this.gw3id = orignItem.id;
					this.index = 3;
					this.serchGw(this.gw3id);
				} else {
					this.gw3id = null;
					this.gw4list = [];
				}
				console.log("二级岗位", this.gw3id, newVal);
			},

			//选了三级岗位
			selectGw4({
				newVal,
				oldVal,
				index,
				orignItem
			}) {
				if (orignItem != null && orignItem.id != null) {
					this.gw4id = orignItem.id;
					this.index = 4;
					this.serchGw(this.gw4id);
				} else {
					this.gw4id = null;
					this.gw5list = [];
				}
				console.log("三级岗位", this.gw4id, newVal);
			},

			//选了四级岗位
			selectGw5({
				newVal,
				oldVal,
				index,
				orignItem
			}) {
				if (orignItem != null && orignItem.id != null) {
					this.gw5id = orignItem.id;
					this.index = 5;
					this.serchGw(this.gw5id);
				} else {
					this.gw5id = null;
					this.gw6list = [];
				}
				console.log("四级岗位", this.gw5id, newVal);
			},
			//选了五级岗位
			selectGw6({
				newVal,
				oldVal,
				index,
				orignItem
			}) {
				if (orignItem != null && orignItem.id != null) {
					this.gw6id = orignItem.id;
					this.index = 6;
					this.serchGw(this.gw6id);
				} else {
					this.gw6id = null;
				}
				console.log("四级岗位", this.gw6id, newVal);
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

				this.gw1id = null;

				this.gw2id = null;
				this.gw2list = [];

				this.gw3id = null;
				this.gw3list = [];

				this.gw4id = null;
				this.gw4list = [];

				this.gw5id = null;
				this.gw5list = [];

				this.gw6id = null;
				this.gw6list = [];

				this.safetyCertificate = "";
				this.operationCertificate = "";

				if (!this.$utils.isEmpty(this.$refs.xflSelect)) {
					this.$refs.xflSelect.onClear();
				}
			},
			//清除岗位类型
			clearGw1() {
				this.gw1id = null;

				this.gw2id = null;
				this.gw2list = [];

				this.gw3id = null;
				this.gw3list = [];

				this.gw4id = null;
				this.gw4list = [];

				this.gw5id = null;
				this.gw5list = [];

				this.gw6id = null;
				this.gw6list = [];

				this.safetyCertificate = "";
				this.operationCertificate = "";

				if (!this.$utils.isEmpty(this.$refs.xflSelect)) {
					this.$refs.xflSelect.onClear();
				}

			},
			//清除岗位
			clearGw2() {
				this.gw2id = null;

				this.gw3id = null;
				this.gw3list = [];

				this.gw4id = null;
				this.gw4list = [];

				this.gw5id = null;
				this.gw5list = [];

				this.gw6id = null;
				this.gw6list = [];
			},
			clearGw3() {
				this.gw3id = null;

				this.gw4id = null;
				this.gw4list = [];

				this.gw5id = null;
				this.gw5list = [];

				this.gw6id = null;
				this.gw6list = [];
			},
			clearGw4() {
				this.gw4id = null;

				this.gw5id = null;
				this.gw5list = [];

				this.gw6id = null;
				this.gw6list = [];
			},
			clearGw5() {
				this.gw5id = null;

				this.gw6id = null;
				this.gw6list = [];
			},
			clearGw6() {
				this.gw6id = null;
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
								switch (that.index) {
									case 1:
										that.gw2list = arr;
										break;
									case 2:
										that.gw3list = arr;
										break;
									case 3:
										that.gw4list = arr;
										break;
									case 4:
										that.gw5list = arr;
										break;
									case 5:
										that.gw6list = arr;
										break;
								}
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
				// if (that.$utils.isEmpty(that.gw2id)) {
				// 	that.$api.msg("请选择岗位")
				// 	return;
				// }

				if (that.isShowSafetyCertificate && that.$utils.isEmpty(that.safetyCertificate)) {
					that.$api.msg("请输入安全合格证号")
					return;
				}

				if (that.isShowOperationCertificate && that.$utils.isEmpty(that.operationCertificate)) {
					that.$api.msg("请输入特种作业操作证号")
					return;
				}

				var baseUrl = that.$constants.JOIN_CINOANY + "?com_id=" + that.companyid;
				if (!that.$utils.isEmpty(that.gw1id)) {
					baseUrl = baseUrl + "&gw_id[]=" + that.gw1id;
				}
				if (!that.$utils.isEmpty(that.gw2id)) {
					baseUrl = baseUrl + "&gw_id[]=" + that.gw2id;
				}
				if (!that.$utils.isEmpty(that.gw3id)) {
					baseUrl = baseUrl + "&gw_id[]=" + that.gw3id;
				}
				if (!that.$utils.isEmpty(that.gw4id)) {
					baseUrl = baseUrl + "&gw_id[]=" + that.gw4id;
				}
				if (!that.$utils.isEmpty(that.gw5id)) {
					baseUrl = baseUrl + "&gw_id[]=" + that.gw5id;
				}
				if (!that.$utils.isEmpty(that.gw6id)) {
					baseUrl = baseUrl + "&gw_id[]=" + that.gw6id;
				}

				if (!that.$utils.isEmpty(that.safetyCertificate)) {
					baseUrl = baseUrl + "&aqzg_code=" + that.safetyCertificate;
				}
				if (!that.$utils.isEmpty(that.operationCertificate)) {
					baseUrl = baseUrl + "&tzzy_code=" + that.operationCertificate;
				}
				if (that.isShowSafetyCertificate) {
					baseUrl = baseUrl + "&aqzg_c_time=" + that.collectionTime + "&aqzg_h_time=" + that.replaceTime + "&aqzg_f_time=" +
						that.recheckTime;
					var imgType = "aqzg_img";
				}
				if (that.isShowOperationCertificate) {
					baseUrl = baseUrl + "&tzzy_c_time=" + that.collectionTime + "&tzzy_h_time=" + that.replaceTime + "&tzzy_f_time=" +
						that.recheckTime;
					var imgType = "tzzy_img";
				}
				console.log(baseUrl)
				if (!that.$utils.isEmpty(that.certificatePicture)) {
					that.$request
						.upload({
							url: baseUrl,
							filePath: that.certificatePicture, //选择的图片路径
							name: imgType,
							business: null,
							skipInterceptorResponse: true,
							progress: (res2, task) => {
								let p = '上传进度: ' + res2.totalBytesSent + '/' + res2.totalBytesExpectedToSend + ' (' + res2.progress +
									'%)';
							}
						})
						.then(
							res => {
								console.log(res);
								that.$api.msg(res.joinCompany)
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/personalCenter/personalCenter',
									})
								}, 400)
							},
							res => {
								that.$api.msg(res.ret_msg.desc)
								if ("用户已入职其他公司,请直接登录" == res.ret_msg.desc) {
									setTimeout(() => {
										uni.reLaunch({
											url: '/pages/personalCenter/personalCenter',
										})
									}, 400)
								}
							}
						)
						.catch(res2 => {
							console.log(res2);
						});
				} else {
					console.log("baseUrl===>",baseUrl)
					that.$request
						.post({
							url: baseUrl,
							loadingTip: '加载中...'
						})
						.then(
							res => {
								console.log(res);
								that.$api.msg(res.joinCompany)
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/personalCenter/personalCenter',
									})
								}, 400)

							},
							res => {
								that.$api.msg(res.ret_msg.desc)
								if ("用户已入职其他公司,请直接登录" == res.ret_msg.desc) {
									setTimeout(() => {
										uni.reLaunch({
											url: '/pages/personalCenter/personalCenter',
										})
									}, 400)
								}

							}
						);
				}
			},
			//登录
			goToLogin: function() {
				var that = this;
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			//输入安全合格证号
			onInput1: function(res) {
				this.safetyCertificate = res.detail.value;
			},
			//特种作业操作证号
			onInput2: function(res) {
				this.operationCertificate = res.detail.value;
			},
			changeCollectionTime: function(res) {
				var that = this;
				that.collectionTime = res;
			},
			changeReplaceTime: function(res) {
				var that = this;
				that.replaceTime = res;
			},
			changeRecheckTime: function(res) {
				var that = this;
				that.recheckTime = res;
			},
			chooseImage: function() {
				var that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						that.certificatePicture = res.tempFilePaths[0];
					}
				});
			}
		},


	}
</script>

<style lang="scss" scoped>
	$color-primary: #ff3d5d;

	.content {
		background-color: #FFFFFF;
	}


	.item {
		display: flex;
		padding-top: 10upx;
		padding-bottom: 10upx;
		align-items: center;
		border-bottom: 2px solid #f0eff5;
		width: 720upx;

		text {
			width: 160upx;
			font-size: 25upx;
			margin-left: 20upx;
		}

		.input {
			height: 80upx;
			width: 505.62upx;
		}

		.input2 {
			height: 80upx;
			width: 415.62upx;
			margin-left: 90upx;
		}

		.fInput {
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 80upx;
			width: 505.62upx;
			color: #bbb;
			font-size: 30upx;
		}

		.certificatePicture {
			width: 100upx;
			height: 100upx;
			margin-top: 20upx;
			margin-bottom: 20upx;
		}
	}


	button[type="primary"] {
		height: 90upx;
		line-height: 84upx;
		width: 700upx;
		border-radius: 10upx;
		font-size: 36upx;
		margin-left: 20upx;
		margin-top: 40upx;
		background: #80d4f6;
		letter-spacing: 2upx;
		color: #FFFFFF;

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
		width: 750upx;
		background: #fff;
		border-radius: 12upx;
		padding-top: 10upx;
		padding-bottom: 110upx;
		position: relative;
		padding-left: 10upx;
		padding-right: 10upx;
		margin-bottom: 94upx;
		margin-top: 20upx;

		text {
			font-size: 30upx;
		}
	}

	.login-title {
		display: flex;
		text-align: center;
		padding-left: 40upx;
		margin-top: 45upx;
		padding-bottom: 40upx;
		align-items: center;
		border-bottom: 8px solid #f0eff5;

		text {
			font-size: 35upx;
			color: #a9a9a9;
			letter-spacing: 5upx;
			margin-left: 10upx;
		}

		image {
			height: 70upx;
			width: 70upx;
		}

	}
</style>
