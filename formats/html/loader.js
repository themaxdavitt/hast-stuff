import unified from 'unified';
import parse from 'rehype-parse';
import hast2estree from './hast-estree.js';
import transform from './transform.js';
import jsxTransform from '../jsx/transform.js';
import stringify from '../js/stringify.js';
import loader from '../loader.js';

const html = loader(
	'html',
	unified()
		.use(parse, { fragment: true })
		.use(hast2estree)
		.use(transform)
		.use(jsxTransform)
		.use(stringify)
);

export default html;
