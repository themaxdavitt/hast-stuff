import got from 'got';
import KeyvSqlite from '@keyv/sqlite';

const gotOptions = {
	cache: new KeyvSqlite({ uri: 'sqlite://cache.sqlite' }),
};

const g = got.extend(gotOptions);

export { g as got, gotOptions };
