import { tokenRepository, usuarioRepository } from '../..';
import { bad, success, unauthorized } from '../httpResponses';
import { lembreteRepository } from './../../index';
import { Request, Response } from 'express';
import { internalError } from './../httpResponses';
import { Lembrete } from '../../entity/Lembrete';

export const addLembrete = async (req: Request, res: Response) => {
	const accessToken = req.headers.access_token as string;
	if(!accessToken) return unauthorized(res, 'Token não encontrado ou inválido.');

	const titulo = req.body.titulo;
	const descricao = req.body.descricao;
	const id = Number(req.body.userId);

	if(!titulo || !descricao || !id) return bad(res, 'Erro: impossível criar um lembrete com o objeto enviado.');

	const user = await usuarioRepository.findOneBy({id});
	if(!user) return bad(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);

	const savedToken = await tokenRepository.findOneBy({userId: user.id});
	if(!savedToken) return bad(res, 'Erro: o usuário não possui token de acesso. Autentique-se.');

	const today = new Date();
	if(today > savedToken.expiraEm) return bad(res, 'Erro: token expirou. Autentique-se novamente.');
	
	if(accessToken !== savedToken.accessToken) return unauthorized(res, 'Não autorizado.');

	const newLembrete = new Lembrete();
	newLembrete.titulo = titulo;
	newLembrete.descricao = descricao;
	newLembrete.usuario = user;
	newLembrete.excluido = false;

	lembreteRepository.save(newLembrete)
		.then(() => success(res))
		.catch((err) => {
			console.log(err);	
			internalError(res)
		});
}