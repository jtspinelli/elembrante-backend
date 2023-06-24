import dotenv from 'dotenv-safe';
import { DataSourceOptions } from "typeorm";
import { Lembrete } from '../../app/shared/database/entities/Lembrete';
import { Usuario } from '../../app/shared/database/entities/Usuario';
import { GenerateDb1684598200838 } from '../../app/shared/database/migrations/1684598200838-GenerateDb';
import { GenerateDb1687053124264 } from '../../app/shared/database/migrations/1687053124264-GenerateDb';

//dotenv.config();

let typeormconfig: DataSourceOptions = {
	type: 'postgres',
	url: process.env.DB_URL,
	ssl: {
		rejectUnauthorized: false
	},
	entities: [Usuario, Lembrete],
	migrations: [GenerateDb1684598200838]
};

if(process.env.NODE_ENV === 'test') {
	typeormconfig = {
		type: 'sqlite',
		database: './dbtest.sqlite',
		logging: false,
		synchronize: true,
		entities: [Usuario, Lembrete],
		migrations: [GenerateDb1687053124264]
	}
}

export default typeormconfig;