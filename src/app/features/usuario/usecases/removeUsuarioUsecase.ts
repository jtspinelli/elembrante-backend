import { Request } from "express";
import { UsuarioRepository } from "../repository";
import { Usuario } from "../../../shared/database/entities/Usuario";

export class RemoveUsuarioUsecase {
	private usuarioRepository: UsuarioRepository;

	constructor(usuarioRepository: UsuarioRepository){
		this.usuarioRepository = usuarioRepository;
	}

	async execute(user: Usuario) {
		user.excluido = true;
		user.username += ' [Registro excluído] - ' + Math.floor(new Date().getTime() / 1000);

		return await this.usuarioRepository.save(user);
	}
}