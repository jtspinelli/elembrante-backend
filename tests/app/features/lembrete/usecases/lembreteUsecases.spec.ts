import { LembreteRepository } from '../../../../../src/app/features/lembrete/repository';
import { Lembrete } from '../../../../../src/app/shared/database/entities/Lembrete';
import { Usuario } from '../../../../../src/app/shared/database/entities/Usuario';
import { AddLembreteUsecase } from '../../../../../src/app/features/lembrete/usecases/addLembreteUsecase';
import { GetLembretesUsecase } from '../../../../../src/app/features/lembrete/usecases/getLembretesUsecase';
import { ArchiveLembreteUsecase } from '../../../../../src/app/features/lembrete/usecases/archiveLembreteUsecase';
import { RecoverLembreteUsecase } from '../../../../../src/app/features/lembrete/usecases/recoverLembreteUsecase';
import { RemoveLembreteUsecase } from '../../../../../src/app/features/lembrete/usecases/removeLembreteUsecase';
import { UpdateLembreteUsecase } from '../../../../../src/app/features/lembrete/usecases/updateLembreteUsecase';
import LembreteDto from '../../../../../src/app/features/lembrete/dto/LembreteDto';
import mapper from '../../../../../src/app/shared/mappings/mapper';

describe('[LEMBRETE USECASES]', () => {
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
		
		const repository = new LembreteRepository(mapper);
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
	
		const repository = new LembreteRepository(mapper);
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

	describe('[Archive Lembrete Usecase]', () => {
		const lembrete = new Lembrete();
		lembrete.id = 1;
		lembrete.titulo = 'Hey, ho';
		lembrete.descricao = 'Let\'s go!';
		lembrete.usuario = new Usuario();
		lembrete.arquivado = false;
	
		const lembreteArquivado: Lembrete = {...lembrete};
		lembreteArquivado.arquivado = true;
		
		const repository = new LembreteRepository(mapper);
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

	describe('[Recover Lembrete Usecase]', () => {
		const lembrete = new Lembrete();
		lembrete.id = 1;
		lembrete.titulo = 'Hey, ho';
		lembrete.descricao = 'Let\'s go!';
		lembrete.usuario = new Usuario();
		lembrete.arquivado = true;
	
		const lembreteRecuperado: Lembrete = {...lembrete};
		lembreteRecuperado.arquivado = false;
		
		const repository = new LembreteRepository(mapper);
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

	describe('[Remove Lembrete Usecase]', () => {
		const repository = new LembreteRepository(mapper);
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
		
		const repository = new LembreteRepository(mapper);
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
});