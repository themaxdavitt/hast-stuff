import unified from 'unified';
import parse from 'rehype-parse';
import process from '../process.js';
import stringify from './stringify.js';

export const processor = unified().use(parse).use(stringify);

export default process(processor);
