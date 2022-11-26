import { Mutex } from 'async-mutex';
import got from 'got';

const cache = new Map();
const mutex = new Mutex();

/**
 * @param {URL | string} url
 * @returns {Promise<import('got').Response | undefined>}
 */
export async function http(url) {
	const key = url.toString();

	await mutex.runExclusive(async () => {
		if (!cache.has(key)) {
			try {
				cache.set(key, await got(url));
			} catch (_) {
				cache.set(key, undefined);
			}
		}
	});

	return cache.get(key);
}
