<template>
	<div class="random abs full overflow-hidden">
		<transition name="fade-up">
			<div class="buttons" v-show="list.length==0">
				<p>客官, 你要看什么?</p>
				<div class="button" @click="getRandomPerson()">明星</div>
				<div class="button" @click="getRandomProduct()">商品</div>
				<div class="button" @click="getRandomMix()">随便吧...</div>
			</div>
		</transition>
		<transition name="fade">
			<div v-show="list.length">
				<div class="card card1 abs" v-if="list[card1.index]" :class="card1.display?'':'hide'" @touchstart="onTouchstart1" @touchmove="onTouchmove1" @touchend="onTouchend1" :style="'z-index:'+card1.z+'; transform: translateX('+card1.xOffset+'px);'">
					<div class="rel">
						<div class="go go-left" @click="cardLeaveLeft(card1)"><== like</div>
						<div class="go go-right" @click="cardLeaveRight(card1)">diss ==></div>
						<div>{{list[card1.index]?list[card1.index].name:''}}</div>
					</div>
				</div>
				<div class="card card2 abs" v-if="list[card2.index]" :class="card2.display?'':'hide'" @touchstart="onTouchstart2" @touchmove="onTouchmove2" @touchend="onTouchend2" :style="'z-index:'+card2.z+'; transform: translateX('+card2.xOffset+'px);'">
					<div class="rel">
						<div class="go go-left" @click="cardLeaveLeft(card2)"><== like</div>
						<div class="go go-right" @click="cardLeaveRight(card2)">diss ==></div>
						<div>{{list[card2.index]?list[card2.index].name:''}}</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'random',
	data () {
		return {
			width: window.innerWidth,
			card1: {
				index:99,
				display:true,
				z:999,
				xStart:0,
				xEnd:0,
				xOffset:0
			},
			card2: {
				index:100,
				display:true,
				z:998,
				xStart:0,
				xEnd:0,
				xOffset:0
			},
			list: []
		}
	},
	methods: {
		getRandomProduct: function(){
			this.$util.ajax('product/random','post',null).then(res=>{
				if(res.code==='100000'){
					this.list = res.data;
					this.mountCard();
				}
			})
		},
		getRandomPerson: function(){
			this.$util.ajax('person/random','post',null).then(res=>{
				if(res.code==='100000'){
					this.list = res.data;
					this.mountCard();
				}
			})
		},
		getRandomMix: function(){
			this.$util.ajax('product/randomMix','post',null).then(res=>{
				if(res.code==='100000'){
					this.list = res.data;
					this.mountCard();
				}
			})
		},
		onTouchstart1: function(e){
			this.card1.xStart = e.touches[0].clientX;
		},
		onTouchmove1: function(e){
			let x=e.changedTouches[0].clientX;
			let card=this.card1;
			card.xOffset = x-card.xStart;
		},
		onTouchend1: function(e){
			let x=e.changedTouches[0].clientX;
			let card=this.card1;
			card.xStart=0;
			card.xEnd=0;
			if(card.xOffset>0.25*this.width){
				this.diss(card);
			} else if(card.xOffset<-0.25*this.width){
				this.like(card);
			} else {
				card.xOffset=0;
			}
		},
		onTouchstart2: function(e){
			this.card2.xStart = e.touches[0].clientX;
		},
		onTouchmove2: function(e){
			let x=e.changedTouches[0].clientX;
			let card=this.card2;
			card.xOffset = x-card.xStart;
		},
		onTouchend2: function(e){
			let x=e.changedTouches[0].clientX;
			let card=this.card2;
			card.xStart=0;
			card.xEnd=0;
			if(card.xOffset>0.25*this.width){
				this.diss(card);
			} else if(card.xOffset<-0.25*this.width){
				this.like(card);
			} else {
				card.xOffset=0;
			}
		},
		diss: function(card){
			let item=this.list[card.index];
			let url='';
			let json={id:item.id,action:'diss'};
			if(item.hasOwnProperty('categoryId')){
				url='product/likeOrDiss';
			} else {
				url='person/likeOrDiss';
			}
			this.$util.ajax(url,'post',json).then(res=>{
				if(res.code==='100000'){
					// this.showToast('success',null);
				} else {

				}
			})
			card.xOffset=this.width;
			this.resetCard(card);
		},
		like: function(card){
			let item=this.list[card.index];
			let url='';
			let json={id:item.id,action:'like'};
			if(item.hasOwnProperty('categoryId')){
				url='product/likeOrDiss';
			} else {
				url='person/likeOrDiss';
			}
			this.$util.ajax(url,'post',json).then(res=>{
				if(res.code==='100000'){
					// this.showToast('success',null);
				} else {

				}
			})
			card.xOffset=-this.width;
			this.resetCard(card);
		},
		resetCard: function(card){
			setTimeout(()=>{
				card.display=false;
				card.xOffset=0;
				card.z-=2;
				card.index+=2;
			},500)
			setTimeout(()=>{
				card.display=true;
				if(this.checkIfEnd()){
					console.log('end...');
					this.list=[];
				}
			},550)
		},
		checkIfEnd: function(){
			let index1=this.card1.index;
			let index2=this.card2.index;
			if(this.list[index1] || this.list[index2]){
				return false;
			} else {
				return true;
			}
		},
		mountCard: function(){
			this.card1.index=0;
			this.card2.index=1;
		}
	},
	mounted(){
		window.random=this;
		this.mountCard();
	},
	activated(){
		// this.showLoading2('#f39800');
		this.list=[];
		//this.getRandomProduct();
	},
	deactivated(){
		// this.hideLoading2();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.random{
		width: 100%;
		height: 100%;
		background: #444;
		padding-top: 1rem;
		box-sizing: border-box;
	}
	.buttons {
		margin-top: 1rem;
	}
	.button {
		width: 3rem;
		height: 0.8rem;
		line-height: 0.8rem;
		background: blue;
		margin: 0.3rem auto;
		border-radius: 0.2rem;
	}
	.card {
		width: 6rem;
		height: 8rem;
		left: 0.75rem;
		top: 1rem;
		transition: all 0.15s;
	}
	.card .rel {
		width: 6rem;
		height: 8rem;
	}
	.card.card1 {
		background: navy;
	}
	.card.card2 {
		background: darkred;
	}
	.go {
		display: inline-block;
		width: 1.3rem;
		height: 0.6rem;
		line-height: 0.6rem;
		padding: 0.2rem 0.2rem;
		margin: 0 0.3rem;
	}
</style>
