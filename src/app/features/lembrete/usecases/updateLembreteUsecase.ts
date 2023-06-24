import { Lembrete } from "../../../shared/database/entities/Lembrete";
import { LembreteRepository } from "../repository";
import LembreteDto from "../dto/LembreteDto";
import mapper from "../../../shared/mappings/mapper";

export class UpdateLembreteUsecase {
	private repository: LembreteRepository;

	constructor(repository: LembreteRepository) {
		this.repository = repository;
	}

	getDto(lembrete: Lembrete) {
		return mapper.map(lembrete, Lembrete, LembreteDto);
	}

	async execute(id: number, novoTitulo: string, novaDescricao: string) {
		const lembrete = await this.repository.findOneByIdWithRelations(id);
		if(!lembrete) return;

		lembrete.titulo = novoTitulo;
		lembrete.descricao = novaDescricao;

		const savedLembrete = await this.repository.save(lembrete);

		return this.getDto(savedLembrete);
	}
}