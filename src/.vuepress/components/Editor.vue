<template>
	<div class="editor">
		<div v-if="!initialized">
			Initializing editor...
		</div>
		<form v-else method="post" id="form" @submit.prevent="run">
			<textarea v-model="source"></textarea>
			<button type="submit">Run script</button>
		</form>
		<pre v-if="output"><code v-text="output"></code></pre>
	</div>
</template>
<script>
const PACKAGE = 'https://tutara.dev/wasm/pkg/tutara_wasm.js';

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
		async run() {
			const tokens = this.api.get_tokens(this.source).tokens;

			// Needed for JSON.stringify function
			const localTokens = tokens.map(({ token_type, literal, line, column, length }) => ({ token_type, literal, line, column, length }));

			this.output = JSON.stringify(localTokens, null, '    ');
		}
	}
};
</script>