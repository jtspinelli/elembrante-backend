import dotenv from 'dotenv-safe';
import { DataSourceOptions } from "typeorm";
import { GenerateDb1684598200838 } from "../../migrations/1684598200838-GenerateDb";
import { Lembrete } from '../../app/shared/database/entities/Lembrete';
import { Usuario } from '../../app/shared/database/entities/Usuario';

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