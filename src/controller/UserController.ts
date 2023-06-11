import { bad, internalError, notfound, success, unauthorized } from "./helpers/httpResponses";
import { AuthenticationService } from "../services/AuthenticationService";
import { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { Usuario } from "../entity/Usuario";
import { ExpressRouteFunc } from "./helpers/types";
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import ValidationService from "../services/ValidationService";
import bcrypt from 'bcrypt';
import UsuarioService from "../services/UsuarioService";

class UserController {
	private validationService: ValidationService;
	private service: UsuarioService;

	constructor(service: UsuarioService, validationService: ValidationService){
		this.service = service;
		this.validationService = validationService;
	}

	// public userExists() : ExpressRouteFunc {
	// 	return async (req: Request, res: Response) => {			
	// 		const username = req.body.username;
	// 		if(!username) return;
			
	// 		const user = await this.service.findByUsername(username);
	// 		if(!user) return notfound(res, 'Erro: usuário não encontrado.');
			
	// 		res.status(200).send();
	// 	}
	// }

	// public createUser() : ExpressRouteFunc {
	// 	return async (req: Request, res: Response) => {
	// 		if(!req.body.nome || !req.body.username || !req.body.senha) return bad(res, 'Impossível criar usuário com o objeto enviado.');

	// 		const user = await this.service.findByUsername(req.body.username);
	// 		if(user) return res.status(409).send('Nome de usuário não disponível.');
			
	// 		bcrypt.hash(req.body.senha, 10, (err, hash) => {
	// 			if(err) return internalError(res);
				
	// 			if(req.body.username.includes('@')){
	// 				return bad(res, 'Para registrar-se com email utilize o loggin via Google');
	// 			}
				
	// 			const newUser = new Usuario();
	// 			newUser.nome = req.body.nome;
	// 			newUser.username = req.body.username;
	// 			newUser.senha = hash;
				
	// 			this.service.save(newUser)
	// 			.then(async () => {
	// 				const data = await AuthenticationService.createToken(newUser);
	// 				res.setHeader('Set-Cookie', data?.headerPayload as string);
	// 				res.setHeader('Set-Cookie', data?.sign as string);
	// 				success(res);
	// 			})
	// 			.catch((e) => {
	// 				if(e.message.includes('Duplicate entry') && e.message.includes('usuario.username')){
	// 					return bad(res, 'Nome de usuário não disponível');
	// 				}
					
	// 				internalError(res);
	// 			});
	// 		});
	// 	}
	// }

	public updateUser() : ExpressRouteFunc {
		return async (req: Request, res: Response) => {

			const secret = process.env.SECRET;
			if(!secret) return;

			const id = Number(req.params.id);
			if(isNaN(id)) return bad(res, 'Erro: id informado está em formato inválido.');
			
			if(this.validationService.tokenNotPresent(req)) return bad(res, 'Token não encontrado ou inválido.');
			
			const token = `${req.cookies.token}.${req.cookies.sign}`;
			try {
				const tokenPayload = jwt.verify(token, secret)
				
				const user = await this.service.findById(id);
				if(!user) return bad(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);
				
				if((tokenPayload as {id: number}).id !== id) return unauthorized(res, 'Não autorizado.');
				
				const nome = req.body.nome;
				const username = req.body.username;
				if(!nome && !username) return bad(res, 'Erro: Impossível atualizar usuário com o objeto enviado.');
				
				if(username){
					const userWithSameUsername = await this.service.findByUsername(username);
					const usernameInUse = !!userWithSameUsername && userWithSameUsername.id !== id;
					if(usernameInUse) return bad(res, 'Erro: este nome de usuário não está disponível.');
				}			
				
				user.nome = nome ?? user.nome;
				user.username = username ?? user.username;
				
				this.service.save(user)
				.then(() => success(res))
				.catch(() => internalError(res));
			} catch (err: any) {
				if(err instanceof TokenExpiredError) {
					return bad(res, 'Token expirado. Autentique-se novamente.');
				}
				
				if(err instanceof JsonWebTokenError) {
					return bad(res, 'Token não encontrado ou inválido.');
				}
			}
		}
	}

	public removeUser() : ExpressRouteFunc {
		return async (req: Request, res: Response) => {

			if(!req.body.senha) return bad(res, 'Erro: procedimento não autorizado sem informar senha.');
			
			const id = Number(req.params.id);
			if(isNaN(id)) return bad(res, 'Erro: id informado está em formato inválido.');
			
			const user = await this.service.findById(id);
			if(!user) return bad(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);
			
			bcrypt.compare(req.body.senha, user.senha).then(async (pass) => {
				if(!pass) return bad(res, 'Erro: senha incorreta.');
				
				const user = await this.service.findById(id);
				if(!user) return;
				
			user.excluido = true;
			user.username += ' [Registro excluído] - ' + Math.floor(new Date().getTime() / 1000);
			
			this.service.save(user)
				.then(() => success(res))
				.catch(() => internalError(res));
			});
		}
	}
}

export default UserController;