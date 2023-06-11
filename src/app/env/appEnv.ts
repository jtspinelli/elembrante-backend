import dotenv from 'dotenv-safe';

dotenv.config();

export const appEnv = {
	port: process.env.PORT,
	dbUrl: process.env.DB_URL,
	secret: process.env.SECRET
}