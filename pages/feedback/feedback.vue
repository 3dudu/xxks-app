<template>
	<view class="content">
		<view class="first" @click="choseType">
			<view class="title">请选择反馈问题的类型</view>
			<text>{{hasChoseType.title}}</text>
			<text class="yticon icon-you"></text>
		</view>
		<view class="second">
			<textarea placeholder="请填写反馈问题说明" maxlength="200" @input="descInput" />
			</view>
		<view class="btn" @click="submit">
			提交建议
		</view>
		<view class="shade" v-if="showShade" @click="hidePop">
			<view class="pop">
				<view @click.stop="choseTypeFunction(item)" class="item" v-for="(item,index) in popButton" :key="index">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popButton: [{
						id: 1,
						title: "系统功能"
					},
					{
						id: 2,
						title: "学习内容"
					},
					{
						id: 3,
						title: "答题内容"
					}
				],
				desc:'',
				/* 显示遮罩 */
				showShade: false,
				hasChoseType:{
						id: 1,
						title: "系统功能"
					},
			};
		},
		onLoad() {
			var that = this;
		},
		methods:{
			choseType:function(e) {
				var that = this;
				that.showShade = !that.showShade;
			},
			hidePop:function(){
				var that = this;
				that.showShade = false;
			},
			choseTypeFunction:function(item){
				var that = this;
				that.hasChoseType = item;
				that.showShade = false;
			},
			descInput:function(res){
				var that = this;
				that.desc = res.detail.value;
			},
			submit:function(){
				var that = this;
				var baseUrl = that.$constants.UCENTER_SUGGESTION + "?c_type="+that.hasChoseType.id + "&content="+encodeURIComponent(that.desc);
				that.$request
					.get({
						url: baseUrl,
						loadingTip: '提交中...'
					})
					.then(
						res => {//success
							console.log(res)
							that.$api.msg("提交成功！")
							setTimeout(()=>{
								uni.navigateBack({
								 	delta:1
								})
							},400)
						},
						res => {//fail
							that.$api.msg(res.ret_msg)
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
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}
	.first,.second{
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 90vw;
		padding: 15upx;
		font-size: 30upx;
		border-radius: 15upx;
		background: $uni-text-color-inverse;
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
	}
	.title{
		flex: 1;
		color: $uni-text-color;
	}
	.icon-you{
		font-size: 28upx;
		margin-left: 20upx;
	}
	.first{
		margin: 20upx 0 20upx 0;
	}
	.second{
		margin: 0upx 0 20upx 0;
		textarea{
			width: 100%;
			height: 300upx;
		}
	}
	.btn{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 90vw;
		background: #c49505;
		padding: 15upx;
		border-radius: 70upx;
		color: $uni-bg-color;
		font-size: $uni-font-size-lg;
	}
	/* 遮罩 */
	.shade{
		position: fixed;
		width: 100vw;
		height: 100vh;
		z-index:1001;
		.pop{
			position: absolute;
			top: 80upx;
			right:20upx;
			z-index:1003;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background: $uni-bg-color;
			box-shadow:5upx  5upx 3upx $uni-bg-color-grey;
			width: 200upx;
			font-size: $uni-font-size-base;
			border: 4upx solid $uni-bg-color-grey;
			.item{
				width: 100%;
				text-align: center;
				border-bottom: 2upx solid $uni-bg-color-grey;
				padding: 10upx;
			}
		}
	}
</style>
