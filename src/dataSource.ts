import { DataSource } from "typeorm";
import { Lembrete } from "./entity/Lembrete";
import { Usuario } from "./entity/Usuario";
import dotenv from 'dotenv-safe';

// dotenv.config();

export const db = new DataSource({
	type: 'postgres',
	url: process.env.DB_URL,
	ssl: {
        rejectUnauthorized: false,
    },
	entities: [Usuario, Lembrete],
	//synchronize: true
});