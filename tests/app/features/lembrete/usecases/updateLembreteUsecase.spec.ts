import { UpdateLembreteUsecase } from './../../../../../src/app/features/lembrete/usecases/updateLembreteUsecase';
import { Lembrete } from '../../../../../src/app/shared/database/entities/Lembrete';
import { Usuario } from '../../../../../src/app/shared/database/entities/Usuario';
import { LembreteRepository } from './../../../../../src/app/features/lembrete/repository';
import LembreteDto from '../../../../../src/app/features/lembrete/dto/LembreteDto';

describe('[Update Lembrete Usecase]', () => {
	const lembrete = new Lembrete();
	lembrete.id = 1;
	lembrete.titulo = 'Hey, ho';
	lembrete.descricao = 'Let\'s go!';
	lembrete.usuario = new Usuario();
	lembrete.arquivado = true;

	const updatedLembrete: Lembrete = {...lembrete};
	updatedLembrete.titulo = 'Hey!';
	updatedLembrete.descricao = 'Go!';
	
	const repository = new LembreteRepository();
	jest.spyOn(repository, 'findOneByIdWithRelations').mockResolvedValue(lembrete);
	jest.spyOn(repository, 'save').mockResolvedValue(updatedLembrete);

	const makeSut = () => new UpdateLembreteUsecase(repository);

	test('Chama \'findOneByIdWithRelations\' e \'save\' do Repositório de Lembrete', async () => {
		const dto = new LembreteDto();

		const sut = makeSut();
		jest.spyOn(sut, 'getDto').mockReturnValue(dto);

		await sut.execute(1, 'Hey!', 'Go!');

		expect(repository.findOneByIdWithRelations).toBeCalled();
		expect(repository.save).toBeCalled();
	});

	test('Retorna LembreteDto', async() => {
		const dto = new LembreteDto();
		dto.titulo = 'Hey!';
		dto.descricao = 'Go!';

		const sut = makeSut();
		jest.spyOn(sut, 'getDto').mockReturnValue(dto);

		const result = await sut.execute(1, 'Hey!', 'Ho!');

		expect(result).toBeInstanceOf(LembreteDto);
		expect(result?.titulo).toBe('Hey!');
		expect(result?.descricao).toBe('Go!');
	});
});