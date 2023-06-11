import { LembreteRepository } from "../repository";

export class GetLembretesUsecase {
	private lembreteRepository: LembreteRepository;

	constructor() {
		this.lembreteRepository = new LembreteRepository();
	}

	async execute(usuarioId: number) {
		return await this.lembreteRepository.getAll(usuarioId);
	}
}