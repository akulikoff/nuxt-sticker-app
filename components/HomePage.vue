<template>
	<div class="home-page">
		<div class="home-page__content">
			<h1 class="home-page__title">Welcome to Nuxt Sticker App</h1>

			<p class="home-page__subtitle">
				Experience the magic of animated components with our interactive cat sticker feature. Built with Nuxt 4, Vue 3 Composition API, and
				modern TypeScript.
			</p>

			<NuxtLink
				to="/sticker"
				class="home-page__cta"
			>
				Try the Sticker Demo
			</NuxtLink>
		</div>
	</div>
</template>

<script setup lang="ts">
useHead({
	title: 'Nuxt Sticker App - Home',
	meta: [
		{
			name: 'description',
			content: 'Welcome to the Nuxt 4 Sticker App - A showcase of advanced Vue 3 Composition API and animated components',
		},
	],
});
</script>

<style lang="scss" scoped>
// Styles are imported from main.scss via the layout
</style>
