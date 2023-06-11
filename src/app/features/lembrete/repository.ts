import { Repository } from "typeorm";
import { Lembrete } from "../../../entity/Lembrete";
import { Usuario } from "../../../entity/Usuario";
import mapper from "../../../mappings/mapper";
import LembreteDto from "./dto/LembreteDto";
import db from "../../../main/config/dataSource";

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

	private getLembrete(titulo: string, descricao: string, criadoEm: Date, usuario: Usuario) {
		const newLembrete = new Lembrete();
		newLembrete.titulo = titulo;
		newLembrete.descricao = descricao;
		newLembrete.usuario = usuario;
		newLembrete.criadoEm = criadoEm;
		newLembrete.arquivado = false;
	
		return newLembrete;
	}

	async create(titulo: string, descricao: string, usuario: Usuario) {
		const lembrete = this.getLembrete(titulo, descricao, new Date(), usuario);

		return await this.repository.save(lembrete);
	}
}