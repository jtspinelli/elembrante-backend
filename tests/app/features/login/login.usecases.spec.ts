import { LoginUsecase } from './../../../../src/app/features/login/usecases/loginUsecase';
import { GoogleLoginUsecase } from "../../../../src/app/features/login/usecases/googleLoginUsecase";
import { UsuarioRepository } from "../../../../src/app/features/usuario/repository";
import { Usuario } from "../../../../src/app/shared/database/entities/Usuario";
import { InvalidGoogleTokenError } from "../../../../src/app/shared/errors/InvalidGoogleTokenError";

describe('[LOGIN USECASES]', () => {
	const usuario = new Usuario();
	usuario.nome = 'Default User';
	usuario.username = 'user';
	usuario.id = 1;

	test('Retorna objeto com dados do usuário e Access Token se login bem sucedido', async () => {		
		const sut = new LoginUsecase();
		const result = await sut.execute(usuario);

		expect(result?.userData).toBeDefined();
	});

	test('Retorna objeto com dados do usuário e Access Token se Google Token válido', async () => {
		const repository = new UsuarioRepository();
		
		const sut = new GoogleLoginUsecase(repository);

		jest.spyOn(repository, 'findByUsername').mockResolvedValue(usuario);
		jest.spyOn(sut, 'getGoogleUserData').mockResolvedValue({
			status: 200,
			data: {
				name: 'Default User',
				email: 'user@gmail.com'
			}
		});

		const result = await sut.execute('valid_google_token');
		expect(result?.userData).toBeDefined();
		expect(result?.headerPayload).toBeDefined();
	});

	test('Joga erro se Google Token inválido', async () => {
		const repository = new UsuarioRepository();
		const sut = new GoogleLoginUsecase(repository);
		jest.spyOn(sut, 'getGoogleUserData').mockResolvedValue({
			status: 400,
			data: {name: '', email: ''}
		});

		try {
			await sut.execute('invalid_google_token');
		} catch(err) {
			expect(err instanceof InvalidGoogleTokenError).toBeTruthy();
		}
	});

	test('No Google Login, cria novo Usuário e retorna objeto com dados do usuário e Access Token', async () => {
		const repository = new UsuarioRepository();
		const usuario = new Usuario();
		usuario.nome = 'Default User';
		usuario.username = 'user';
		usuario.id = 1;
		jest.spyOn(repository, 'findByUsername').mockResolvedValue(null);
		jest.spyOn(repository, 'save').mockResolvedValue(usuario);

		const sut = new GoogleLoginUsecase(repository);
		jest.spyOn(sut, 'getGoogleUserData').mockResolvedValue({
			status: 200,
			data: {name: 'Default User', email: 'user@gmail.com'}
		});

		const result = await sut.execute('valid_google_token');
		expect(repository.save).toBeCalled();
		expect(result?.userData).toBeDefined();
	});
});