import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
	plugins: [svelte()],
	build: {
		lib: {
			entry: path.resolve(process.cwd(), "src/index.ts"),
			name: "SveltePermitCore",
			fileName: "index",
			formats: ["es"]
		},
		outDir: "lib",
		emptyOutDir: true,
		sourcemap: true,
		rollupOptions: {
			external: [/^svelte(\/.*)?$/, "permit-core"]
		}
	}
});