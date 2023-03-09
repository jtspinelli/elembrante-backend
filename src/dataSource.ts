import dotenv from 'dotenv-safe';
import { DataSource } from "typeorm";
import { Usuario } from "./entity/Usuario";

// dotenv.config();

const host = process.env.HOST;
const username = process.env.HOSTUSERNAME;
const password = process.env.HOSTPASSWORD;

export const db = new DataSource({
	type: 'mysql',
	host,
	username,
	password,
	database: 'elembrante',
	entities: [Usuario]
});