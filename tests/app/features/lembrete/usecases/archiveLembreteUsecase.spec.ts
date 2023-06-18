import { ArchiveLembreteUsecase } from './../../../../../src/app/features/lembrete/usecases/archiveLembreteUsecase';
import { LembreteRepository } from './../../../../../src/app/features/lembrete/repository';
import { Usuario } from '../../../../../src/app/shared/database/entities/Usuario';
import { Lembrete } from './../../../../../src/app/shared/database/entities/Lembrete';

describe('[Archive Lembrete Usecase]', () => {
	const lembrete = new Lembrete();
	lembrete.id = 1;
	lembrete.titulo = 'Hey, ho';
	lembrete.descricao = 'Let\'s go!';
	lembrete.usuario = new Usuario();
	lembrete.arquivado = false;

	const lembreteArquivado: Lembrete = {...lembrete};
	lembreteArquivado.arquivado = true;
	
	const repository = new LembreteRepository();
	jest.spyOn(repository, 'findOneById').mockResolvedValue(lembrete);
	jest.spyOn(repository, 'save').mockResolvedValue(lembreteArquivado);

	const makeSut = () => new ArchiveLembreteUsecase(repository);

	test('Chama \'findOneById\' e \'save\' no Repositório de Lembrete', async () => {
		const sut = makeSut();
		await sut.execute(1);

		expect(repository.findOneById).toBeCalled();
		expect(repository.save).toBeCalled();
	});

	test('Retorna lembrete com propriedade \'arquivado\' true', async () => {
		const sut = makeSut()
		const result = await sut.execute(1);

		expect(result?.arquivado).toBeTruthy();
	});
});