import _ from 'lodash';
import { trough } from 'trough';
import { promisify } from 'util';

/**
 * @param {import('unified').Processor} processor
 */
export default function (processor) {
	/**
	 * @param {import('vfile').VFileCompatible | import('unist').Node} document
	 * @returns {Promise<string>}
	 */
	async function process(document) {
		return await promisify(
			trough()
				.use(typeof document === 'object' ? _.identity : processor.parse)
				.use(processor.run)
				.use(processor.stringify).run
		)(await document);
	}

	return process;
}
