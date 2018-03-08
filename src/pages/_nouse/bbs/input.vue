<template>
	<div class="input abs full overflow-hidden" ref="container">
		<div class="header fixed">
			<div class="title" v-if="type=='post'">树洞</div>
			<div class="title" v-if="type=='reply'">{{'回复'+fillNum($route.query.postId)}}</div>
			<div class="button new-post" @click="send()">📩</div>
		</div>
		<div class="comment abs full overflow-hidden">
			<textarea class="textarea" v-model="content"></textarea>
		</div>
	</div>
</template>

<script>
export default {
	name: 'input',
	data () {
		return {
			content:'',
			type:''
		}
	},
	methods: {
		checkParam: function(){
			if(this.$route.query.postId){
				this.type='reply';
				if(this.$route.query.replyId){
					console.log(this.$route.query.replyId)
					this.content='>>'+this.fillNum(this.$route.query.replyId)+'\n';
				}
			} else {
				this.type='post';
			}
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
		send: function(){
			let content=this.content.toString().trim();
			if(content.length==0){
				this.showToast('内容不能为空',null,true);
				return;
			}
			let url='';
			if(this.type=='post'){
				url='bbs/createPost';
			} else {
				url='bbs/createReply';
			}
			let json={
				content
			}
			let name=localStorage.bbsName;
			name && (json.name=name);
			this.type=='reply' && (json.postId=+this.$route.query.postId);
			this.$util.ajax(url,'post',json).then(res=>{
				if(res.code=='100000'){
					this.showToast('成功',null,true);
					this.content='';
					name==null && (localStorage.bbsName=res.data.name);
					this.$router.back();
				}
			})
		}
	},
	mounted(){
		window.input=this;
	},
	activated(){
		this.checkParam();
	},
	deactivated(){
		this.content='';
		this.type='';
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.input{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background: #50616d;
		box-sizing: border-box;
	}
	.header {
		top: 0;
		left: 0;
		width: 100%;
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
	.textarea {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0 0.1rem;
		background: none;
		border: none;
		resize: none;
		padding-top: 1rem;
		font-size: 0.3rem;
		color: #fff;
	}
</style>
