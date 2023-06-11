import { Request, Response } from "express";
import { ValidatedResponse } from "../../../controller/helpers/ValidatedResponse";
import { GetLembretesUsecase } from "./usecases/getLembretesUsecase";
import { AddLembreteUsecase } from "./usecases/addLembreteUsecase";
import { RemoveLembreteUsecase } from "./usecases/removeLembreteUsecase";
import { ArchiveLembreteUsecase } from "./usecases/archiveLembreteUsecase";
import { RecoverLembreteUsecase } from "./usecases/recoverLembreteUsecase";
import { validate } from "./validators";
import { success } from "../../shared/helpers/httpResponses";
import { UpdateLembreteUsecase } from "./usecases/updateLembreteUsecase";

export const getLembretesController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, null);
	if(!(validation instanceof ValidatedResponse)) return;

	const getLembretesUsecase = new GetLembretesUsecase();
	const lembretes = await getLembretesUsecase.execute(validation.usuario.id);

	return res.status(200).send(lembretes);
}

export const addLembreteController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: ['titulo', 'descricao'], numbers: []}, null);
	if(!(validation instanceof ValidatedResponse)) return;

	const { titulo, descricao, usuario } = validation;
	const addLembreteUsecase = new AddLembreteUsecase();
	const savedLembreteDto = await addLembreteUsecase.execute(titulo, descricao, usuario);

	return res.status(200).send(savedLembreteDto);
}

export const removeLembreteController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const removeLembreteUsecase = new RemoveLembreteUsecase();
	await removeLembreteUsecase.execute(Number(req.params.id));

	return success(res);
}

export const archiveLembreteController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const archiveLembreteUsecase = new ArchiveLembreteUsecase();
	await archiveLembreteUsecase.execute(Number(req.params.id));

	return success(res);
}

export const recoverLembreteController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const recoverLembreteUsecase = new RecoverLembreteUsecase();
	await recoverLembreteUsecase.execute(Number(req.params.id));

	return success(res);
}

export const updateLembreteController = async (req: Request, res: Response) =>  {
	const validation = await validate(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, req.params.id);
	if(!(validation instanceof ValidatedResponse)) return;

	const updateLembreteUsecase = new UpdateLembreteUsecase();
	const savedLembrete = await updateLembreteUsecase.execute(Number(req.params.id), req.body.titulo, req.body.descricao);

	return res.status(200).send(savedLembrete);
}