import { toEstree } from 'hast-util-to-estree';

export default function transform() {
	/**
	 * @param {import('hast').Root} tree
	 */
	function t(tree) {
		return toEstree(tree);
	}
	return t;
}
