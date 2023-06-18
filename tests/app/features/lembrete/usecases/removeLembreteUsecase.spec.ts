import { RemoveLembreteUsecase } from '../../../../../src/app/features/lembrete/usecases/removeLembreteUsecase';
import { Lembrete } from '../../../../../src/app/shared/database/entities/Lembrete';
import { LembreteRepository } from '../../../../../src/app/features/lembrete/repository';

describe('[Remove Lembrete Usecase]', () => {
	const repository = new LembreteRepository();
	jest.spyOn(repository, 'findOneById').mockResolvedValue(new Lembrete());
	jest.spyOn(repository, 'remove').mockImplementation((lembrete: Lembrete) => {return new Promise<void>(res => {res()})});

	const makeSut = () => new RemoveLembreteUsecase(repository);

	test('Chama \'findOneById\' e \'remove\' no Repositório de Lembrete', async () => {
		const sut = makeSut();
		await sut.execute(1);

		expect(repository.findOneById).toBeCalled();
		expect(repository.remove).toBeCalled();
	});
});