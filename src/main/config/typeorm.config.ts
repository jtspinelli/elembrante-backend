import dotenv from 'dotenv-safe';
import { DataSourceOptions } from "typeorm";
import { Usuario } from "../../entity/Usuario";
import { Lembrete } from "../../entity/Lembrete";
import { GenerateDb1684598200838 } from "../../migrations/1684598200838-GenerateDb";

dotenv.config();

const typeormconfig: DataSourceOptions = {
	type: 'postgres',
	url: process.env.DB_URL,
	ssl: {
		rejectUnauthorized: false
	},
	entities: [Usuario, Lembrete],
	migrations: [GenerateDb1684598200838]
};

export default typeormconfig;