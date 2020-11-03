module.exports = {
	title: 'Tutara',
	description: 'Tutara',
	themeConfig: {
		repo: 'tutara/tutara',
		repoLabel: 'Contribute',

		docsRepo: 'tutara/tutara-website',
		docsDir: 'src',
		editLinks: true,
		editLinkText: 'Edit this page',
		lastUpdated: true,

		search: false,

		nav: [
			{
				text: 'Try it out',
				link: '/try'
			},
		]
	},
	plugins: [
		'@vuepress/plugin-back-to-top',
		'@vuepress/plugin-medium-zoom',
	],
	configureWebpack: {
		node: { global: true }
	}
};
