<template>
<div style="text-align:center; position:relative;">
	<video v-if="canMp4" v-show="canMp4" loop muted v-on:click="paused = !paused" style="max-width: 100%">
		<source :src="mp4Url()" v-on:error.capture="mp4Error">
	</video>
	<img v-show="!canMp4" :src="image.preview" v-on:click="paused = !paused" style="max-width: 100%">

	<div class="gif-playicon" v-show="paused" v-on:click="paused = !paused">
		<svg width="100" height="100">
			<circle cx="50" cy="50" r="48" stroke="black" stroke-width="5" style="fill: white;opacity: 0.7;"></circle>
			<polygon points="35,25 83,50 35,75" style="stroke:black;stroke-width:5;fill:transparent"></polygon>
		</svg>
	</div>
</div>
</template>

<script>
export default {
	props: ['image'],

	data: () =>({
		paused: true,
		gfyTries: 0,
		canMp4: null	
	}),

	created () {
		this.canMp4 = this.canMp4Check();
	},

	compiled () {
		if(this.image.domain === 'gfycat.com') {
			let id = this.image.url.replace(/.*\.com\//, '');
			this.getGfycat(id);
		} else {
			//only set the state of paused if its not gfycat link
			//the watch triggers sooner then the gfycat video can load, which causes problems
			this.paused = this.$route.name !== 'showpost';
		}

	},

	watch: {
		'paused'() {
			if(this.canMp4) {
				let video = this.$el.getElementsByTagName('video')[0];
				if(this.paused) {
					video.pause();
				} else {
					video.play();
				}
			} else {
				let img = this.$el.getElementsByTagName('img')[0];
				if(this.paused) {
					img.src = this.image.preview;									
				} else {
					img.src = this.image.url;					
				}
			}
		}
	},

	methods: {
		//this method checks the domain if its supports mp4 version instead of gif
		canMp4Check () {
			return	new RegExp('((i\.)?imgur\.com)|(gfycat\.com)|(media\.giphy\.com)').test(this.image.domain)
		},

		mp4Url () {
			if(this.image.domain !== 'gfycat.com'){
				return this.nakedUrl() + '.mp4';
			}  else {
				return '';
			}
		},

		//this method removes the extansion form the end of gif
		nakedUrl () {
			let pattern = new RegExp('\.((gifv?)|(mp4)).*');
			return this.image.url.replace(pattern.exec(this.image.url)[0], '');
		},

		getGfycat(id) {
			this.$http
				.get('http://gfycat.com/cajax/get/' + id)
				.then((response) =>{
					this.$el.getElementsByTagName('source')[0].src = response.json().gfyItem.mp4Url;
					this.$el.getElementsByTagName('video')[0].load();
					this.paused = this.$route.name !== 'showpost';
				},(response) => {
					//If an error happend tries it again for 5 more times
					if(this.gfyTries++ < 5) {
						setTimeout(()=> {
							this.getGfycat(id);
						}, 500);
					} else {
						console.log('There is something with gettin Gfycat infos.');
						console.log(' Please try to refresh.');
					}
				});
		},

		//sometimes imgur mp4s cant be showd because of too much redirect error
		//if that happens replace it with gif
		mp4Error(event) {
			if(new RegExp('(i\.)?imgur\.com').test(this.image.domain)) {
				this.canMp4 = false;
			}
		} 
	}
}
</script>

<style>
.gif-playicon {
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	-ms-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
}
</style>