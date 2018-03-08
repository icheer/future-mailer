import Vue from 'vue'
import Router from 'vue-router'
import Menu from '@/pages/menu/menu'
import Random from '@/pages/random/random'
import Bbs from '@/pages/bbs/bbs'
import Post from '@/pages/bbs/post'
import Input from '@/pages/bbs/input'
// import Wish from '@/pages/wish/wish'
// import Help from '@/pages/help/help'
// import Card from '@/pages/card/card'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: '首页',
			component: Menu
		},{
			path: '/random',
			name: '偶遇',
			component: Random
		},{
			path: '/bbs',
			name: '树洞',
			component: Bbs
		},{
			path: '/post',
			name: '帖子',
			component: Post
		},{
			path: '/input',
			name: '发串',
			component: Input
		}
	]
})
