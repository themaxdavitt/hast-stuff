import { generate as stringify } from 'astring';

/**
 * @param {import('astring').Options} options
 */
export default function (options) {
	this.Compiler = (tree) => stringify(tree, options);
}
