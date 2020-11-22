<template>
	<view class="content">

		<uni-list>
			<uni-list-item v-for="(item, index) in qlist" :key="index" :title="item.title" :note="item.description" :show-badge="true"
			 :badge-text="item.count" @click="viewlist(item)"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"

	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				qlist: [],
			}
		},
		onLoad() {
			var baseUrl = this.$constants.EXAM_POOLS;
			this.$request.get({
					url: baseUrl,
					loadingTip: '加载中...',
				}).then(res => {
						res.questionPool.forEach(item => {
							this.qlist.push(item);})
				});
			},
			methods: {
				viewlist:function(item){
					uni.navigateTo({
						url: '/pages/answer/questionlist?poolid=' + item.id+"&title="+item.title,
					})
				}
			}
		}
</script>

<style lang="scss">
	page,
	.content {
		background-color: $uni-bg-color-grey;
		width: 100%;
		overflow: scroll;
		font-family: "Microsoft YaHei";
	}
</style>
