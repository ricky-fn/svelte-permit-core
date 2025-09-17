<script lang="ts">
	import type { Snippet } from "svelte";
	import classNames from "classnames";
	
	const { title, icon, class: className, onClick }: { title: string; icon: Snippet; class?: string; onClick: () => void } = $props();
</script>

<button class={classNames("feature-tab rounded-lg p-4 text-center border border-gray-200", className)} onclick={onClick}>
	{@render icon?.()}
	<h3 class="font-semibold">{title}</h3>
</button>
