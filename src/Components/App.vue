<template>
<router-view>
	
</router-view>
<footer-bar></footer-bar>
</template>

<script>
import FooterBar from './Footer.vue';
export default {
	components: {FooterBar},

	replace: false
}
</script>

<style>
* {
	font-family: Arial, Helvetica, sans-serif;
	margin: 0;
	padding: 0;
}

a {
	text-decoration: none;
	color: black;
}

a:hover {
	text-decoration: underline;
}
</style>