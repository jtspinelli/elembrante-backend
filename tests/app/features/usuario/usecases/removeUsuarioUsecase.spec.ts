import { RemoveUsuarioUsecase } from './../../../../../src/app/features/usuario/usecases/removeUsuarioUsecase';
import { UsuarioRepository } from "../../../../../src/app/features/usuario/repository";
import { Usuario } from "../../../../../src/app/shared/database/entities/Usuario";

describe('[Remove Usuário Usecase]', () => {
	const usuario = new Usuario();
	usuario.nome = 'Mocked';
	usuario.id = 1;
	usuario.username = 'mockeduser' + ' [Registro excluído] - ' + Math.floor(new Date().getTime() / 1000);;
	usuario.excluido = true;

	const repository = new UsuarioRepository();
	jest.spyOn(repository,'save').mockResolvedValue(usuario);

	const makeSut = () => new RemoveUsuarioUsecase(repository);
	
	test('Salva usuário chamando \'save\' no Repositório de Usuário (exclusão lógica)', async () => {
		const sut = makeSut();
		await sut.execute(new Usuario());
		expect(repository.save).toBeCalled();
	});

	test('Retorna o Usuário com \'excluido\' true', async () => {
		const sut = makeSut();
		const result = await sut.execute(new Usuario());

		expect(result).toBeInstanceOf(Usuario);
		expect(result.excluido).toBeTruthy();
	});
});