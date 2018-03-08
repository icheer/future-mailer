<template>
	<div class="bbs abs full overflow-x-hidden" ref="container">
		<div class="header fixed">
			<div class="title">树洞</div>
			<div class="button new-post" @click="createPost()">+</div>
		</div>
		<transition name="fade-quickly">
			<mt-loadmore :top-method="reload" :bottom-method="getPost" :bottom-all-loaded="allLoaded" :autoFill="false" :bottomDistance="0" :bottomPullText="'加载更多'" ref="loadmore" v-show="!clear">
				<div class="post" v-for="post in posts" @click="goToPost(post)">
					<div class="head">
						<div class="left">
							<span>{{convertTime(post.time)}}</span>
							<span>{{post.name}}</span>
						</div>
						<div class="right">
							回应：<span>{{post.n}}</span>
						</div>
					</div>
					<div class="body">{{post.content | more(100)}}</div>
				</div>
				<div slot="top" class="mint-loadmore-top"></div>
				<div slot="bottom" class="mint-loadmore-bottom" v-show="posts.length">
					<span v-show="!allLoaded" @click="getPost">加载更多</span>
					<span v-show="allLoaded">没有更多啦</span>
				</div>
			</mt-loadmore>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'bbs',
	data () {
		return {
			loading: false,
			clear: true,
			posts:[],
			currentPage:0,
			totalPage:0,
			allLoaded: false,
			scroll: 0
		}
	},
	watch: {
		$route(to,from){
			if(to.path!='/post' && to.path!='/bbs'){
				this.posts=[];
				this.clear=true;
				this.currentPage=0;
				this.totalPage=0;
				this.allLoaded=false;
				this.scroll=0;
			} else if (from.path=='/post' && to.path=='/bbs'){
				this.loadScroll();
			} else if (from.path=='/bbs' && to.path=='/post'){

			}
		}
	},
	methods: {
		getPost: function(){
			if(this.allLoaded){
				return;
			}
			this.loading = true;
			this.currentPage++;
			this.$util.ajax('bbs/queryPost','post',{
				currentPage: this.currentPage,
				pageSize: 10
			}).then(res=>{
				if(res.code=='100000'){
					this.clear=false;
					this.posts=this.posts.concat(res.data.list);
					this.totalPage=res.data.totalPage;
					this.loadEnd();
					if(this.currentPage<this.totalPage){
						this.allLoaded=false;
					} else {
						this.allLoaded=true;
					}
					if(this.currentPage==1){
						this.$nextTick(()=>{
							this.$refs.container.scrollTop=0;
						});
					} else {
						// this.$nextTick(()=>{
						// 	this.$refs.container.scrollTop=99999;
						// });
					}
				}
				this.loading=false;
			}).catch(err=>{
				this.loading=false;
			})
		},
		convertTime: function(input){
			let date = new Date(input);
			let month = date.getMonth()+1;
			month.toString()[0]!=month?null:month='0'+month;
			let day = date.getDate();
			day.toString()[0]!=day?null:day='0'+day;
			let hour = date.getHours();
			hour.toString()[0]!=hour?null:hour='0'+hour;
			let minute = date.getMinutes();
			minute.toString()[0]!=minute?null:minute='0'+minute;
			return month+'/'+day+' '+hour+':'+minute;
		},
		reload: function(){
			this.posts=[];
			this.clear=true;
			this.currentPage=0;
			this.totalPage=0;
			this.allLoaded=false;
			this.getPost();
		},
		loadEnd: function(){
			this.$refs.loadmore.onTopLoaded();
			this.$refs.loadmore.onBottomLoaded();
		},
		goToPost: function(post){
			if(this.loading) return;
			this.saveScroll();
			this.$router.push('/post?id='+post.id);
		},
		saveScroll: function(){
			this.scroll=this.$refs.container.scrollTop;
		},
		loadScroll: function(){
			this.$refs.container.scrollTop=this.scroll;
		},
		createPost: function(){
			this.$router.push('/input');
		}
	},
	mounted(){
		window.bbs=this;
	},
	activated(){
		if(this.posts.length) return;
		this.getPost();
	},
	deactivated(){
		
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mint-loadmore-bottom {
		margin-top: 0.1rem;
		font-size: 0.24rem;
		max-height: 999px;
	}
	.bbs{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background: #444;
		padding: 0.9rem 0.25rem 0;
		box-sizing: border-box;
	}
	.header {
		top: 0;
		/*left: 0;*/
		margin-left: -0.25rem;
		width: 7.5rem;
		padding: 0 0.25rem;
		box-sizing: border-box;
		height: 0.9rem;
		background: #444;
		z-index: 10;
		border-bottom: 0.03rem solid cyan;
		text-align: left;
	}
	.header .title {
		display: inline-block;
		font-size: 0.4rem;
		line-height: 0.9rem;
		color: #eee;
	}
	.header .button {
		display: inline-block;
		width: 0.9rem;
		height: 0.9rem;
		line-height: 0.9rem;
		font-size: 0.7rem;
		font-weight: bold;
		text-align: center;
		float: right;
		color: #eee;
	}
	.post {
		padding: 0.2rem 0.1rem;
		box-sizing: border-box;
	}
	.post + .post {
		border-top: 0.01rem solid #ccc;
	}
	.head {
		font-size: 0;
		margin-bottom: 0.1rem;
	}
	.head .left, .head .right {
		display: inline-block;
		height: 0.3rem;
		line-height: 0.3rem;
		font-size: 0.28rem;
	}
	.head .left {
		width: 4.4rem;
		text-align: left;
	}
	.head .right {
		width: 2.4rem;
		text-align: right;
	}
	.body {
		max-height: 9999px;
		font-size: 0.28rem;
		text-align: left;
	}
</style>
