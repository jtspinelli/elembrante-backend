import { DataSource } from "typeorm";
import { Lembrete } from "./entity/Lembrete";
import { Usuario } from "./entity/Usuario";
import dotenv from 'dotenv-safe';

//dotenv.config();

const host = process.env.HOST;
const username = process.env.HOSTUSERNAME;
const password = process.env.HOSTPASSWORD;

export const db = new DataSource({
	type: 'mysql',
	host,
	username,
	password,
	database: 'elembrante',
	entities: [Usuario, Lembrete],
	// synchronize: true
});