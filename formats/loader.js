import { readFile } from 'fs/promises';
import { dirname, extname } from 'path';
import { fileURLToPath, URL } from 'url';

/**
 * @todo test on windows?
 * @param {string} ext
 * @param {string} p
 * @returns {boolean}
 */
function useLoader(ext, p) {
	console.log({ ext, p });
	return !dirname(p).includes('/node_modules/') && extname(p) === `.${ext}`;
}

/**
 * @version node-v16
 * @param {string} ext
 * @param {import('unified').Processor} processor
 */
export default function (ext, processor) {
	return {
		async load(url, context, defaultLoad) {
			const u = new URL(url);

			if (u.protocol === 'file:') {
				const p = fileURLToPath(new URL(url));

				if (useLoader(ext, p)) {
					return {
						format: 'module',
						source: (await processor.process(await readFile(p, { encoding: 'utf8' }))).contents,
					};
				}
			}
			
			return defaultLoad(url, context, defaultLoad);
		}
	};
	//// valid as of node v16
	//return {
	//	/**
	//	 * @param {string} url
	//	 * @param {Object} context (currently empty)
	//	 * @param {Function} defaultGetFormat
	//	 * @returns {Promise<{ format: string }>}
	//	 */
	//	async getFormat(url, context, defaultGetFormat) {
	//		if (useLoader(ext, url)) {
	//			return { format: 'module' };
	//		} else {
	//			return defaultGetFormat(url, context, defaultGetFormat);
	//		}
	//	},
	//	/**
	//	 * @param {!(string | SharedArrayBuffer | Uint8Array)} source
	//	 * @param {{
	//	 *   format: string,
	//	 *   url: string,
	//	 * }} context
	//	 * @param {Function} defaultTransformSource
	//	 * @returns {Promise<{ source: !(string | SharedArrayBuffer | Uint8Array) }>}
	//	 */
	//	async transformSource(source, { format, url }, defaultTransformSource) {
	//		if (useLoader(ext, url)) {
	//			return {
	//				source: (await processor.process(source.toString())).contents,
	//			};
	//		} else {
	//			return defaultTransformSource(
	//				source,
	//				{ format, url },
	//				defaultTransformSource
	//			);
	//		}
	//	},
	//};
}
