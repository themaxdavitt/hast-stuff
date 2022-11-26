import dotenv from 'dotenv';
import { mkdir, writeFile } from 'fs/promises';

//import Example from './example.mdx';
import html from '../formats/html/index.js';
import { Person } from './people.mdx';
import { Embed } from '../components/embed.jsx';
import { Private } from '../components/private.jsx';

dotenv.config();

await mkdir('./out/', { recursive: true });

const stringified = await html(
	<>
		<Person link='https://max.davitt.me'>Max Davitt</Person>
		<br />
		<Person link='https://google.com'>Google</Person>
		<br />
		<Person link='https://google.com'>Google</Person>
		<br />
		<Person link='https://google.com'>Google</Person>
		<br />
		<Person link='https://google.com'>Google</Person>
		<br />
		<Person link='https://google.com'>Google</Person>
		<br />
		<br />
		<Embed link='https://www.youtube.com/watch?v=tgbNymZ7vqY' />
		<br />
		<Embed link='https://twitter.com/finessafudges/status/1401013688056832006?s=21' />
		<br />
		<Embed link='https://soundcloud.com/dj-khaled/every-chance-i-get-feat-lil' />
		<br />
		<Embed link='https://www.reuters.com/technology/bosch-opens-german-chip-plant-its-biggest-ever-investment-2021-06-07/' />
		<br />
		<Embed link='https://vimeo.com/259411563' />
		<br />
		<Private>test</Private>
	</>
);

await writeFile('./out/person.html', stringified, 'utf-8');
