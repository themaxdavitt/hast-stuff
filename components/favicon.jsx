import { css } from '@emotion/css';
import { got } from '../util/got.js';

/**
 * @param {string} link
 */
export async function Favicon({ link }) {
	const parsed = new URL(link);
	parsed.pathname = '/favicon.ico';

	try {
		const icon = await got(parsed, { responseType: 'buffer' });
		return (
			<img
				className={css`
					width: 1em;
					height: 1em;
					vertical-align: bottom;
				`}
				src={`data:${icon.headers['content-type']};base64,${icon.body.toString(
					'base64'
				)}`}
			/>
		);
	} catch (_) {
		return;
	}
}
