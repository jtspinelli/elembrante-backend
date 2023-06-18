import { GetLembretesUsecase } from './../../../../../src/app/features/lembrete/usecases/getLembretesUsecase';
import { LembreteRepository } from './../../../../../src/app/features/lembrete/repository';
import LembreteDto from '../../../../../src/app/features/lembrete/dto/LembreteDto';

describe('[Get Lembretes Usecase]', () => {	
	const lembretes: LembreteDto[] = [
		{
			titulo: 'Study Testing',
			descricao: 'Read Jest Docs online',
			id: 2,
			arquivado: false,
			usuarioId: 1,
			criadoEm: new Date()
		},
		{
			titulo: 'Go Shopping',
			descricao: 'Buy new suit at Aduana',
			id: 1,
			arquivado: false,
			usuarioId: 1,
			criadoEm: new Date()
		}
	];

	const repository = new LembreteRepository();
	jest.spyOn(repository, 'getAll').mockResolvedValue(lembretes);

	const makeSut = () => new GetLembretesUsecase(repository);

	test('Chama \'getAll\' no Repositório de Lembretes para obter lista', async () => {
		const sut = makeSut();
		await sut.execute(1);

		expect(repository.getAll).toBeCalled();
	});

	test('Retorna lista de LembreteDto', async () => {
		const sut = makeSut();
		const result = await sut.execute(1);

		expect(result.length).toBe(2);
		result.forEach((lembrete: any) => {
			expect(typeof lembrete.id).toBe('number');
			expect(lembrete.titulo).toBeDefined();
			expect(lembrete.descricao).toBeDefined();
			expect(typeof lembrete.usuarioId).toBe('number');
			expect(lembrete.usuario).toBeUndefined();			
		});
	});
});