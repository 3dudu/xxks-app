import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userinfo: {},
		hasLogin: false,
		sharep:[]
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true
			state.userinfo = provider.userinfo;
			if (provider.hasOwnProperty('x-token')) {
				state.userinfo['x-token'] = provider['x-token'];
			}
			uni.setStorage({
				key: 'userinfo',
				data: state
			})
		},
		logout(state) {
			state.hasLogin = false
			state.userinfo = {}
			uni.removeStorage({
				key: 'userinfo'
			});
		},
		initShare(state,p){
			state.sharep.push(p);
		}
	}
})

export default store
