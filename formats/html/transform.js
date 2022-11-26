import _ from 'lodash';
import { walk } from 'estree-walker';

export default function transform() {
	/**
	 * @param {import('estree-jsx').Program} t
	 * @returns {import('estree-jsx').Program} tree
	 */
	function t(t) {
		const tree = _.cloneDeep(t);

		walk(tree, {
			enter(node, parent) {
				if (node.type === 'ExpressionStatement' && parent.type === 'Program') {
					// transforms into `export default function () { /* ... */ }`
					this.replace({
						type: 'ExportDefaultDeclaration',
						declaration: {
							type: 'FunctionDeclaration',
							id: null,
							expression: false,
							generator: false,
							async: false,
							params: [],
							body: {
								type: 'BlockStatement',
								body: [
									{
										type: 'ReturnStatement',
										argument: node,
									},
								],
							},
						},
					});
				}
			},
		});

		return tree;
	}

	return t;
}
