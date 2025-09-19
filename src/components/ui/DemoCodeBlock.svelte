<script lang="ts">
	import CodeBlock from "$components/ui/CodeBlock.svelte";
	import Fa from "svelte-fa";
	import { faCode } from "@fortawesome/free-solid-svg-icons";
	import type { BundledLanguage } from "shiki/bundle/web";
	import classNames from "classnames";
    const { configs }: { configs: { title: string; lang: BundledLanguage; code: string }[] } = $props();
</script>

<div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm col-span-2">
	<h2
		class="text-2xl font-bold text-primary flex items-center gap-3 mb-6 pb-4 border-b border-gray-100"
	>
		<Fa icon={faCode} class="mr-3" />
		Demo Code Examples
	</h2>

	{#each configs as config, index}
		<div class={classNames({"mb-6": index !== configs.length - 1})}>
			<h3 class="text-lg font-semibold text-gray-800 mb-3">{config.title}</h3>
			<CodeBlock code={config.code} lang={config.lang} />
		</div>
	{/each}
</div>