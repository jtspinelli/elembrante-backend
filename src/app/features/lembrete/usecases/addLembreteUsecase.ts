
import { LembreteRepository } from "../repository";
import { Lembrete } from "../../../shared/database/entities/Lembrete";
import { Usuario } from "../../../shared/database/entities/Usuario";
import LembreteDto from "../dto/LembreteDto";
import mapper from "../../../shared/mappings/mapper";

export class AddLembreteUsecase {
	private lembreteRepository: LembreteRepository;

	constructor() {
		this.lembreteRepository = new LembreteRepository();
	}

	async execute(titulo: string, descricao: string, usuario: Usuario) {
		const savedLembrete = await this.lembreteRepository.create(titulo, descricao, usuario);
		return mapper.map(savedLembrete, Lembrete, LembreteDto);	
	}
}