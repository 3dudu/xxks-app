<template>
	<view class="code-box">
		<view class="flex-box">
			<input type="text" focus="true" :maxlength="maxlength" class="hide-input" @input="getVal" />
			<view class="item2" v-for="(item, index) in maxlength" :key="index">
				<view> {{ codeArr[index] ? codeArr[index] : ''}}</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		name: 'uiOneInput',
		props: {
			maxlength: {
				type: Number,
				default: 1
			},
		},
		data() {
			return {
				codeIndex: 1,
				codeArr: [],
			}
		},
		methods: {
			getVal(e) {
				let {
					value
				} = e.detail
				let arr = value.split('')
				this.codeIndex = arr.length + 1
				this.codeArr = arr
				if (this.codeIndex > Number(this.maxlength)) {
					this.$emit('mobileCode', this.codeArr.join(''))
				}
			}
		}
	}
</script>

<style>
	.code-box {
		text-align: center;
	}

	.flex-box {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		position: relative;
	}

	.hide-input {
		position: absolute;
		top: 0;
		left: -100%;
		width: 200%;
		height: 100%;
		text-align: left;
		z-index: 9;
		opacity: 0;
	}

	.item2 {
		display: flex;
		flex-direction: row;
		width: 110upx;
		height: 110upx;
		justify-content: center;
		align-items: center;
		margin: 25upx;
		border-radius: 12upx;
		background: #f2f2f2;
	}
</style>
