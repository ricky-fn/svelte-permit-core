<script lang="ts">
	import Fa from "svelte-fa";
	import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";

	const { title, description }: { title: string; description: string } = $props();
</script>

<header class="text-center mb-12">
	<h1 class="text-4xl md:text-5xl font-bold mb-4">
		<Fa icon={faShieldAlt} class="mr-3 inline-block" />
		<span class="gradient-text">{title}</span>
	</h1>
	<p class="text-lg text-gray-600 max-w-2xl mx-auto">
		{description}
	</p>
</header>
