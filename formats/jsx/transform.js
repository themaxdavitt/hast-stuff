import { buildJsx } from 'estree-util-build-jsx';

export default function transform() {
	/**
	 * @param {import('estree-jsx').Program} tree
	 */
	function t(tree) {
		return buildJsx(tree, {
			runtime: 'automatic',
			importSource: '@themaxdavitt/hastscript-components/html',
		});
	}

	return t;
}
