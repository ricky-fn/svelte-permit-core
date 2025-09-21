<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createHighlighter } from 'shiki/bundle/web';
	import type { Highlighter, BundledTheme, BundledLanguage } from 'shiki/bundle/web';

	const { code, lang = 'ts', theme = 'one-dark-pro' } = $props<{
		code: string;
		lang?: BundledLanguage;
		theme?: string;
	}>();

	let html = $state('');
	let mounted = $state(false);
	let instance: Highlighter | null = null;

	let highlighterPromise: Promise<Highlighter> | null = null;

	const ensureHighlighter = async (lang: BundledLanguage, theme: string) => {
		if (!highlighterPromise) {
			highlighterPromise = createHighlighter({ themes: [theme], langs: [lang] });
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
			instance = h;
		});
	});

	onDestroy(() => {
		if (instance) {
			instance.dispose();
		}
	});
</script>

<div class="rounded-xl overflow-x-auto">
	{#if html}
		{@html html}
	{:else}
		<pre><code>{code}</code></pre>
	{/if}
</div>