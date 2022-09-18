import fs from 'fs';
import { promisify } from 'util';

const rmdir = promisify(fs.rmdir);
const fileExists = promisify(fs.exists);
const createDir = promisify(fs.mkdir);

export { rmdir, fileExists, createDir };
