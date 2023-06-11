import { LembreteRepository } from "../repository";

export class RecoverLembreteUsecase {
	private repository: LembreteRepository;

	constructor() {
		this.repository = new LembreteRepository();
	}

	async execute(lembreteId: number) {
		const lembrete = await this.repository.findOneById(lembreteId);
		if(!lembrete) return;

		lembrete.arquivado = false;
		return await this.repository.save(lembrete);
	}
}