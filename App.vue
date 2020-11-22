<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		methods: {
			...mapMutations(['login','initShare'])
		},
		onLaunch: function() {
			console.log('App Launch');
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //锁定
			
			// #endif
			var that = this;
			uni.getStorage({
				key: 'userinfo',
				success: (res) => {
					that.login(res.data);
				}
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "./static/index.css";
</style>

<style lang="scss">
	/*每个页面公共css */
	@font-face {
		font-family: 'iconfont';
		src: url('https://at.alicdn.com/t/font_989023_efq0mtli526.ttf') format('truetype');
	}

	.icon {
		font-family: iconfont;
		font-size: 32upx;
		font-style: normal;
		color: #999;
	}

	/*
		全局公共样式和字体图标
	*/
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}

	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-you:before {
		content: "\e606";
	}

	.icon-pinglun-copy:before {
		content: "\e612";
	}

	.icon-dizhi:before {
		content: "\e614";
	}

	.icon-dianhua-copy:before {
		content: "\e621";
	}

	.icon-shouye:before {
		content: "\e626";
	}

	.icon-shoucang2:before {
		content: "\e62e";
	}

	.icon-saomiao:before {
		content: "\e60d";
	}

	/*边框*/
	.b-b:after,
	.b-t:after {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		height: 0;
		content: '';
		transform: scaleY(.5);
		border-bottom: 1px solid $border-color-base;
	}

	.b-b:after {
		bottom: 0;
	}

	.b-t:after {
		top: 0;
	}
</style>
