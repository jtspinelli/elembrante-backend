import { Repository } from "typeorm";
import { Usuario } from "../../../entity/Usuario";
import db from "../../../main/config/dataSource";
import bcrypt from 'bcrypt';

export class UsuarioRepository {
	private repository: Repository<Usuario>;

	constructor() {
		this.repository = db.getRepository(Usuario);
	}

	async findByUsername(username: string) {
		return await this.repository.findOneBy({username});
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