<template>
<!-- Only show the post if there is a preview -->
<div class="post" v-if="image.preview">
	<div class="post-title">
		<a v-link="{name: 'showpost', params: {'postid': post.data.id}}" title="{{post.data.title}}">
			<!-- The post's title is alredy escaped so use 3 brackets -->
			{{{post.data.title}}}
		</a>
	</div>
	<div class="image-container">
		<component :is="component" :image="image" ></component>
	</div>
	<div style="margin: 10px 5px; overflow: hidden;">
		<span style="float: left;">
			<a :href="'https://www.reddit.com' + post.data.permalink">{{post.data.ups}} Points | 
			{{post.data.num_comments}} Comments</a>
		</span>
		<span style="float: right;">by {{post.data.author}}</span>
	</div>
	<hr style="width: 80%; margin: 10px auto;" />
</div>
</template>

<script>
import Album from './Album.vue';
import Gif from './Gif.vue';
import Image from './Image.vue';

export default {
	components: {
		Album,
		Gif,
		Image
	},

	props: ['post'],

	data:() => ({
		image: {},
		component: null
	}),

	created() {
		if(this.post.data.domain === 'i.reddituploads.com') {
			this.post.data.url = this.removeAmp(this.post.data.url);
		}
		let image = {};

		//if the post doesnt have preview then return
		if(!this.getPreviewLink()) return;
		image.preview = this.removeAmp(this.getPreviewLink());
		
		image.domain = this.post.data.domain;
		image.url = this.post.data.url;

		this.component = this.getComponent(image.url);

		this.image = image;
	},

	methods: {
		getPreviewLink (url) {
			if(this.post.data.preview) return this.post.data.preview.images[0].source.url;

			if(this.post.data.media) return this.post.data.media.oembed.thumbnail_url;

			if(this.post.data.domain == 'imgur.com') return this.post.data.url + '.jpg';

			return false;
		},

		isAlbum:(url) =>(
			new RegExp('^https?://imgur\.com/(a)|(gallery)/').test(url)
		),

		isGif:(url) => (
			new RegExp('(\.((gifv?)|(mp4))$)|(gfycat\.com)').test(url)
		),

		getComponent (url) {
			if(this.isAlbum(url)) return 'Album';

			if(this.isGif(url)) return 'Gif';
			
			return 'Image';
		},

		//previews from reddit's server sometimes have some 'amp;' which makes the url dead
		removeAmp: (url) =>(
			url.replace(/amp;/g, '')
		)
	}
}
</script>

<style>
.image-container {
	text-align: center;
}

.post {
	margin-bottom: 25px;
}

.post-image {
	max-width: 100%;
}

.post-title {
	font-size: 1.5em;	
}

.post-title a:hover {
	text-decoration: none;
}

</style>