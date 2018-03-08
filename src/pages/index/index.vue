<template>
	<div class="index abs full overflow-hidden">
		<h2>想对自己或对Ta说的话</h2>
		<textarea></textarea>
	</div>
</template>

<script>
import '../../assets/csshake.css';
export default {
	name: 'index',
	data () {
		return {
			text:''
		}
	},
	methods: {
		
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
	.index {
		width: 100%;
		height: 100%;
		padding: 0.5rem 0.25rem 0;
		box-sizing: border-box;
		background: #fff;
		text-align: left;
	}
	h2 {
		font-size: 0.32rem;
		color: #333;
		margin: 0 0 0.1rem 0;
	}
	textarea {
		box-sizing: border-box;
		padding: 0.1rem;
		border: 0.5px solid #ccc;
		outline: none;
		border-radius: 0.1rem;
		resize: none;
		width: 100%;
		height: 3rem;
		font-size: 0.3rem;
	}
</style>
