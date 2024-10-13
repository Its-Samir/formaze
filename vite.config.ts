import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/package/specific/index.ts"),
			name: "Formaze",
		},
		rollupOptions: {
			external: ["react", "react-dom", "react-hook-form", "zod"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react-hook-form": "ReactHookForm",
					zod: "Zod",
				},
			},
		},
	},
});
