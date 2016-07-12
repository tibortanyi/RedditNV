<template>
<a :href="image.url"><img :src="image.preview" alt="" class="post-image"></a>
</template>

<script>
	export default {
		props: ['image']
	}
</script>

<style>
</style>

