import fs from 'node:fs';
import { promisify } from 'node:util';

const rmdir = promisify(fs.rmdir);
const fileExists = promisify(fs.exists);
const createDir = promisify(fs.mkdir);

export { rmdir, fileExists, createDir };
