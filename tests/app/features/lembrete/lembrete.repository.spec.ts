import { UsuarioRepository } from '../../../../src/app/features/usuario/repository';
import { LembreteRepository } from "../../../../src/app/features/lembrete/repository";
import { Lembrete } from "../../../../src/app/shared/database/entities/Lembrete";
import { Usuario } from "../../../../src/app/shared/database/entities/Usuario";
import { dbOnClose, initializeDb } from '../../../db.setups';
import { Mapper } from "@automapper/core";
import LembreteDto from '../../../../src/app/features/lembrete/dto/LembreteDto';
import mapper from '../../../../src/app/shared/mappings/mapper';

describe('[LEMBRETE REPOSITORY]', () => {
	beforeAll(initializeDb);
	afterAll(dbOnClose);

	test('Retorna um Lembrete com o id informado', async () => {
		const repository = new LembreteRepository(mapper);
		const result = await repository.findOneById(1);

		expect(result).toBeInstanceOf(Lembrete);
	});

	test('Retorna \'null\' se não encontrado Lembrete com o id informado', async () => {
		const repository = new LembreteRepository(mapper);
		const result = await repository.findOneById(-1);

		expect(result).toBeNull();
	});

	test('Retorna o novo Lembrete salvo com sucesso no banco de dados', async () => {
		const repository = new LembreteRepository(mapper);
		const usuario = await new UsuarioRepository().findById(2);

		const result = await repository.create('Title', 'Description', usuario as Usuario);

		expect(usuario).toBeInstanceOf(Usuario);
		expect(result).toBeInstanceOf(Lembrete);
	});

	test('Retorna lista de Lembretes do Usuário', async () => {
		const repository = new LembreteRepository(mapper);
		jest.spyOn(repository, 'getDtos').mockReturnValue([new LembreteDto(), new LembreteDto()]);
		const result = await repository.getAll(1);

		expect(result.length).toBe(2);
	});

	test('Retorna lista de Lembretes como lista de LembreteDtos', async () => {
		const mockedMapper = {
			mapArray: (lembretes: Lembrete[]) => {
				return lembretes.map(l => new LembreteDto());
			}
		}
		const repository = new LembreteRepository(mockedMapper as unknown as Mapper);
		const lembretes: Lembrete[] = [
			{id: 1, arquivado: false, criadoEm: new Date, descricao: 'Description', titulo: 'Title', usuario: new Usuario()},
			{id: 2, arquivado: false, criadoEm: new Date, descricao: 'Description', titulo: 'Title', usuario: new Usuario()}
		];

		const result = repository.getDtos(lembretes);
		result.forEach(lembrete => {
			expect(lembrete).toBeInstanceOf(LembreteDto);
		});
	});
});