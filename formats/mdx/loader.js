import { createProcessor } from 'xdm';
import loader from '../loader.js';
import transform from '../jsx/transform.js';

export default loader(
	'mdx',
	createProcessor({
		format: 'mdx',
		jsxRuntime: 'automatic',
		jsxImportSource: '@themaxdavitt/hastscript-components/html',
		jsx: true,
	}).use(transform)
);
