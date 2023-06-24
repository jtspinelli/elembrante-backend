import { Request } from "express";
import { UsuarioRepository } from "../repository";
import { Usuario } from "../../../shared/database/entities/Usuario";

export class UpdateUsuarioUsecase {
	private usuarioRepository: UsuarioRepository;

	constructor(usuarioRepository: UsuarioRepository){
		this.usuarioRepository = usuarioRepository;
	}

	async execute(user: Usuario, nome: string, username: string) {
		user.nome = nome ?? user.nome;
		user.username = username ?? user.username;

		return await this.usuarioRepository.save(user);
	}
}