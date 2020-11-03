import './styles/index.scss';
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';

export default ({ Vue, options, router, siteData }) => {
	Vue.component('PrismEditor', PrismEditor);
};
