import { Request, Response } from "express";
import { ValidatedResponse } from "../../../controller/helpers/ValidatedResponse";
import { validate } from "./validators";
import { GetLembretesUsecase } from "./usecases/getLembretesUsecase";

export const getLembretesController = async (req: Request, res: Response) => {
	const validation = await validate(req, res, {strings: [], numbers: []}, null);
	if(!(validation instanceof ValidatedResponse)) return;

	const getLembretesUsecase = new GetLembretesUsecase();
	const lembretes = await getLembretesUsecase.execute(validation.usuario.id);

	return res.status(200).send(lembretes);
}