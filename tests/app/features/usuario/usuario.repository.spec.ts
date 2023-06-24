import { Usuario } from '../../../../src/app/shared/database/entities/Usuario';
import { UsuarioRepository } from '../../../../src/app/features/usuario/repository';
import { dbOnClose, initializeDb } from '../../../db.setups';

describe('[USUARIO REPOSITORY]', () => {
	beforeAll(initializeDb);
	afterAll(dbOnClose);
	
	test('Retorna Usuário quando encontrado por username', async () => {
		const result = await new UsuarioRepository().findByUsername('user');

		expect(result).toBeInstanceOf(Usuario);
	});

	test('Retorna Usuário quando encontrado por id', async () => {
		const result = await new UsuarioRepository().findById(1);

		expect(result).toBeInstanceOf(Usuario);
	});

	test('Retorna \'true\' quando credenciais conferem', async () => {
		const repository = new UsuarioRepository();
		const usuario = await repository.findById(1);
		const result = await repository.checkSenha('pass123*', usuario?.senha as string);

		expect(result).toBeTruthy();
	});

	test('Retorna \'false\' quando credenciais não conferem', async () => {
		const repository = new UsuarioRepository();
		const usuario = await repository.findById(1);
		const result = await repository.checkSenha('blah', usuario?.senha as string);

		expect(result).toBeFalsy();
	});
});