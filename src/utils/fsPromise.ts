import { promisify } from 'util';
import fs from 'fs';

const rmdir = promisify(fs.rmdir);
const fileExists = promisify(fs.exists);
const createDir = promisify(fs.mkdir);

export { rmdir, fileExists, createDir };
