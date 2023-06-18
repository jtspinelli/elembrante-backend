import { Request, Response } from "express";
import { GetLembretesUsecase } from "./usecases/getLembretesUsecase";
import { AddLembreteUsecase } from "./usecases/addLembreteUsecase";
import { RemoveLembreteUsecase } from "./usecases/removeLembreteUsecase";
import { ArchiveLembreteUsecase } from "./usecases/archiveLembreteUsecase";
import { RecoverLembreteUsecase } from "./usecases/recoverLembreteUsecase";
import { validate } from "./validators";
import { success } from "../../shared/helpers/httpResponses";
import { UpdateLembreteUsecase } from "./usecases/updateLembreteUsecase";
import { ValidatedResponse } from "../../shared/helpers/ValidatedResponse";
import { LembreteRepository } from "./repository";

export const getLembretesController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, null);
	if(!(validation instanceof ValidatedResponse)) return;

	const repository = new LembreteRepository();
	const getLembretesUsecase = new GetLembretesUsecase(repository);
	const lembretes = await getLembretesUsecase.execute(validation.usuario.id);

	return res.status(200).send(lembretes);
}

export const addLembreteController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: ['titulo', 'descricao'], numbers: []}, null);
	if(!(validation instanceof ValidatedResponse)) return;

	const { titulo, descricao, usuario } = validation;
	const repository = new LembreteRepository();
	const addLembreteUsecase = new AddLembreteUsecase(repository);
	const savedLembreteDto = await addLembreteUsecase.execute(titulo, descricao, usuario);

	return res.status(200).send(savedLembreteDto);
}

export const removeLembreteController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const repository = new LembreteRepository();
	const removeLembreteUsecase = new RemoveLembreteUsecase(repository);
	await removeLembreteUsecase.execute(Number(req.params.id));

	return success(res);
}

export const archiveLembreteController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const repository = new LembreteRepository();
	const archiveLembreteUsecase = new ArchiveLembreteUsecase(repository);
	await archiveLembreteUsecase.execute(Number(req.params.id));

	return success(res);
}

export const recoverLembreteController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const repository = new LembreteRepository();
	const recoverLembreteUsecase = new RecoverLembreteUsecase(repository);
	await recoverLembreteUsecase.execute(Number(req.params.id));

	return success(res);
}

export const updateLembreteController = async (req: Request, res: Response) =>  {
	const validation = await validate(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const repository = new LembreteRepository();
	const updateLembreteUsecase = new UpdateLembreteUsecase(repository);
	const savedLembrete = await updateLembreteUsecase.execute(Number(req.params.id), req.body.titulo, req.body.descricao);

	return res.status(200).send(savedLembrete);
}