import { RecoverLembreteUsecase } from './../../../../../src/app/features/lembrete/usecases/recoverLembreteUsecase';
import { LembreteRepository } from "../../../../../src/app/features/lembrete/repository";
import { Lembrete } from "../../../../../src/app/shared/database/entities/Lembrete";
import { Usuario } from "../../../../../src/app/shared/database/entities/Usuario";

describe('[Recover Lembrete Usecase]', () => {
	const lembrete = new Lembrete();
	lembrete.id = 1;
	lembrete.titulo = 'Hey, ho';
	lembrete.descricao = 'Let\'s go!';
	lembrete.usuario = new Usuario();
	lembrete.arquivado = true;

	const lembreteRecuperado: Lembrete = {...lembrete};
	lembreteRecuperado.arquivado = false;
	
	const repository = new LembreteRepository();
	jest.spyOn(repository, 'findOneById').mockResolvedValue(lembrete);
	jest.spyOn(repository, 'save').mockResolvedValue(lembreteRecuperado);

	const makeSut = () => new RecoverLembreteUsecase(repository);

	test('Chama \'findOneById\' e \'save\' no Repositório de Lembrete', async () => {
		const sut = makeSut();
		await sut.execute(1);

		expect(repository.findOneById).toBeCalled();
		expect(repository.save).toBeCalled();
	});

	test('Retorna lembrete com propriedade \'arquivado\' false', async () => {
		const sut = makeSut()
		const result = await sut.execute(1);

		expect(result?.arquivado).toBeFalsy();
	});
});