import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { bad, notfound, unauthorized } from "../../shared/helpers/httpResponses";
import { UsuarioRepository } from "./repository";
import bcrypt from 'bcryptjs';
import { appEnv } from '../../env/appEnv';

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

export const validateRemoveUser = async (req: Request, res: Response, next: NextFunction) => {
	if(!req.body.senha) return unauthorized(res, 'Erro: procedimento não autorizado sem informar senha.');
	
	const id = Number(req.params.id);
	if(isNaN(id)) return bad(res, 'Erro: id informado está em formato inválido.');

	const usuarioRepository = new UsuarioRepository();
	const user = await usuarioRepository.findById(id);
	if(!user || user.excluido) return notfound(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);

	const senhaPass = await bcrypt.compare(req.body.senha, user.senha);
	if(!senhaPass) return unauthorized(res, 'Erro: senha incorreta.');

	req.body.user = user;

	next();
}

function tokenIsPresent(req: Request) {
	return req.cookies.sign !== undefined && req.cookies.token !== undefined;
}

export const validateUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
	const id = Number(req.params.id);
	if(isNaN(id)) return bad(res, 'Erro: id informado está em formato inválido.');

	if(!tokenIsPresent(req)) return bad(res, 'Token não encontrado ou inválido.');

	const token = `${req.cookies.token}.${req.cookies.sign}`;

	try {
		const tokenPayload = jwt.verify(token, appEnv.secret)

		const usuarioRepository = new UsuarioRepository();
		const user = await usuarioRepository.findById(id);
		if(!user || user.excluido) return notfound(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);

		if((tokenPayload as {id: number}).id !== id) return unauthorized(res, 'Não autorizado.');

		const nome = req.body.nome;
		const username = req.body.username;
		if(!nome && !username) return bad(res, 'Erro: Impossível atualizar usuário com o objeto enviado.');
		
		if(username){
			const userWithSameUsername = await usuarioRepository.findByUsername(username);
			const usernameInUse = !!userWithSameUsername && userWithSameUsername.id !== id;
			if(usernameInUse) return res.status(409).send('Erro: este nome de usuário não está disponível.');
		}

		req.body.user = user;

		next();
	} catch (error: any) {
		if(error instanceof TokenExpiredError) {
			return bad(res, 'Token expirado. Autentique-se novamente.');
		}
		
		if(error instanceof JsonWebTokenError) {
			return bad(res, 'Token não encontrado ou inválido.');
		}
	}
}