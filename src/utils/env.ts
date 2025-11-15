import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), 'config', 'dev.env');
dotenv.config({ path: envPath });

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
export const AUTH_USERNAME = process.env.AUTH_USERNAME || 'admin';
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD;