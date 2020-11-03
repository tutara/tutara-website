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
					<PrismEditor
						class="code"
						v-model="source"
						:highlight="highlight"
						:insertSpaces="false"
						:tabSize="1"
						line-numbers
					></PrismEditor>
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

					.code {
						height: 100%;
						font-size: 14px;
						line-height: 1.5;
						padding: 0;
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

.code /deep/ .token {
	&.Integer { color: rgb(94,129,172); }
	&.String { color: rgb(163,190,140); }
	&.True { color: rgb(208,135,1); }
	&.False { color: rgb(208,135,1); }
	&.Val { color: rgb(208,135,1); }
	&.Var { color: rgb(208,135,1); }
	&.Identifier { color: rgb(235,203,1); }
	&.Plus { color: rgb(180,142,173); }
	&.Minus { color: rgb(180,142,173); }
	&.Multiply { color: rgb(180,142,173); }
	&.Division { color: rgb(180,142,173); }
	&.Pow { color: rgb(180,142,173); }
	&.Modulo { color: rgb(180,142,173); }
	&.Function { color: rgb(208,135,1); }
	&.Return { color: rgb(208,135,1); }
	&.Separator { color: rgb(236,239,244); }
	&.OpenParenthesis { color: rgb(143,188,187); }
	&.CloseParenthesis { color: rgb(143,188,187); }
	&.OpenCurlyBracket { color: rgb(143,188,187); }
	&.CloseCurlyBracket { color: rgb(143,188,187); }
	&.Assign { color: rgb(236,239,244); }
	&.AssignPlus { color: rgb(236,239,244); }
	&.AssignMinus { color: rgb(236,239,244); }
	&.AssignMultiply { color: rgb(236,239,244); }
	&.AssignDivision { color: rgb(236,239,244); }
	&.AssignPow { color: rgb(236,239,244); }
	&.AssignModulo { color: rgb(236,239,244); }
	&.Specifier { color: rgb(236,239,244); }
	&.Comment { color: rgb(216,222,233); }
	&.Dot { color: rgb(236,239,244); }

	&.error { color: #FFFFFF; border-bottom: 1px #ff0000 dashed }
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

		run() {
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
		},

		escape(html) {
			return html.replace(/[\x26\x0A\<>'"]/g, (r) => `&#${r.charCodeAt(0)};`);
		},

		highlight(code) {
			const instance = this.api.from_source(this.source);

			try {
				const tokens = instance.get_tokens();
				return this.highlight_tokens(code, tokens);
			} catch (err) {
				console.error(err);

				if (err.type.Lexical) {
					let [lineNum, column, length] = err.type.Lexical;
					lineNum--;

					return code.split(/\n/).map((line, index) => {
						if (index == lineNum) {
							return [
								this.escape(line.substr(0, column)),
								`<span class="token error">${this.escape(line.substr(column, length))}</span>`,
								this.escape(line.substr(column + length))
							].join('');
						}

						return this.escape(line);
					}).join('<br />');
				}

				return this.escape(code);
			}
		},

		highlight_tokens(code, tokens) {
			const lines = code.split(/\n/);
			let highlightedCode = '';
			let lineNum = 0;
			let tokenNum = 0;
			let columnNum = 0;

			while (true) {
				if (tokens.length == 0) break;

				const token = tokens[tokenNum];

				while (token.line - 1 > lineNum) {
					lineNum++;
					columnNum = 0;
					highlightedCode += '<br />';
				}

				const line = lines[lineNum];

				highlightedCode += line.substr(columnNum, token.column - columnNum);
				columnNum = token.column + token.length;

				let tokenValue = this.escape(line.substr(token.column, token.length));
				highlightedCode += `<span class="token ${token.type}">${tokenValue}</span>`;

				tokenNum++;
				if (tokenNum >= tokens.length) break;
			}

			highlightedCode += '<br />&nbsp;'.repeat(lines.length - lineNum);

			return highlightedCode;
		}
	}
};
</script>