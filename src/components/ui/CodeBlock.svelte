<script lang="ts">
	import { onMount } from 'svelte';
	import type { Highlighter, BundledTheme, BundledLanguage } from 'shiki/bundle/web';

	const { code, lang = 'ts', theme = 'one-dark-pro' } = $props<{
		code: string;
		lang?: BundledLanguage;
		theme?: string;
	}>();

	let html = $state('');
	let mounted = $state(false);

	let highlighterPromise: Promise<Highlighter> | null = null;

	async function ensureHighlighter(lang: BundledLanguage, theme: string): Promise<Highlighter> {
		if (!highlighterPromise) {
			highlighterPromise = (async () => {
				const mod = await import('shiki/bundle/web');
				return mod.createHighlighter({ themes: [theme], langs: [lang] });
			})();
		}
		const h = await highlighterPromise;

		if (!h.getLoadedThemes().includes(theme)) {
			await h.loadTheme(theme as BundledTheme);
		}
		if (!h.getLoadedLanguages().includes(lang)) {
			await h.loadLanguage(lang as BundledLanguage);
		}
		return h;
	}

	onMount(() => {
		mounted = true;
	});

	$effect(() => {
		if (!mounted) return;
		ensureHighlighter(lang, theme).then((h) => {
			html = h.codeToHtml(code, { lang, theme });
		});
	});
</script>

<div class="rounded-xl overflow-x-auto">
	{#if html}
		{@html html}
	{:else}
		<pre><code>{code}</code></pre>
	{/if}
</div>