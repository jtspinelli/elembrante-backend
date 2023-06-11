import { NextFunction, Request, Response } from "express";
import { bad } from "../../helpers/httpResponses";
import { UsuarioRepository } from "./repository";
import bcrypt from 'bcrypt';

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
	if(!req.body.senha) return bad(res, 'Erro: procedimento não autorizado sem informar senha.');
	
	const id = Number(req.params.id);
	if(isNaN(id)) return bad(res, 'Erro: id informado está em formato inválido.');

	const usuarioRepository = new UsuarioRepository();
	const user = await usuarioRepository.findById(id);
	if(!user || user.excluido) return bad(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);

	const senhaPass = await bcrypt.compare(req.body.senha, user.senha);
	if(!senhaPass) return bad(res, 'Erro: senha incorreta.');

	req.body.user = user;

	next();
}