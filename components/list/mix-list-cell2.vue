<template>
	<view class="mix-list-cell" :style="[{
	 		borderBottom:borderBottom
	 	}]" :class="border" @click="eventClick"
	 hover-class="cell-hover" :hover-stay-time="50">
		<text v-if="icon" class="cell-icon yticon" :style="[{
					color: iconColor,
				}]" :class="icon"></text>
		<view class="leftRow">
			<text class="cell-tit clamp" :style="[{
					fontSize: titleSize,
					fontWeight: titleWeight,
				}]">{{title}}</text>
			<text v-if="node!=''" class="cell-tip" :style="[{
					color: nodeColor,
					marginTop: '10upx',
					fontWeight: '600',
				}]">{{node}}</text>
		</view>
		<text v-if="tips" class="cell-tip">{{tips}}</text>
		<text class="cell-more yticon" :class="typeList[navigateType]"></text>
	</view>
</template>

<script>
	/**
	 *  简单封装了下， 应用范围比较狭窄，可以在此基础上进行扩展使用
	 *  比如加入image， iconSize可控等
	 */
	export default {
		data() {
			return {
				typeList: {
					left: 'icon-zuo',
					right: 'icon-you',
					up: 'icon-shang',
					down: 'icon-xia'
				},
			}
		},
		props: {
			icon: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '标题'
			},
			node: {
				type: String,
				default: ''
			},
			tips: {
				type: String,
				default: ''
			},
			navigateType: {
				type: String,
				default: 'right'
			},
			border: {
				type: String,
				default: ''
			},
			hoverClass: {
				type: String,
				default: 'cell-hover'
			},
			iconColor: {
				type: String,
				default: '#333'
			},
			nodeColor: {
				type: String,
				default: '#8b8b8b'
			},
			titleSize: {
				type: String,
				default: '32upx'
			},
			titleWeight: {
				type: String,
				default: '600'
			},
			borderBottom: {
				type: String,
				default: '2upx solid #f8f8f8'
			}
		},
		methods: {
			eventClick() {
				this.$emit('eventClick');
			}
		},
	}
</script>

<style lang='scss'>
	.icon .mix-list-cell.b-b:after {
		left: 90upx;
	}

	.mix-list-cell {
		display: flex;
		align-items: center;
		padding: 20upx 20upx;
		background: #FFFFFF;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			align-self: center;
			width: 56upx;
			max-height: 60upx;
			font-size: 38upx;
		}

		.cell-more {
			align-self: center;
			font-size: 30upx;
			font-weight: 600;
			color: #606266;
			margin-left: $uni-spacing-row-sm;
		}

		.cell-tit {
			flex: 1;
			font-size: 28upx;
			color: #303133;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: #909399;
		}
	}

	.leftRow {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		letter-spacing: 4upx
	}
</style>
