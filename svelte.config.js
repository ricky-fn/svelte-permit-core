import { sveltePreprocess } from "svelte-preprocess";
import autoprefixer from "autoprefixer";
import adapter from '@sveltejs/adapter-cloudflare';

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [autoprefixer]
	}
});

const config = {
	preprocess,
	kit: {
		adapter: adapter({ strict: false })
	}
};

export default config;
