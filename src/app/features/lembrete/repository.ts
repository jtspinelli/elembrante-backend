import { Repository } from "typeorm";
import { Lembrete } from "../../shared/database/entities/Lembrete";
import { Usuario } from "../../shared/database/entities/Usuario";
import { Mapper } from "@automapper/core";
import LembreteDto from "./dto/LembreteDto";
import db from "../../../main/config/dataSource";

export class LembreteRepository {
	private repository: Repository<Lembrete>;
	private mapper: Mapper;

	constructor(mapper: Mapper) {
		this.repository = db.getRepository(Lembrete);
		this.mapper = mapper;
	}

	getDtos(lembretes: Lembrete[]) {
		return this.mapper.mapArray(lembretes, Lembrete, LembreteDto);
	}

	async getAll(usuarioId: number) {
		const lembretes = await this.repository.createQueryBuilder('lembrete')
			.leftJoinAndSelect("lembrete.usuario", "usuario")
			.where('usuario.id = ' + usuarioId)
			.getMany();
		
			return this.getDtos(lembretes);
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

	async findOneById(id: number) {
		return await this.repository.findOneBy({id});
	}

	async findOneByIdWithRelations(id: number) {
		return await this.repository.findOne({where: {id}, relations: {usuario: true}});
	}

	async create(titulo: string, descricao: string, usuario: Usuario) {
		const lembrete = this.getLembrete(titulo, descricao, new Date(), usuario);

		return await this.repository.save(lembrete);
	}

	async remove(lembrete: Lembrete) {
		await this.repository.remove(lembrete);
	}

	async save(lembrete: Lembrete) {
		return await this.repository.save(lembrete);
	}
}