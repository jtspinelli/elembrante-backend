// import { dbOnClose, initializeDb } from '../../../db.setups';
// // import { createToken } from "../../../../src/app/features/login/controller";
// import { Usuario } from "../../../../src/app/shared/database/entities/Usuario";

// describe('[LOGIN CONTROLLER]', () => {
// 	beforeAll(initializeDb);
// 	afterAll(dbOnClose);
	
// 	test('Retorna objeto com Token e dados do usuário', async() => {
// 		const usuario = new Usuario();
// 		usuario.id = 1;
// 		usuario.nome = 'User';
// 		usuario.username = 'user';		

// 		const result = await createToken(usuario as Usuario);

// 		expect(result?.userData).toBeDefined();
// 		expect(result?.headerPayload).toBeDefined();
// 		expect(result?.sign).toBeDefined();
// 	});
// });