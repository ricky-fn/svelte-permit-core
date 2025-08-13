<script lang="ts">
	import "$styles/app.css";

	const { children } = $props();
</script>

<main id="content" class="container mx-auto px-4 py-8 max-w-6xl">
	{@render children?.()}
</main>
