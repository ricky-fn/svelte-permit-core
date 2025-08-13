<script lang="ts">
	import type { Snippet } from "svelte";

  const { title, description, icon }: { title: string, description: string, icon: Snippet } = $props();
</script>

<div
	class="bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
	<h3 class="text-xl font-semibold text-primary flex items-center gap-3 mb-4">
		<span
			class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"
		>
			{@render icon?.()}
		</span>
		{title}
	</h3>
	<p class="text-gray-600">
		{description}
	</p>
</div>
