import { Parser } from 'acorn';
import jsx from 'acorn-jsx';
import _ from 'lodash';

/**
 * @param {import('acorn').Options} options
 */
export default function (options) {
	const p = Parser.extend(jsx());

	this.Parser = (doc) =>
		p.parse(
			doc,
			_.assign(
				{
					allowAwaitOutsideFunction: true,
					ecmaVersion: 'latest',
					sourceType: 'module',
					locations: true,
				},
				options
			)
		);
}
