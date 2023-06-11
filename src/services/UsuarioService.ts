import { Usuario } from '../app/shared/database/entities/Usuario';
import { UsuarioRepository } from '../controller/helpers/types';

class UsuarioService {
	private repository: UsuarioRepository;

	constructor(repository: UsuarioRepository) {
		this.repository = repository;
	}

	async findById(id: number) {
		return await this.repository.findOneBy({id});
	}

	async findByUsername (username: string) {
		return await this.repository.findOneBy({username});
	}

	save(usuario: Usuario) {
		return this.repository.save(usuario);
	}
}

export default UsuarioService;