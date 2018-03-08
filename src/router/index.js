import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/pages/index/index'
import Public from '@/pages/public/public'
// import Random from '@/pages/random/random'
// import Bbs from '@/pages/bbs/bbs'
// import Post from '@/pages/bbs/post'
// import Input from '@/pages/bbs/input'
// import Wish from '@/pages/wish/wish'
// import Help from '@/pages/help/help'
// import Card from '@/pages/card/card'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: '首页',
			component: Index
		},{
			path: '/public',
			name: '公开',
			component: Public
		}
	]
})
