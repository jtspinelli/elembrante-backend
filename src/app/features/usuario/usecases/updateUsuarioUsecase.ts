import { Request } from "express";
import { UsuarioRepository } from "../repository";

export class UpdateUsuarioUsecase {
	private usuarioRepository: UsuarioRepository;

	constructor(){
		this.usuarioRepository = new UsuarioRepository();
	}

	async execute(req: Request) {
		const nome = req.body.nome;
		const username = req.body.username;
		const user = req.body.user;

		user.nome = nome ?? user.nome;
		user.username = username ?? user.username;

		await this.usuarioRepository.save(user);
	}
}