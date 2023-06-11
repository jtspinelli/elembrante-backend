import { Request } from "express";
import { UsuarioRepository } from "../repository";
import { Usuario } from "../../../../entity/Usuario";

export class RemoveUsuarioUsecase {
	private usuarioRepository: UsuarioRepository;

	constructor(){
		this.usuarioRepository = new UsuarioRepository();
	}

	async execute(req: Request) {
		const user: Usuario = req.body.user;
		user.excluido = true;
		user.username += ' [Registro excluído] - ' + Math.floor(new Date().getTime() / 1000);

		await this.usuarioRepository.save(user);
	}
}