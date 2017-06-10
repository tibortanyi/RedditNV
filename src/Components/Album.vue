<template>
<div>
	<div style="position: relative;">
		<div class="album-image-title"></div>
	</div>
	<div style="position: relative;">
		<div class="album-image-number">
			{{ currentImageNum+1 }}/{{ album.images_count }}
		</div>
		
		<a :href="image.url"><img :src="image.preview" class="post-image" style="position: relative;"></a>
		
		<div class="changeButtons changeButtons-left" v-on:click="changeImageNum(-1)"></div>
		<div class="changeButtons changeButtons-right" v-on:click="changeImageNum(1)"></div>
	</div>
</div>
</template>

<script>
export default {
	props: ['image'],

	data: () =>({
		//Only use a server to keep ClientID private
		APIMainPoint: 'api/imgurAPI.php?album_id=',
		currentImageNum: -1,
		album: {},
		apiTries: 0,
		elements: {},
		albumId: null
	}),

	created () {
		this.albumId = this.getALbumId(this.image.url);
		this.getAlbum();
	},

	compiled () {
		this.elements = {
			image: this.$el.getElementsByClassName('post-image')[0],
			title: this.$el.getElementsByClassName('album-image-title')[0]
		}
	},

	watch: {
		'currentImageNum'() {
			this.elements.image.src = this.album.images[this.currentImageNum].link;
			this.elements.title.innerHTML = this.album.images[this.currentImageNum].title;
		}
	},

	methods: {
		getAlbum () {
			this.$http
				.get(this.APIMainPoint + this.albumId)
				/* If the client id used locally, just add a header to the request
				.get(this.APIMainPoint + this.albumId, 
					{
						headers: {
							Authorization: 'Client-ID ' + YourClientID
						}
					})*/
				.then(
				(response) => {
					let data = response.json();
					
					if(data.success) {
						this.$set('album', data.data);
						this.currentImageNum = 0;
					} else {
						//if something went wrong try it 5 more times
						if(this.apiTries++ < 5) {
							setTimeout(()=> {
								this.getAlbum();
							}, 500);
						} else {
							console.log('There is something with gettin album infos.');
							console.log(' Please try to refresh.');
						}
					}
				},
				(response) => {
					if(this.apiTries++ < 5) {
						setTimeout(()=> {
							this.getAlbum();
						}, 500);
					} else {
						console.log('There is something with gettin album infos.');
						console.log(' Please try to refresh.');
					}
				});

		},

		getALbumId (url) {
			let newUrl = url.replace(/https?:\/\/imgur\.com\/((a)|(gallery))\//, '');
			return newUrl.replace(/\/.*/, '');
		},

		changeImageNum (dif) {
			let newNum = this.currentImageNum+dif;
			//Check if the new number is valid
			if(newNum >= 0 && newNum < this.album.images_count) {
				this.currentImageNum = newNum;
			}
		}
	}
}
</script>

<style>
.changeButtons {
	height: 100%;
	width: 35px;
	position: absolute;
	top: 0;
	background-color: white;
	opacity: 0;
}

.changeButtons-left {
	background: linear-gradient(to right, #999, #FFF);
	left: 0;
	float: left;
}

.changeButtons-right {
	background: linear-gradient(to right, #FFF, #999);
	right: 0;
	float: right;
}


.changeButtons:hover {
	opacity: 0.2;
	cursor: pointer;
}

.album-image-title {
	max-height: 20px;
	overflow: hidden;
	cursor: pointer;
}

.album-image-number {
	position: absolute;
	right: 0;
	background-color: #FFF;
	top: 0;
	z-index: 20;
}
</style>