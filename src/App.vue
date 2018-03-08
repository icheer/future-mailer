<template>
	<div id="app" class="rel full">
		<keep-alive>
			<router-view/>
		</keep-alive>
		<loading></loading>
		<loading2></loading2>
		<toast></toast>
		<alert></alert>
		<modal></modal>
		<qrcode></qrcode>
	</div>
</template>

<script>
import FastClick from 'fastclick';
FastClick.attach(document.body);
// http://www.mamicode.com/info-detail-2084691.html
import './assets/style.css'
import Loading from './ui/loading/loading.vue';
import Loading2 from './ui/loading2/loading2.vue';
import Toast from './ui/toast/toast.vue';
import Alert from './ui/alert/alert.vue';
import Modal from './ui/modal/modal.vue';
import Qrcode from './ui/qrcode/qrcode.vue';
export default {
	name: 'app',
	components: {
		Loading,
		Loading2,
		Toast,
		Alert,
		Modal,
		Qrcode
	},
	watch: {
		$route(to,from){
			window.weixinShare && window.weixinShare.shareDeny();
		}
	}
}
</script>

<style>
#app {
	width: 100%;
	height: 100%;
	overflow: hidden;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #ccc;
	font-size: 0.3rem;
}
</style>
