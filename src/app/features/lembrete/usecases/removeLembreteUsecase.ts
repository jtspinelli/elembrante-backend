import { LembreteRepository } from "../repository";

export class RemoveLembreteUsecase {
	private repository: LembreteRepository;

	constructor() {
		this.repository = new LembreteRepository();
	}

	async execute(id: number) {
		const lembrete = await this.repository.findOneById(id);
		if(!lembrete) return;

		await this.repository.remove(lembrete);
	}
}