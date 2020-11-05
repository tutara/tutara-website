// Directories we should look for to import the .sidenav files from
// these are added in the continuous integration build step
const importedDirs = ['syntax'];

const sidebar = new Object();

for (const dir of importedDirs) {
	const fs = require('fs');
	const path = require('path');
	const location = path.resolve(__dirname, '../', dir, '.sidenav');
	
	if (fs.existsSync(location)) {
		const rules = fs.readFileSync(location)
			.toString()
			.split(/\n/)
			.map(it => it.trim())
			.filter(it => it.length != 0 && !it.startsWith('#'))
			.map(it => it.replace(/\.md$/, '').replace(/^index$/, ''));
		
		sidebar['/' + dir + '/'] = rules;
	}
}

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
				text: 'Syntax',
				link: '/syntax/'
			},
			{
				text: 'Try it out',
				link: '/try'
			},
		],

		displayAllHeaders: true,
		sidebar
	},
	plugins: [
		'@vuepress/plugin-back-to-top',
		'@vuepress/plugin-medium-zoom',
	],
	configureWebpack: {
		node: { global: true }
	}
};
