import { UpdateUsuarioUsecase } from './../../../../../src/app/features/usuario/usecases/updateUsuarioUsecase';
import { UsuarioRepository } from "../../../../../src/app/features/usuario/repository";
import { Usuario } from "../../../../../src/app/shared/database/entities/Usuario";

describe('[Update Usuario Usecase]', () => {
	const usuario = new Usuario();
	usuario.nome = 'Mocked';
	usuario.id = 1;
	usuario.username = 'mockeduser';

	const repository = new UsuarioRepository();
	jest.spyOn(repository,'save').mockResolvedValue(usuario);

	const makeSut = () => new UpdateUsuarioUsecase(repository);

	test('Salva o usuário chamando \'save\' no Repositório de Usuário', async () => {
		const sut = makeSut();
		await sut.execute(usuario, 'Updated Mocked', 'Updated mockeduser');

		expect(repository.save).toBeCalled();
	});

	test('Retorna o usuário com valores atualizados', async () => {
		const sut = makeSut();
		const result = await sut.execute(usuario, 'Updated Mocked', 'Updated mockeduser');

		expect(result.nome).toBe('Updated Mocked');
		expect(result.username).toBe('Updated mockeduser');
	});
});