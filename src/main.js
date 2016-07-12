import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VueResource from 'vue-resource';
Vue.use(VueResource);

//Views
import Frontpage from './Components/Views/Frontpage.vue';
import ShowPost from './Components/Views/ShowPost.vue';

import App from './Components/App.vue';

const router = new VueRouter();

router.map({
	'/': {
		component: Frontpage,
		name: 'frontpage'
	},

	'/post/:postid': {
		component: ShowPost,
		name: 'showpost'
	}
});

router.beforeEach(function (transition) {
  window.scrollTo(0, 0);
  transition.next();
});

router.start(App, 'body');