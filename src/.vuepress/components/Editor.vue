<template>
	<div class="editor-container">
		<div v-if="!initialized" class="loading">
			Initializing editor...
		</div>
		<div v-else class="editor">
			<form class="pane source" method="post" @submit.prevent="run">
				<textarea v-model="source"></textarea>
				<button type="submit">Run script</button>
			</form>
			<pre v-if="output" class="pane output"><code v-text="output"></code></pre>
			<div v-else class="pane output">
				Type your code on the left side of this editor or <a @click="sample">use a sample</a> to get started.
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.editor-container {
	max-width: 100%;

	.loading {
		font-size: 1.2em;
		text-align: center;
	}

	.editor {
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		align-content: stretch;
		background-color: #282c34;
		color: #FFFFFF;
		border-radius: 4px;
		min-height: 500px;
		height: calc(100vh - 250px);
		padding: 8px;

		> .pane {
			min-width: 300px;
			height: 100%;
			flex-grow: 1;
			flex: 50%;
		}

		.pane.source {
			display: flex;
			flex-direction: column;

			textarea {
				width: 100%;
				height: 100%;
				min-height: 25vh;
				background: transparent;
				border: none;
				color: inherit;
			}

			button {
				position: sticky;
				bottom: 8px;
				margin: 0;
				margin-right: 8px;
			}
		}

		.pane.output {
			display: block;
			background-color: rgba(255, 255, 255, 0.1);
			box-sizing: border-box;
			overflow-y: overlay;
			margin: 0;
			padding: 16px;
			border-radius: 4px;
		}
	}
}
</style>

<script>
const PACKAGE = 'https://tutara.dev/wasm/pkg/tutara_wasm.js';
const SAMPLE = `
fun add(a: Int, b: Int): Int {
	return a + b
}

add(1, 5)
`;

export default {
	data() {
		return {
			source: '',
			output: '',
			initialized: false,
			api: null
		}
	},

	async mounted() {
		const module = await import(/* webpackIgnore: true */ PACKAGE);
		const init = module.default;
		await init();

		this.initialized = true;
		this.api = module;
	},

	methods: {
		sample() {
			this.source = SAMPLE.trim();
			this.run();
		},

		async run() {
			const tokens = this.api.get_tokens(this.source).tokens;

			// Needed for JSON.stringify function
			const localTokens = tokens.map(({ token_type, literal, line, column, length }) => ({ token_type, literal, line, column, length }));

			this.output = JSON.stringify(localTokens, null, '    ');
		}
	}
};
</script>