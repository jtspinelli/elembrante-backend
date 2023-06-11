import { UsuarioRepository } from "../repository";
import bcrypt from 'bcrypt';
import { Request } from "express";
import { Usuario } from "../../../../entity/Usuario";
import { internalError } from "../../../helpers/httpResponses";
import { createToken } from "../../login/controller";

export class CreateUsuarioUsecase {
	private usuarioRepository: UsuarioRepository;

	constructor(){
		this.usuarioRepository = new UsuarioRepository();
	}

	async execute(req: Request) {
		return new Promise<{
			userData: {
				nome: string;
				username: string;
			};
			headerPayload: string;
			sign: string;
		} | null | undefined>((res, rej) => {

			bcrypt.hash(req.body.senha, 10, async (err, hash) => {
				// if(err) return internalError(res);
				
				const newUser = new Usuario();
				newUser.nome = req.body.nome;
				newUser.username = req.body.username;
				newUser.senha = hash;
				
				await this.usuarioRepository.save(newUser);
			
				res(await createToken(newUser));
				// res.setHeader('Set-Cookie', data?.headerPayload as string);
				// res.setHeader('Set-Cookie', data?.sign as string);
				// success(res);
				
			});
		})
	}
}