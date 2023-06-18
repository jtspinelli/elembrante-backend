import { LembreteRepository } from '../../../../../src/app/features/lembrete/repository';
import { Lembrete } from '../../../../../src/app/shared/database/entities/Lembrete';
import { Usuario } from '../../../../../src/app/shared/database/entities/Usuario';
import { AddLembreteUsecase } from './../../../../../src/app/features/lembrete/usecases/addLembreteUsecase';
import LembreteDto from '../../../../../src/app/features/lembrete/dto/LembreteDto';

describe('[Add Lembrete Usecase]', () => {
	const usuario = new Usuario();
	usuario.nome = 'Mocked';
	usuario.id = 1;
	usuario.username = 'mockeduser';
	
	const lembrete = new Lembrete();
	lembrete.descricao = 'Make all tests pass!';
	lembrete.titulo = 'Run tests';
	lembrete.id = 1;
	lembrete.usuario = usuario;
	
	const repository = new LembreteRepository();
	jest.spyOn(repository, 'create').mockResolvedValue(lembrete);

	const makeSut = () => new AddLembreteUsecase(repository);
	
	test('Salva o novo Lembrete chamando \'create\' no Repositório de Lembrete', async () => {
		const sut = makeSut();
		jest.spyOn(sut, 'getDto').mockReturnValue(new LembreteDto());

		await sut.execute('Run tests', 'Make all tests pass!', usuario);

		expect(repository.create).toBeCalled();
	});

	test('Retorna um LembreteDto com as informações do Lembrete criado', async () => {
		const dto = new LembreteDto();
		dto.descricao = 'Make all tests pass!';
		dto.titulo = 'Run tests';

		const sut = makeSut();
		jest.spyOn(sut, 'getDto').mockReturnValue(dto);

		const result = await sut.execute('Run tests', 'Make all tests pass!', usuario);

		expect(result).toBeInstanceOf(LembreteDto);
		expect(result.titulo).toBe('Run tests');
		expect(result.descricao).toBe('Make all tests pass!');
	});
});