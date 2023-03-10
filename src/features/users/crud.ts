import { tokenRepository, usuarioRepository } from '../..';
import { bad, internalError, success } from '../httpResponses';
import { Request, Response } from 'express';
import { unauthorized } from './../httpResponses';
import { Usuario } from '../../entity/Usuario';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response) => {
	if(!req.body.nome || !req.body.username || !req.body.senha) return bad(res, 'Impossível criar usuário com o objeto enviado.');

	bcrypt.hash(req.body.senha, 10, (err, hash) => {
		if(err) return internalError(res);

		const newUser = new Usuario();
		newUser.nome = req.body.nome;
		newUser.username = req.body.username;
		newUser.senha = hash;

		usuarioRepository.save(newUser)
			.then(() => success(res))
			.catch(() => internalError(res));
	});
}

export const removeUser = async (req: Request, res: Response) => {
	if(!req.body.senha) return bad(res, 'Erro: procedimento não autorizado sem informar senha.');

	const id = Number(req.params.id);
	if(isNaN(id)) return bad(res, 'Erro: id informado está em formato inválido.');

	const user = await usuarioRepository.findOneBy({id});
	if(!user) return bad(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);

	bcrypt.compare(req.body.senha, user.senha).then(pass => {
		if(!pass) return bad(res, 'Erro: senha incorreta.');

		usuarioRepository.remove(user)
			.then(() => success(res))
			.catch(() => internalError(res));
	});
}

export const updateUser = async (req: Request, res: Response) => {
	const secret = process.env.SECRET;
	if(!secret) return;

	const id = Number(req.params.id);
	if(isNaN(id)) return bad(res, 'Erro: id informado está em formato inválido.');
	
	const accessToken = req.headers.access_token as string;
	if(!accessToken) return unauthorized(res, 'Token não encontrado ou inválido.');

	const user = await usuarioRepository.findOneBy({id});
	if(!user) return bad(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);

	const savedToken = await tokenRepository.findOneBy({userId: user.id});
	if(!savedToken) return bad(res, 'Erro: o usuário não possui token de acesso. Autentique-se.');

	const today = new Date();
	if(today > savedToken.expiraEm) return bad(res, 'Erro: token expirou. Autentique-se novamente.');
	
	if(accessToken !== savedToken.accessToken) return unauthorized(res, 'Não autorizado.');

	const nome = req.body.nome;
	const username = req.body.username;
	if(!nome && !username) return bad(res, 'Erro: Impossível atualizar usuário com o objeto enviado.');

	const userWithSameUsername = await usuarioRepository.findOneBy({username});
	const usernameInUse = userWithSameUsername && userWithSameUsername.id !== id;
	if(usernameInUse) return bad(res, 'Erro: este nome de usuário não está disponível.');

	user.nome = nome ?? user.nome;
	user.username = username ?? user.username;

	usuarioRepository.save(user)
		.then(() => res.status(200).send("okaay"))
		.catch((err) => {
			return internalError(res)
		});
}