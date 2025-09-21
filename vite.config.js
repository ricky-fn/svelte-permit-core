import { readFileSync } from "fs";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { timeFormat } from "d3";
import path from "path";
import svg from "vite-plugin-svgstring";
import dsv from "@rollup/plugin-dsv";
import tailwindcss from "@tailwindcss/vite";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const timestamp = timeFormat("%Y-%m-%d-%H:%M")(new Date());

export default defineConfig({
	define: {
		__VERSION__: JSON.stringify(version),
		__TIMESTAMP__: JSON.stringify(timestamp)
	},
	plugins: [sveltekit(), dsv(), svg(), tailwindcss()],
	resolve: {
		alias: {
			$actions: path.resolve("./src/actions"),
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
	},
	ssr: {
		noExternal: ["bits-ui"]
	}
});
