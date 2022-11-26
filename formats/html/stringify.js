import { renderStylesToString } from '@emotion/server';
import stringify from 'rehype-stringify';

export default function (options) {
	stringify.call(this, options);
	const rehype = this.Compiler;
	this.Compiler = (tree) => renderStylesToString(rehype(tree));
}
