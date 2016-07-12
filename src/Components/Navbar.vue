<template>
<navbar class="navbar">
	<div class="navbar-inner">
		<span class="frontpage-link"><a v-link="{name: 'frontpage'}">RedditNV </span></a>
		<span>Subreddit: </span>
		<input type="text" class="subreddit-input" value="{{subreddit}}" v-on:keydown.enter="changeSubreddit">
		<button v-on:click="changeSubreddit">Change</button>
	</div>
</navbar>
</template>

<script>
export default {
	props: ['subreddit'],

	methods: {
		changeSubreddit () {
			this.$router.go({
				name: 'frontpage',
				query: {
					sr: this.$el.getElementsByClassName('subreddit-input')[0].value
				}
			});
		}
	},
}
</script>

<style>
.navbar {
	width: 100%;
	text-align: center;
	position: fixed;
	background-color: #F9F9F9;
	top: 0;
	padding: 10px;
	z-index: 300;
	height: 25px;
}

.navbar button {
	background-color: #52AEC9;
	border: 2px solid #52AEC9;
	padding: 2px;
	color: white;
	font-weight: bold;
	cursor: pointer;
}

.navbar button:hover {
	background-color: white;
	color: #52AEC9;
}

.navbar-inner {
	max-width: 700px;
	margin: 0 auto;
}

.frontpage-link {
	float: left;
	font-size: 1.2em;
}

.nav-button {
	font-size: 1.5em;
}

.nav-button:hover {
	text-decoration: underline;
}

.nav-button-right {
	float: right;
}
</style>