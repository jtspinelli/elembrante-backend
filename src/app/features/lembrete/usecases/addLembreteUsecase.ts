
import { LembreteRepository } from "../repository";
import { Usuario } from "../../../../entity/Usuario";
import { Lembrete } from "../../../shared/database/entities/Lembrete";
import mapper from "../../../../mappings/mapper";
import LembreteDto from "../dto/LembreteDto";

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