import unified from 'unified';
import parse from './parse.js';
import transform from './transform.js';
import stringify from '../js/stringify.js';
import loader from '../loader.js';

export default loader(
	'jsx',
	unified().use(parse).use(transform).use(stringify)
);
