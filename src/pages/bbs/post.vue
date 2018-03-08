<template>
	<div class="posts abs full overflow-x-hidden" ref="container">
		<transition name="fade-quickly">
			<div class="mask" v-show="isShowingMask" @click="hideMask()">
				<div class="detail" v-if="detail.id">
					<div class="head">
						<div class="left">
							<span>{{convertTime(detail.time)}}</span>&nbsp;
							<span>{{detail.name}}</span>
						</div>
						<div class="right">
							Re.<span>{{fillNum(detail.id,5)}}</span>
						</div>
					</div>
					<div class="body">{{detail.content}}</div>
				</div>
			</div>
		</transition>
		<div class="header fixed">
			<div class="title" v-if="$route.query.id">{{'Po.'+fillNum($route.query.id)}}</div>
			<div class="button new-post" @click="replyPost()">+</div>
		</div>
		<transition name="fade-quickly">
			<mt-loadmore :top-method="reload" :bottom-method="getReply" :bottom-all-loaded="allLoaded" :autoFill="false" :bottomDistance="0" :bottomPullText="'加载更多'" ref="loadmore" v-show="main.id">
				<div class="post main" @click="showMainOptions()" v-if="main.id">
					<div class="head">
						<div class="left">
							<span>{{convertTime(main.time)}}</span>
							<span>{{main.name}}</span>
						</div>
						<div class="right">
							Po.<span>{{fillNum(main.id)}}</span>
						</div>
					</div>
					<input class="abs" type="text" :value="main.content" :id="'post'+main.id">
					<div class="body">{{main.content}}</div>
					<div class="options rel" :class="main.expand?'active':''">
						<div class="option" :id="'post'+main.id+'copy'" :data-clipboard-target="'#post'+main.id" @click="copySuccess()">复制</div><div class="option" @click="replyPost()">回复</div>
					</div>
				</div>
				<div class="post" v-for="reply in replys" @click="showOptions(reply)">
					<div class="head">
						<div class="left">
							<span>{{convertTime(reply.time)}}</span>&nbsp;
							<span :class="reply.name==main.name?'green':''">{{reply.name}}</span>
						</div>
						<div class="right">
							Re.<span>{{fillNum(reply.id,5)}}</span>
						</div>
					</div>
					<input class="abs" type="text" :value="reply.content" :id="'reply'+reply.id">
					<div class="refer" v-if="reply.refer">
						<a href="javascript:void(0);" @click.stop="showMask(reply.refer)">
							{{'>>'+fillNum(reply.refer)}}
						</a>
					</div>
					<div class="body" :id="'reply'+reply.id">{{reply.content}}</div>
					<div class="options rel" :class="reply.expand?'active':''">
						<div class="option reply-copy" :data-clipboard-target="'#reply'+reply.id" @click="copySuccess()">复制</div><div class="option" @click="replyAnother(reply.id)">回复</div>
					</div>
				</div>
				<div slot="top" class="mint-loadmore-top"></div>
				<div slot="bottom" class="mint-loadmore-bottom" v-show="main.id">
					<span v-show="!allLoaded" @click="getReply">加载更多</span>
					<span v-show="allLoaded" @click="reload">没有更多啦,点击刷新</span>
				</div>
			</mt-loadmore>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'post',
	data () {
		return {
			loading: false,
			postId:0,
			main:{},
			replys:[],
			detail:{},
			currentPage:0,
			totalPage:0,
			allLoaded: false,
			isShowingMask: false
		}
	},
	methods: {
		getReply: function(){
			if(this.allLoaded){
				return;
			}
			this.loading=true;
			this.currentPage++;
			this.$util.ajax('bbs/queryReply','post',{
				postId: this.postId,
				currentPage: this.currentPage,
				pageSize: 10
			}).then(res=>{
				if(res.code=='100000'){
					res.data.main.expand = this.main.expand || false;
					this.main.id?null:this.main=res.data.main;
					let list = res.data.list;
					list.forEach(i=>{
						i.expand=false;
						i.refer=null;
						processContent(i);
					});
					this.replys=this.replys.concat(list);
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
					this.$nextTick(this.initCopyBtn);
				}
				this.loading=false;
			}).catch(err=>{
				this.loading=false;
			})
			function processContent(reply){
				let content = reply.content;
				let index = reply.content.indexOf('>>');
				if(index!=-1 && +content.substring(index+2,index+7)>0){
					let refer=+content.substring(index+2,index+7);
					let newContent = content.substring(0,index) + content.substring(index+7);
					reply.content = newContent.trim();
					reply.refer = refer;
				}
			}
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
		fillNum: function(input, num=5){
			let i=input.toString();
			if(i.length<num){
				let count=num-i.length;
				let zero='0';
				zero=zero.repeat(count);
				i=zero+i;
			}
			return i;
		},
		reload: function(){
			this.main={};
			this.replys=[];
			this.currentPage=0;
			this.totalPage=0;
			this.allLoaded=false;
			this.getReply();
			this.$refs.container.scrollTop=0;
		},
		loadEnd: function(){
			this.$refs.loadmore.onTopLoaded();
			this.$refs.loadmore.onBottomLoaded();
		},
		showMainOptions: function(){
			if(this.loading) return;
			this.main.expand = !this.main.expand;
			this.replys.forEach(r=>{r.expand=false});
		},
		showOptions: function(reply){
			this.main.expand = false;
			if(this.loading) return;
			let flag = !reply.expand;
			this.replys.forEach(r=>{r.expand=false});
			reply.expand = flag;
		},
		initCopyBtn: function(){
			new Clipboard('#post'+this.main.id+'copy');
			new Clipboard('.reply-copy');
		},
		copySuccess: function(){
			this.showToast('已复制到剪贴板',null,true)
		},
		replyPost: function(){
			this.$router.push('/input?postId='+this.$route.query.id);
		},
		replyAnother: function(replyId){
			this.$router.push('/input?postId='+this.$route.query.id+'&replyId='+replyId);
		},
		showMask: function(replyId){
			let detail=this.replys.find(r=>r.id==replyId);
			this.detail=JSON.parse(JSON.stringify(detail));
			this.isShowingMask=true;
		},
		hideMask: function(){
			this.isShowingMask=false;
		}
	},
	mounted(){
		window.reply=this;
	},
	activated(){
		this.postId = this.$route.query.id;
		this.getReply();
	},
	deactivated(){
		this.main={};
		this.replys=[];
		this.currentPage=0;
		this.totalPage=0;
		this.allLoaded=false;
		this.isShowingMask=false;
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
	.posts{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background: #444;
		padding: 0 0.25rem;
		box-sizing: border-box;
		overflow-y: scroll;
	}
	.mask {
		position: fixed;
		width: 7.5rem;
		height: 100%;
		margin-left: -0.25rem;
		background: rgba(0,0,0,0.5);
		z-index: 11;
	}
	.mask .detail {
		width: 6.5rem;
		margin-top: 4rem;
		margin-left: 0.5rem;
		background: #111;
		padding: 0.15rem 0.1rem;
		box-sizing: border-box;
	}
	.detail .head .left {
		width: 4rem;
		text-align: left;
	}
	.detail .head .right {
		width: 2.3rem;
		text-align: right;
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
		padding: 0.2rem 0.1rem 0.04rem;
		box-sizing: border-box;
	}
	.main {
		margin-top: 0.9rem;
	}
	.main + .post {
		border-top: 0.01rem solid #ccc;
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
	.refer {
		max-height: 9999px;
		font-size: 0.28rem;
		text-align: left;
		margin-bottom: 0.06rem;
	}
	.refer a {
		color: cyan;
		font-size: 0.28rem;
		text-decoration: underline;
	}
	.body {
		max-height: 9999px;
		font-size: 0.28rem;
		text-align: left;
	}
	input.abs {
		transform: scale(0.01);
		opacity: 0;
		left: -0.5rem;
	}
	.options {
		font-size: 0;
		padding-top: 0.1rem;
		height: 0;
		overflow: hidden;
		transition: all 0.3s;
	}
	.options.active {
		height: 0.62rem;
	}
	.option {
		display: inline-block;
		width: 50%;
		box-sizing: border-box;
		font-size: 0.32rem;
		padding: 0.1rem 0 0.1rem;
	}
	.option + .option {
		border-left: 0.01rem solid #ccc;
	}

	.comment {
		top: 0;
		left: 0;
		background: #50616d;
	}
	.comment textarea {
		width: 100%;
		height: 100%;
		background: none;
		border: none;
		resize: none;
	}
</style>
