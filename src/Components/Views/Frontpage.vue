<template>
<div>
	<navbar :subreddit="subreddit"></navbar>
	<div class="posts" wait-for="async-data">
		<post v-for="post in posts" :post="post"></post>
		<div>
			<a v-link="{name: 'frontpage', query: {count: prevCount(), before: before, sr: subreddit}}" class="nav-button" v-show="before">Prev</a>
			<a v-link="{name: 'frontpage', query: {count: nextCount(), after: after, sr: subreddit}}"  class="nav-button nav-button-right">Next</a>
		</div>
	</div>
</div>
</template>

<script>
import FooterBar from '../Footer.vue';
import Post from '../Post.vue';
import Navbar from '../Navbar.vue';
export default {
	components: {
		FooterBar,
		Post, 
		Navbar
	},

	route: {
		data (transition) {
			this.subreddit = this.$route.query.sr || 'pics';
			document.title = 'RedditNV | R/' + this.subreddit.toUpperCase();
			this.count = parseInt(this.$route.query.count) || 0;
			this.getPosts(transition);
		}
	},

	data:() => ({
		posts: null,
		before: null,
		after: null,
		count: 0,
		subreddit: 'pics',
		asd: 'asd'
	}),

	methods: {
		getPosts (transition) {
			let link = 'https://www.reddit.com/r/'+ this.subreddit +'.json';
			if(this.$route.query.count && (this.$route.query.after || this.$route.query.before)) {
				link+= '?count=' + this.$route.query.count;
				if(this.$route.query.after) {
					link+= '&after=' + this.$route.query.after;
				} else {
					link+= '&before' + this.$route.query.before;
				}
			};

			this.$http
				.get(link)
				.then((response) => {
					let data = response.json().data;
					transition.next({
						posts: data.children,
						after: data.after,
						before: data.before,
					});
				}, (response) => {
					console.log('There is something wrong with accesing the Reddit API');
				});
		},

		nextCount () {
			return this.count+25;
		},

		prevCount () {
			return this.count-25;
		},
	}
}
</script>

<style>
.posts {
	max-width: 700px;
	width: 100%;
	margin: 50px auto 20px auto;
	overflow: hidden;
}

</style>