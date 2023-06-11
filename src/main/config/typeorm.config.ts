import dotenv from 'dotenv-safe';
import { DataSourceOptions } from "typeorm";
import { Lembrete } from '../../app/shared/database/entities/Lembrete';
import { Usuario } from '../../app/shared/database/entities/Usuario';
import { GenerateDb1684598200838 } from '../../app/shared/database/migrations/1684598200838-GenerateDb';

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