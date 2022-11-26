import jsx from './formats/jsx/loader.js';
import mdx from './formats/mdx/loader.js';
import html from './formats/html/loader.js';

console.log(jsx);

export default {
	loaders: [jsx, mdx, html],
};
