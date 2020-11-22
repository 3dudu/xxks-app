<template>
	<view class="content">
		<!--标题栏-->
		<view class="status_bar"></view>
		<titleBar :image="userinfo.head_ico" :integral="userinfo.point" />
		<!--学习分类-->
		<view class="body">
			<view class="cateItem" v-for="item in cateList" :key="item.id" @click="choseCate(item)">
				<image :src="item.logo" v-if="!item.showTitle" @error="showTitle(item)"></image>
				<view class="title" v-if="item.showTitle">{{item.name}}</view>
			</view>
			
		</view>
	</view>
</template>

<script>
import titleBar from '@/components/title-bar/title-bar.vue';
export default {
	components: {
		titleBar
	},
	data() {
		return {
			cateList: [],
			userinfo: {
				"head_ico":"../../static/mine/table.png",
				"truename":"未登录"
			}
		};
	},
	onLoad() {
		var that = this;
		that.loadData();
	},
	onShow() {
		var that = this;
		/* if (uni.getStorageSync('userinfo')) {
				var userinfo = uni.getStorageSync('userinfo').userinfo;
				if (that.$utils.isEmpty(userinfo.head_ico)) {
					userinfo.head_ico = "../../static/moren.jpg"
				} else {
					if (userinfo.head_ico.indexOf('http') == -1) {
						userinfo.head_ico = that.$constants.SUQIAN_IMG_URI + userinfo.head_ico;
					} else {
						userinfo.head_ico = userinfo.head_ico;
					}
				}
				that.userinfo = userinfo;
			} */
		let userinfo = that.$utils.getUserInfo();
		if(userinfo){
			this.userinfo = userinfo;
		}
		that.loadData();
	},
	methods: {
		loadData: function() {
			var that = this;
			that.fetchCateList();
		},
		//获取分类列表
		fetchCateList: function() {
			var that = this;
			var cateList = [];
			var baseUrl = that.$constants.STUDY_CATELIST;
			that.$request
				.get({
					url: baseUrl,
					//loadingTip: '加载中...'
				})
				.then(
					res => {
						//成功
						for (var i = 0; i < res.cateList.length; i++) {
							var item = res.cateList[i];
							item.showTitle = false;
							
							if (that.$utils.isEmpty(item.logo)) {
								item.showTitle = true;
							} else {
								if (item.logo.indexOf('http') == -1) {
									item.logo = that.$constants.SUQIAN_IMG_URI + item.logo;
								} else {
									item.logo = item.logo;
								}
							}
							cateList.push(res.cateList[i]);
						}
						that.cateList = cateList;
					},
					res => {
						//失败
						that.$api.msg(res.ret_msg);
					}
				);
		},
		
		showTitle:function(item){
			item.showTitle = true;
		},
		
		//跳转学习任务列表
		choseCate: function(item) {
			var that = this;
			uni.navigateTo({
				url: '/pages/tabStudy/studyCateList?id=' + item.id + '&title=' + item.name
			});
		}
	}
};
</script>

<style lang="scss">
	.status_bar {
	    height: var(--status-bar-height);
	    width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: $uni-color-title;
		justify-content: center;
	}
page,
.content {
	display: flex;
	flex-direction: column;
	background-color: $uni-bg-color-grey;
	width: 100vw;
	overflow: hidden;
}

.body {
	//display: flex;
	//flex-direction: column;
	background-color: $uni-bg-color-grey;
	//justify-content: center;
	//align-items: center;
	padding-top: calc( var(--status-bar-height)  + 44px);
	//padding-bottom: 80px;
	width: 100vw;
	height: calc(100vh - 50px);
	overflow: scroll;
}

.cateItem {
	margin-bottom: 20upx;
	width: 568.48upx;
	height: 155.76upx;
margin: 7px auto;

	image {
		width: 100%;
		height: 100%;
	}

	.title {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 150upx;

		font-size: $uni-font-size-lg + 7;
		font-weight: 500;
		letter-spacing: 6upx;
		background: #ffffff;
		box-shadow: 0 0 10upx $uni-bg-color-box-shadow;
	}
}
</style>
