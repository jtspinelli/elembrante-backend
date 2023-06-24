import { LembreteRepository } from "../repository";

export class RecoverLembreteUsecase {
	private repository: LembreteRepository;

	constructor(repository: LembreteRepository) {
		this.repository = repository;
	}

	async execute(lembreteId: number) {
		const lembrete = await this.repository.findOneById(lembreteId);
		if(!lembrete) return;

		lembrete.arquivado = false;
		return await this.repository.save(lembrete);
	}
}