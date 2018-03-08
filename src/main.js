// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Loadmore } from 'mint-ui';
Vue.component(Loadmore.name, Loadmore);
// import VueAwesomeSwiper from 'vue-awesome-swiper'
// Vue.use(VueAwesomeSwiper)
import './ui/ui-init.js'
import './util/tool'

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App },
	data(){
		return {
			innerWidth: '',
			innerHeight: ''
		}
	},
	methods:{
		// 把显示or隐藏加载框/吐司框的方法暴露到window对象上,而不把Vue的实例暴露出去
		bindUI: function(){
			let ui={
				showLoading: this.showLoading.bind(this),
				hideLoading: this.hideLoading.bind(this),
				showLoading2: this.showLoading2.bind(this),
				hideLoading2: this.hideLoading2.bind(this),
				showToast: this.showToast.bind(this),
				hideToast: this.hideToast.bind(this),
				showAlert: this.showAlert.bind(this),
				hideAlert: this.hideAlert.bind(this),
				showQrcode: this.showQrcode.bind(this),
				hideQrcode: this.hideQrcode.bind(this),
				showModal: this.showModal.bind(this),
				hideModal: this.hideModal.bind(this)
			}
			window.ui=ui;
		},
		// 跳转到发起页面(ic里的customerId是自己)
		// 跳转到助力页面(ic里的customerId是别人)
		// 跳转到领奖页面(如果url里携带了正确的参数)
		redirect: function(){
			let ic = this.$util.getQueryString('ic');
			let newFlag = this.$util.getQueryString('new');
			if (newFlag) {
				this.$router.push('/wish');
			} else if (ic && ic.split('|')[1]==this.user.customerId) {
				this.$router.push('/wish');
			} else if (ic && ic.split('|')[1]!=this.user.customerId) {
				this.$router.push('/help');
			}
		},
		onResize: function(){
			this.innerWidth=window.innerWidth;
			this.innerHeight=window.innerHeight;
			window.onresize=()=>{
				let w=window.innerWidth;
				let h=window.innerHeight;
				let app_container=document.getElementById('webapp_container');
				if(window.isPC){
					app_container.className='pc';
					app_container.style.width = h*9/16+'px';
					window.html.style.fontSize = h*9/16/7.5+'px';
				} else {
					if(h>0.5*w){
						app_container.className='';
						app_container.removeAttribute('style');
						window.html.style.fontSize = w/7.5+'px';
					} else {
						app_container.className='pc';
						app_container.style.width = h*9/16+'px';
						window.html.style.fontSize = h*9/16/7.5+'px';
					}
				}
				this.innerWidth=w;
				this.innerHeight=h;
			}
		}
	},
	mounted: function(){
		window.vm_=this;
		this.onResize();
		this.bindUI();
		// this.login();
		// this.getActivityDetail();
		this.$util.shareDeny();
		// 将浏览器默认字体大小恢复至默认
		{
			if (typeof WeixinJSBridge === 'undefined') {
				document.addEventListener('WeixinJSBridgeReady', ()=>{
					// this.showToast('开始重置字体大小',null);
					this.resetFontSize();
				});
			} else {
				this.resetFontSize();
			}
		}
	}
})
