<template>
	<div class="menu abs full overflow-hidden">
		<h1>早上好!</h1>
		<div class="icons">
			<div class="icon person shake1" @click="goto('person')"></div>
			<div class="icon product shake2" @click="goto('product')"></div>
			<div class="icon random shake3" @click="goto('random')"></div>
			<div class="icon my shake4" @click="goto('my')"></div>
			<div class="icon bbs shake5" @click="goto('bbs')"></div>
			<div class="icon feedback shake6" @click="goto('feedback')"></div>
		</div>
		<!-- <textarea  v-model="text"></textarea><br>
		<button @click="speak(text)">说话</button> -->
	</div>
</template>

<script>
import '../../assets/csshake.css';
export default {
	name: 'menu',
	data () {
		return {
			text:''
		}
	},
	methods: {
		speak: function(message){
			this.$router.push('/random');
			return;
		  const msg = new SpeechSynthesisUtterance(message);
			msg.voice = window.speechSynthesis.getVoices()[0];
			window.speechSynthesis.speak(msg);
		},
		goto: function(path){
			this.$router.push('/'+path);
		}
	},
	mounted(){
	},
	activated(){
		// this.showLoading2('#f39800');
	},
	deactivated(){
		// this.hideLoading2();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.menu{
		width: 100%;
		height: 100%;
		padding-top: 1rem;
		box-sizing: border-box;
		background: #444;
	}
	h1 {
		margin: 0.5rem 0;
		color: #ddd;
		font-size: 0.6rem;
	}
	.icons {
		margin-top: 0.8rem;
		padding: 0 1.1rem;
		font-size: 0;
	}
	.icon {
		position: relative;
		display: inline-block;
		width: 2rem;
		height: 2rem;
		margin-bottom: 0.6rem;
	}
	.icon:nth-child(2n) {
		margin-left: 1.3rem;
	}
	.icon:after {
		display: inline-block;
		position: absolute;
		left: 0;
		bottom: -0.45rem;
		width: 100%;
		height: 0.5rem;
		font-size: 0.32rem;
	}
	.person {
		background: url('./image/person2.png');
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
	}
	.person:after {
		content: '名人';
	}
	.product {
		background: url(./image/product3.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
	}
	.product:after {
		content: '代言';
	}
	.random {
		background: url(./image/random1.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
	}
	.random:after {
		content: '偶遇';
	}
	.my {
		background: url(./image/my2.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
	}
	.my:after {
		content: '我的';
	}
	.bbs {
		background: url(./image/bbs1.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
	}
	.bbs:after {
		content: '树洞';
	}
	.feedback {
		background: url(./image/feedback2.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
	}
	.feedback:after {
		content: '反馈';
	}
	.shake1 {
		animation: shake 5.2s 0.3s ease-in-out infinite;
	}
	.shake2 {
		animation: shake 5s 0.1s ease-in-out infinite;
	}
	.shake3 {
		animation: shake 5.1s 0.2s ease-in-out infinite;
	}
	.shake4 {
		animation: shake 5.5s 0.14s ease-in-out infinite;
	}
	.shake5 {
		animation: shake 5.3s 0.25s ease-in-out infinite;
	}
	.shake6 {
		animation: shake 5.6s 0.05s ease-in-out infinite;
	}
	@keyframes person {
		from {
			background: url('./image/person1.png');
			-webkit-background-size: 100% 100%;
			background-size: 100% 100%;
		},
		50% {
			background: url('./image/person2.png');
			-webkit-background-size: 100% 100%;
			background-size: 100% 100%;
		},
		60% {
			background: url('./image/person2.png');
			-webkit-background-size: 100% 100%;
			background-size: 100% 100%;
		},
		70% {
			background: url('./image/person1.png');
			-webkit-background-size: 100% 100%;
			background-size: 100% 100%;
		},
		100% {
			background: url('./image/person2.png');
			-webkit-background-size: 100% 100%;
			background-size: 100% 100%;
		}
	}


	/*textarea {
		width: 6rem;
		height: 2rem;
		font-size: 0.5rem;
	}
	button {
		margin-top: 0.3rem;
		width: 2rem;
		height: 0.8rem;
		font-size: 0.5rem;
	}*/
</style>
