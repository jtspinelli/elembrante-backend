import { LembreteRepository } from "../repository";

export class GetLembretesUsecase {
	private lembreteRepository: LembreteRepository;

	constructor(lembreteRepository: LembreteRepository) {
		this.lembreteRepository = lembreteRepository;
	}

	async execute(usuarioId: number) {
		return await this.lembreteRepository.getAll(usuarioId);
	}
}