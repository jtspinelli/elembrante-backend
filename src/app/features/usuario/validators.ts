import { NextFunction, Request, Response } from "express";
import { bad } from "../../helpers/httpResponses";
import { UsuarioRepository } from "./repository";

export const validateCreateUser = async (req: Request, res: Response, next: NextFunction) => {
	if(!req.body.nome || !req.body.username || !req.body.senha) return bad(res, 'Impossível criar usuário com o objeto enviado.');

	const usuarioRepository = new UsuarioRepository();
	const user = await usuarioRepository.findByUsername(req.body.username);
	if(user) return res.status(409).send('Nome de usuário não disponível.');
	if(req.body.username.includes('@')){
		return bad(res, 'Para registrar-se com email utilize o loggin via Google');
	}
		
	next();
}