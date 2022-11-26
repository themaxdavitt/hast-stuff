import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

export async function withTmpDir(fn) {
	const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'website-'));

	const value = await fn(dir);

	await fs.rm(dir, { recursive: true });

	return value;
}
