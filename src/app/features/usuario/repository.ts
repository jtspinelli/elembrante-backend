import { Repository } from "typeorm";
import db from "../../../main/config/dataSource";
import bcrypt from 'bcrypt';
import { Usuario } from "../../shared/database/entities/Usuario";

export class UsuarioRepository {
	private repository: Repository<Usuario>;

	constructor() {
		this.repository = db.getRepository(Usuario);
	}

	async findByUsername(username: string) {
		return await this.repository.findOneBy({username});
	}

	async findById(id: number) {
		return await this.repository.findOneBy({id});
	}

	checkSenha(senha: string, savedSenha: string): Promise<boolean> {
		return new Promise((res, _rej) => {
			bcrypt.compare(senha, savedSenha).then(pass => {
				res(pass);
			})
		});
	}

	save(usuario: Usuario) {
		return this.repository.save(usuario);
	}
}