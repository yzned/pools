import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: "./src/scheme.graphql",
	documents: "src/**/*.ts",
	generates: {
		"src/gql/": {
			preset: "client",
			plugins: ["typescript", "typescript-operations"],
		},
	},
};

export default config;
