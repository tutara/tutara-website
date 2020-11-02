<template>
	<div class="editor-container">
		<div v-if="!initialized" class="loading">
			Initializing editor...
		</div>
		<div v-else class="editor">
			<nav class="tab-header">
				<button :class="{ active: tab == 'source' }" @click="tab = 'source'" v-show="!alwaysShowSource">Source</button>
				<button :class="{ active: tab == 'tokens' }" @click="tab = 'tokens'">Tokens</button>
				<button :class="{ active: tab == 'statements' }" @click="tab = 'statements'">Statements</button>
			</nav>
			<div class="tabs">
				<form v-show="tab == 'source' || alwaysShowSource" class="tab source" method="post" @submit.prevent="run">
					<div class="help" v-if="!source">
						Enter your code in this editor and click "Run script" to get started.<br />
						Or <a @click="sample">start with a sample script</a>.
					</div>
					<textarea v-model="source"></textarea>
					<button type="submit">Run script</button>
				</form>
				<div v-show="tab == 'tokens'" class="tab">
					<pre v-if="!tokensErr" class="output"><code v-text="tokens"></code></pre>
					<div v-else class="error">
						<strong v-text="tokensErr.message"></strong>
						<pre v-text="tokensErr"></pre>
					</div>
				</div>
				<div v-show="tab == 'statements'" class="tab">
					<pre v-if="!statementsErr" class="output"><code v-text="statements"></code></pre>
					<div v-else class="error">
						<strong v-text="statementsErr.message"></strong>
						<pre v-text="statementsErr"></pre>
					</div>
				</div>
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
		height: calc(100vh - 250px);
		display: flex;
		flex-direction: column;

		.tab-header {
			margin-left: auto;
			margin-right: 8px;

			button {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
				border-top-left-radius: 8px;
				border-top-right-radius: 8px;
				margin: 0;
				background-color: rgb(62, 66, 73);
				outline: none;
				font-size: .9em;
				padding: .25em 1em;

				&:hover {
					background-color: rgb(72, 75, 82);
				}

				&.active {
					color: #3eaf7c;
				}
			}
		}

		.tabs {
			height: 100%;
			overflow-y: hidden;
			flex: auto;
			display: flex;
			flex-direction: row;
			background-color: #282c34;
			color: #FFFFFF;
			border-radius: 4px;
			padding: 8px;

			.tab {
				height: 100%;
				flex: auto;

				&.source {
					display: flex;
					flex-direction: column;
					position: relative;

					.help {
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						position: absolute;
						pointer-events: none;
						padding: 8px;
						line-height: 1.5em;
						
						a {
							pointer-events: all;
							cursor: pointer;
						}
					}

					textarea {
						width: 100%;
						height: 100%;
						min-height: 25vh;
						background: transparent;
						border: none;
						color: inherit;
						padding: 8px;
					}

					button {
						position: sticky;
						bottom: 8px;
						margin: 0;
						margin-right: 8px;
					}
				}

				.output {
					display: block;
					background-color: rgba(255, 255, 255, 0.1);
					box-sizing: border-box;
					overflow-y: overlay;
					margin: 0;
					padding: 16px;
					border-radius: 4px;
					height: 100%;
				}

				.error {
					background-color: #4d0000;
					border-radius: 4px;
					padding: 16px;

					strong {
						font-size: 1.2em;
					}

					pre {
						background: transparent;
						padding: 0;
					}
				}
			}
		}
	}
}
</style>

<script>
const PACKAGE = 'https://tutara.dev/wasm/pkg/tutara_wasm.js';
const SAMPLE = `fun: Int add(a: Int, b: Int) {
	return a + b
}

add(1, 5)`;

export default {
	data() {
		return {
			initialized: false,
			api: null,

			source: '',
			tokens: null,
			tokensErr: null,
			statements: null,
			statementsErr: null,

			tab: null,
			alwaysShowSource: true,
		}
	},

	async mounted() {
		this.resize();

		const module = await import(/* webpackIgnore: true */ PACKAGE);
		const init = module.default;
		await init();

		this.initialized = true;
		this.api = module;
	},

	methods: {
		resize() {
			this.alwaysShowSource = !matchMedia('(max-width: 1000px)').matches;
			this.tab = this.tab || this.alwaysShowSource ? 'tokens' : 'source';
		},

		sample() {
			this.source = SAMPLE.trim();
			this.tab = 'tokens';
			this.run();
		},

		async run() {
			const instance = this.api.from_source(this.source);

			try {
				const tokens = instance.get_tokens();
				this.tokens = JSON.stringify(tokens, null, '    ');
				this.tokensErr = null;
			} catch (err) {
				this.tokens = null;
				this.tokensErr = err;
			}
			
			try {
				const statements = instance.get_statements();
				this.statements = JSON.stringify(statements, null, '    ');
				this.statementsErr = null;
			} catch (err) {
				this.statements = null;
				this.statementsErr = err;
			}
		}
	}
};
</script>