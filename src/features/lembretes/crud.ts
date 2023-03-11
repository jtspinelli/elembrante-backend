import { lembreteRepository } from './../../index';
import { ValidatedResponse } from '../../entity/ValidatedResponse';
import { Request, Response } from 'express';
import { internalError } from './../httpResponses';
import { Lembrete } from '../../entity/Lembrete';
import { validate } from './validations';
import { success } from '../httpResponses';
import { Usuario } from '../../entity/Usuario';

const getLembrete = (titulo: string, descricao: string, usuario: Usuario) => {
	const newLembrete = new Lembrete();
	newLembrete.titulo = titulo;
	newLembrete.descricao = descricao;
	newLembrete.usuario = usuario;
	newLembrete.excluido = false;

	return newLembrete;
}

export const addLembrete = async (req: Request, res: Response) => {
	const validation = await validate(req, res, { strings: ['titulo', 'descricao'], numbers: ['userId'] });
	if(!(validation instanceof ValidatedResponse)) return;

	const { titulo, descricao, usuario } = validation;

	const newLembrete = getLembrete(titulo, descricao, usuario);

	lembreteRepository.save(newLembrete)
		.then(() => success(res))
		.catch(() => internalError(res));
}