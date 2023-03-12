import { lembreteRepository } from './../../index';
import { ValidatedResponse } from '../../entity/ValidatedResponse';
import { Request, Response } from 'express';
import {  internalError } from './../httpResponses';
import { Lembrete } from '../../entity/Lembrete';
import { validate } from './validations';
import { success } from '../httpResponses';
import { Usuario } from '../../entity/Usuario';

const getLembrete = (titulo: string, descricao: string, usuario: Usuario) => {
	const newLembrete = new Lembrete();
	newLembrete.titulo = titulo;
	newLembrete.descricao = descricao;
	newLembrete.usuario = usuario;
	newLembrete.arquivado = false;

	return newLembrete;
}

export const getLembretes = async (req: Request, res: Response) => {
	const validation = await validate(req, res, { strings: [], numbers: []}, null);
	if(!(validation instanceof ValidatedResponse)) return;

	const usuario = validation.usuario;
	const lembretes = usuario.lembretes
		.filter(lembrete => !lembrete.arquivado)
		.map(lembrete => ({
			titulo: lembrete.titulo,
			descricao: lembrete.descricao
		}));

	return res.status(200).send(lembretes);
}

export const addLembrete = async (req: Request, res: Response) => {
	const validation = await validate(req, res, { strings: ['titulo', 'descricao'], numbers: []}, null);
	if(!(validation instanceof ValidatedResponse)) return;

	const { titulo, descricao, usuario } = validation;

	const newLembrete = getLembrete(titulo, descricao, usuario);

	lembreteRepository.save(newLembrete)
		.then(() => success(res))
		.catch(() => internalError(res));
}

export const archiveLembrete = async (req: Request, res: Response) => {
	setArchive(req, res, true);
}

export const recoverLembrete = async (req: Request, res: Response) => {
	setArchive(req, res, false);
}

export const setArchive = async (req: Request, res: Response, value: boolean) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const lembrete = await lembreteRepository.findOneBy({id: Number(req.params.id)});
	if(!lembrete) return;

	lembrete.arquivado = value;
	lembreteRepository.save(lembrete)
		.then(() => success(res))
		.catch(() => internalError(res));
}

export const removeLembrete = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const lembrete = await lembreteRepository.findOneBy({id: Number(req.params.id)});
	if(!lembrete) return;

	lembreteRepository.remove(lembrete)
		.then(() => success(res))
		.catch(() => internalError(res));
}

export const updateLembrete = async (req: Request, res: Response) => {
	const validation = await validate(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const lembrete = await lembreteRepository.findOneBy({id: Number(req.params.id)});
	if(!lembrete) return;

	lembrete.titulo = req.body.titulo;
	lembrete.descricao = req.body.descricao;
	lembreteRepository.save(lembrete)
		.then(() => success(res))
		.catch(() => internalError(res));
}