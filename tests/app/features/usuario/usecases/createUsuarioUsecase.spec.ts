import { CreateUsuarioUsecase } from './../../../../../src/app/features/usuario/usecases/createUsuarioUsecase';
import { UsuarioRepository } from './../../../../../src/app/features/usuario/repository';
import { Usuario } from "../../../../../src/app/shared/database/entities/Usuario";
import bcrypt from 'bcryptjs';

describe('[Create Usuário Usecase]', () => {
	const bcryptHash = jest.fn().mockReturnValue('hashedpassword');
	(bcrypt.hash as jest.Mock) = bcryptHash;

	const usuario = new Usuario();
	usuario.nome = 'Mocked';
	usuario.id = 1;
	usuario.username = 'mockeduser';

	const mockedCreateTokenResult = {
		userData: {nome: usuario.nome, username: usuario.username},
		sign: 'sign',
		headerPayload: 'header.payload'
	};

	const repository = new UsuarioRepository();
	jest.spyOn(repository,'save').mockResolvedValue(usuario);

	const makeSut = () => new CreateUsuarioUsecase(repository);

	test('Salva novo usuário chamando \'save\' no Repositório de Usuário', async () => {
		const sut = makeSut();
		jest.spyOn(sut, 'createToken').mockResolvedValue(mockedCreateTokenResult);
		await sut.execute('Mocked', 'mockeduser', 'pass123*');

		expect(repository.save).toBeCalled();
	})

	test('Retorna userData com Token', async () => {
		const sut = makeSut();
		jest.spyOn(sut, 'createToken').mockResolvedValue(mockedCreateTokenResult);
		const result = await sut.execute('Mocked', 'mockeduser', 'pass123*');

		expect(result?.userData.nome).toBe('Mocked');
		expect(result?.headerPayload).toBeDefined();
		expect(result?.sign).toBeDefined();
	});
});