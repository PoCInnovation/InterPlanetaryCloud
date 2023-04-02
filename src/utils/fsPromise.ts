import fs from 'node:fs';
import { promisify } from 'node:util';

const rm = promisify(fs.rm);
const fileExists = promisify(fs.exists);
const createDir = promisify(fs.mkdir);

export { rm, fileExists, createDir };
