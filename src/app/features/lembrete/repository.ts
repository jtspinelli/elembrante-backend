import { Repository } from "typeorm";
import { Lembrete } from "../../../entity/Lembrete";
import db from "../../../main/config/dataSource";
import mapper from "../../../mappings/mapper";
import LembreteDto from "./dto/LembreteDto";

export class LembreteRepository {
	private repository: Repository<Lembrete>;

	constructor() {
		this.repository = db.getRepository(Lembrete);
	}

	async getAll(usuarioId: number) {
		const lembretes = await this.repository.createQueryBuilder('lembrete')
			.leftJoinAndSelect("lembrete.usuario", "usuario")
			.where('usuario.id = ' + usuarioId)
			.getMany();
		
			return mapper.mapArray(lembretes, Lembrete, LembreteDto);
	}
}