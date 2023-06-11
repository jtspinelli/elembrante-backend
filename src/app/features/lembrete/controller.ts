import { Request, Response } from "express";
import { ValidatedResponse } from "../../../controller/helpers/ValidatedResponse";
import { GetLembretesUsecase } from "./usecases/getLembretesUsecase";
import { AddLembreteUsecase } from "./usecases/addLembreteUsecase";
import { validate } from "./validators";
import { RemoveLembreteUsecase } from "./usecases/removeLembreteUsecase";
import { success } from "../../shared/helpers/httpResponses";

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