import { css } from '@emotion/css';
import execa from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';
import { stringify } from 'querystring';
import { withTmpDir } from '../util/tmp.js';
import { processor } from '../formats/html/index.js';
import { Favicon } from './favicon.jsx';
import { meta } from '../util/meta.js';
import { got } from '../util/got.js';

/**
 * oEmbed response (but as a lazy type definition)
 * @typedef {Object} oEmbed
 * @property {string} type
 * @property {string} version
 * @property {string|undefined} title
 * @property {string|undefined} author_name
 * @property {string|undefined} author_url
 * @property {string|undefined} provider_name
 * @property {string|undefined} provider_url
 * @property {number} cache_age
 * @property {string|undefined} thumbnail_url
 * @property {number|undefined} thumbnail_width
 * @property {number|undefined} thumbnail_height
 * @property {string|undefined} url
 * @property {number|undefined} width
 * @property {number|undefined} height
 * @property {string|undefined} html
 */

/**
 * Convert oEmbed scheme string to a regular expression
 * @param {string} scheme
 * @returns {RegExp}
 */
function schemeToRegExp(scheme) {
	let [, proto, , host, , path, query] =
		/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/.exec(scheme);
	host = (host || '')
		.replace(/\./g, '\\.')
		.replace(/\//g, '\\/')
		.replace(/\*/g, '[A-Za-z0-9.-]+');
	path = (path || '')
		.replace(/\./g, '\\.')
		.replace(/\//g, '\\/')
		.replace(/\*/g, '.+');
	query = (query || '').replace(/\*/g, '.+');

	return new RegExp([proto, host, path, query].join(''));
}

/**
 * @type {Array.<{provider_name: string, provider_url: string, url: string, discovery: boolean, scheme: RegExp}>}
 */
const providers = (await got('https://oembed.com/providers.json').json())
	.map(({ endpoints, ...provider }) =>
		endpoints.map(({ schemes, url: u, ...endpoint }) =>
			(schemes || []).map(schemeToRegExp).map((scheme) => ({
				...provider,
				...endpoint,
				url: (format) => u.replace(/{format}/g, format),
				scheme,
			}))
		)
	)
	.flat(2);

/**
 * @param {string} url
 * @param {string} title
 * @returns {Promise<string>}
 */
async function getTitle(url, title) {
	if (typeof title === 'undefined') {
		return (await meta({ html: await got(url).text(), url })).title;
	} else {
		return title;
	}
}

function Wrap({ title, url, children }) {
	return <figure>
	<a
		className={css`
			display: inline-block;

			> * {
				pointer-events: none;
			}
		`}
		href={url}
		target='_blank'
		title={title}>
		{children}
	</a>
	<figcaption>{title}</figcaption>
	</figure>;
}

export async function OEmbed({ title, link: url }) {
	const provider = providers.find(({ scheme }) => scheme.test(url));

	if (typeof provider !== 'undefined') {
		/**
		 * @type {oEmbed}
		 */
		const embedData = await got(
			`${provider.url('json')}?${stringify({ format: 'json', url })}`
		).json();

		//console.log(embedData);

		if (typeof embedData.thumbnail_url !== 'undefined') {
			const title = await getTitle(url, embedData.title);

			return (
				<Wrap title={title} url={url}>
					<img src={embedData.thumbnail_url} alt={title} />
				</Wrap>
			);
		} else if (typeof embedData.html !== 'undefined') {
			/**
			 * @type {import('hast').Element}
			 */
			const html = processor.parse(
				await withTmpDir(async (dir) => {
					const input = path.join(dir, 'input.html');
					const output = path.join(dir, 'output.html');
					await fs.writeFile(input, embedData.html);
					await execa(
						path.resolve('node_modules/single-file/cli/single-file'),
						[
							input,
							output,
							'--back-end=jsdom',
							'--browser-wait-until=networkidle2',
						]
					);
					return await fs.readFile(output, { encoding: 'utf8' });
				})
			).children[0].children[2];

			for (const element of html.children.filter(
				(child) => child.type === 'element'
			)) {
				if (element.tagName === 'iframe') {
					element.properties.width =
						Math.max(embedData.thumbnail_width, embedData.width) ||
						element.properties.width;
					element.properties.height =
						Math.max(embedData.thumbnail_height, embedData.height) ||
						element.properties.height;
				}
			}

			return (
				<Wrap title={title} url={url}>
					{html}
				</Wrap>
			);
		}
	}

	const blah = await getTitle(url, title);
	console.log(blah);
	debugger;
	//console.log(<Favicon link={url} />);
	//return <Favicon link={url} />;
	return (
		<Wrap title={title} url={url}>
			<Favicon link={url} />
			{blah}
		</Wrap>
	);
}

/*
		// TODO: rewrite?
		if (typeof embedData.html !== 'undefined') {
			const html = processor.parse(
				await withTmpDir(async (dir) => {
					const input = path.join(dir, 'input.html');
					const output = path.join(dir, 'output.html');
					await fs.writeFile(input, embedData.html);
					await execa(
						path.resolve('node_modules/single-file/cli/single-file'),
						[
							input,
							output,
							'--back-end=playwright-chromium',
							'--browser-wait-until=networkidle2',
						]
					);
					return await fs.readFile(output, { encoding: 'utf8' });
				})
			).children[0].children[2];

			//if (url.includes('vimeo')) {
			//	console.log(processor.stringify(html));
			//}

			for (const element of html.children.filter(
				(child) => child.type === 'element'
			)) {
				if (element.tagName === 'iframe') {
					//console.log((element.properties.class || []).concat(css`
					//	width: 100%;
					//	height: 100%;
					//`));
					//element.properties.class = (element.properties.class || []).concat(css`
					//	width: 100%;
					//	height: 100%;
					//`);

					element.properties.width =
						Math.max(embedData.thumbnail_width, embedData.width) ||
						element.properties.width;
					element.properties.height =
						Math.max(embedData.thumbnail_height, embedData.height) ||
						element.properties.height;

					/*

					console.log({ embedData, width, height });

					if (typeof (element.properties.width || 0) === 'number' && typeof (element.properties.thumbnail_width || 0) === 'number') {
						element.properties.width = Math.max(element.properties.width || 0, embedData.thumbnail_width || 0);
					}

					if (typeof (element.properties.height || 0) === 'number' && typeof (element.properties.thumbnail_height || 0) === 'number') {
						element.properties.height = Math.max(element.properties.height || 0, embedData.thumbnail_height || 0);
					}

					*/

//const { width, height } = element.properties;
//
//console.log({ embedData, width, height });

//delete element.properties.width;
//delete element.properties.height;
/*
			return (
				<a
					className={css`
						display: inline-block;
					`}
					href={url}
					target='_blank'
					title={title}>
					<div
						className={css`
							pointer-events: none;
						`}>
						{html}
					</div>
				</a>
			);
			*/

/*
			return (
				<a
					className={
						embedData.type === 'video' || typeof embedData.width == 'number'
							? css`
									display: inline-block;

									> * {
										pointer-events: none;
									}
							  `
							: css`
									display: block;

									> * {
										pointer-events: none;
									}
							  `
					}
					href={url}
					target='_blank'
					title={title}>
					{html}
				</a>
			);
		}
		*/
