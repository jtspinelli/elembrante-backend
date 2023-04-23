import { Repository } from 'typeorm';
import { Lembrete } from './../entity/Lembrete';
import { Usuario } from '../entity/Usuario';
import LembreteDto from '../controller/dto/LembreteDto';
import mapper from '../mappings/mapper';

class LembreteService {
	private repository: Repository<Lembrete>;

	constructor(lembreteRepository: Repository<Lembrete>) {
		this.repository = lembreteRepository;
	}

	public async getAll(usuarioId: number) {
		const lembretes = await this.repository.createQueryBuilder('lembrete')
			.leftJoinAndSelect("lembrete.usuario", "usuario")
			.where('usuario.id = ' + usuarioId)
			.getMany();

		return mapper.mapArray(lembretes, Lembrete, LembreteDto);
	}

	public async create(titulo: string, descricao: string, usuario: Usuario ) {
		const lembrete = this.getLembrete(titulo, descricao, new Date(), usuario);

		return this.repository.save(lembrete)
			.then((lembrete: Lembrete) =>  mapper.map(lembrete, Lembrete, LembreteDto))
			.catch(() => null);
	}

	public async update(id: number, novoTitulo: string, novaDescricao: string) {
		const lembrete = await this.repository.findOne({where: {id}, relations: {usuario: true}});
		if(!lembrete) return;
	
		lembrete.titulo = novoTitulo;
		lembrete.descricao = novaDescricao;
		return this.repository.save(lembrete)
			.then((lembrete: Lembrete) => mapper.map(lembrete, Lembrete, LembreteDto))
			.catch(() => undefined);
	}

	public async remove(id: number) {
		const lembrete = await this.repository.findOneBy({id});
		if(!lembrete) return;
	
		return this.repository.remove(lembrete)
			.then(() => true)
			.catch(() => false);
	}

	public async setArchive(id: number, value: boolean) {
		const lembrete = await this.repository.findOneBy({id});
		if(!lembrete) return;
	
		lembrete.arquivado = value;
		return this.repository.save(lembrete)
			.then(() => true)
			.catch(() => false);
	}

	private getLembrete = (titulo: string, descricao: string, criadoEm: Date, usuario: Usuario) => {
		const newLembrete = new Lembrete();
		newLembrete.titulo = titulo;
		newLembrete.descricao = descricao;
		newLembrete.usuario = usuario;
		newLembrete.criadoEm = criadoEm;
		newLembrete.arquivado = false;
	
		return newLembrete;
	}
}

export default LembreteService;