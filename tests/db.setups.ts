import { Lembrete } from "../src/app/shared/database/entities/Lembrete";
import { Usuario } from "../src/app/shared/database/entities/Usuario";
import db from "../src/main/config/dataSource";

export const initializeDb = async () => {
	await db.initialize();
	await db.createQueryBuilder()
		.insert()
		.into(Usuario)
		.values([
			{ id: 1, nome: 'Default User', username: 'user', senha: '$2a$10$GFJY7jy5a0cfXBJ9aAgJJeHlPxWVnI4/wuCNE1slYs1ymvfUwLQZq', excluido: false },
			{ id: 2, nome: 'Test User', username: 'testuser', senha: '$2a$10$GFJY7jy5a0cfXBJ9aAgJJeHlPxWVnI4/wuCNE1slYs1ymvfUwLQZq', excluido: false }
		])
		.execute();
	
	await db.createQueryBuilder()
		.insert()
		.into(Lembrete)
		.values([
			{ id: 1, titulo: 'Title', descricao: 'Description', criadoEm: new Date, arquivado: false, usuario: await db.getRepository(Usuario).findOneBy({id: 1}) as Usuario },
			{ id: 2, titulo: 'Title', descricao: 'Description', criadoEm: new Date, arquivado: false, usuario: await db.getRepository(Usuario).findOneBy({id: 1}) as Usuario },
		])
		.execute();
};

export const dbOnClose = async () => {
	await db.dropDatabase();
	await db.destroy();
};