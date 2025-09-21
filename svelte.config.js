import { sveltePreprocess } from "svelte-preprocess";
import autoprefixer from "autoprefixer";
import adapter from '@sveltejs/adapter-cloudflare';
import path from "path";

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [autoprefixer]
	}
});

const config = {
	preprocess,
	kit: {
		adapter: adapter(),
		alias: {
			$components: path.resolve("./src/components"),
			$constants: path.resolve("./src/constants"),
			$lib: path.resolve("./src/lib"),
			$stores: path.resolve("./src/stores"),
			$routes: path.resolve("./src/routes"),
			$runes: path.resolve("./src/runes"),
			$styles: path.resolve("./src/styles"),
			$svg: path.resolve("./src/svg"),
			$utils: path.resolve("./src/utils")
		}
	}
};

export default config;
