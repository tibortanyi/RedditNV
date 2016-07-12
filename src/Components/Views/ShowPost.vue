<template>
<div>
<navbar :subreddit="subreddit"></navbar>
<div class="showpost">
	<!-- I dont know why, but the 'wait-for="async-data"' doesnt work.
	Thats my workoround for it -->
	<div v-for="n in ready">
		<post :post="post"></post>
	</div>
</div>
</div>
</template>

<script>
import Post from '../Post.vue';
import Navbar from '../Navbar.vue';

export default {
	components: {
		Post,
		Navbar
	},

	route: {
		data (transition) {
			this.getPost(transition);
		}
	},

	data: () =>({
		post: {},
		ready: 0,
		subreddit: ''
	}),

	methods: {
		getPost (transition) {
			this.$http
				.get('https://www.reddit.com/r/pics/' + this.$route.params.postid + '.json')
				.then(
				(response) => {
					let post  = response.json()[0].data.children[0];
					transition.next({post: post});
					document.title = 'RedditNV | ' + post.data.title;
					this.ready = 1;
					this.subreddit = post.data.subreddit;
				},
				(response) => {
					console.log('There is something wrong with accesing the Reddit API');
				});
		},
	}
}

</script>

<style>
.showpost {
	width: 100%;
	max-width: 900px;
	margin: 50px auto;
	text-align: center;
}
</style>