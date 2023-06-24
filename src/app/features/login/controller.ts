import { Request, Response } from "express";
import { internalError } from "../../shared/helpers/httpResponses";
import { UsuarioRepository } from "../usuario/repository";
import { GoogleLoginUsecase } from "./usecases/googleLoginUsecase";
import { InvalidGoogleTokenError } from "../../shared/errors/InvalidGoogleTokenError";
import { LoginUsecase } from './usecases/loginUsecase';

export const loginController = async (req: Request, res: Response) => {
	const loginUsecase = new LoginUsecase();
	const data = await loginUsecase.execute(req.body.user);
	
	res.setHeader('Set-Cookie', data?.headerPayload as string);
	res.setHeader('Set-Cookie', data?.sign as string);
	
	if(data) return res.status(200).send(data);
	
	return internalError(res);
}

export const googleLoginController = async (req: Request, res: Response) => {
	const repository = new UsuarioRepository();
	const googleLoginUsecase = new GoogleLoginUsecase(repository);

	try {
		const data = await googleLoginUsecase.execute(req.body.credential);
		res.setHeader('Set-Cookie', data?.headerPayload as string);
		res.setHeader('Set-Cookie', data?.sign as string);
		return res.status(200).send(data);
	} catch(error: any) {
		if(error instanceof InvalidGoogleTokenError) return error.respond(res);
	}
}