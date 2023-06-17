import { UsuarioRepository } from "../repository";
import { createToken } from "../../login/controller";
import { Usuario } from "../../../shared/database/entities/Usuario";
import bcrypt from 'bcryptjs';

export class CreateUsuarioUsecase {
	private usuarioRepository: UsuarioRepository;

	constructor(usuarioRepository: UsuarioRepository){
		this.usuarioRepository = usuarioRepository;
	}

	async createToken(usuario: Usuario) {
		return await createToken(usuario);
	}

	async execute(nome: string, username: string, senha: string) {
		return new Promise<{
			userData: {
				nome: string;
				username: string;
			};
			headerPayload: string;
			sign: string;
		} | null | undefined>(async (res) => {
			const newUser = new Usuario();
			newUser.nome = nome;
			newUser.username = username;
			newUser.senha = await bcrypt.hash(senha, 10);
			
			await this.usuarioRepository.save(newUser);
		
			res(await this.createToken(newUser));			
		});
	}
}