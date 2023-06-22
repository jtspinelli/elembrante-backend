import { CreateUsuarioUsecase } from '../../../../src/app/features/usuario/usecases/createUsuarioUsecase';
import { UsuarioRepository } from '../../../../src/app/features/usuario/repository';
import { Usuario } from "../../../../src/app/shared/database/entities/Usuario";
import { UpdateUsuarioUsecase } from '../../../../src/app/features/usuario/usecases/updateUsuarioUsecase';
import { RemoveUsuarioUsecase } from '../../../../src/app/features/usuario/usecases/removeUsuarioUsecase';
import bcrypt from 'bcryptjs';

describe('[USUARIO USECASES]', () => {
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
});