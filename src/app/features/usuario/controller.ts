import { Request, Response } from "express";
import { UsuarioRepository } from "./repository";
import { bad, internalError, notfound, success } from "../../shared/helpers/httpResponses";
import { CreateUsuarioUsecase } from "./usecases/createUsuarioUsecase";
import { RemoveUsuarioUsecase } from "./usecases/removeUsuarioUsecase";
import { UpdateUsuarioUsecase } from "./usecases/updateUsuarioUsecase";

export const checkUserExistsController = async (req: Request, res: Response) => {
	const usuarioRepository = new UsuarioRepository();
	const username = req.body.username;
	if(!username) return;

	const user = await usuarioRepository.findByUsername(username);
	if(!user) return notfound(res, 'Erro: usuário não encontrado.');

	res.status(200).send();
}

export const createUserController = async (req: Request, res: Response) => {
	try {
		const usuarioRepository = new UsuarioRepository();
		const createUsuarioUsecase = new CreateUsuarioUsecase(usuarioRepository);
		const { nome, username, senha } = req.body;
		const newUserToken = await createUsuarioUsecase.execute(nome, username, senha);
		
		res.setHeader('Set-Cookie', newUserToken?.headerPayload as string);
		res.setHeader('Set-Cookie', newUserToken?.sign as string);
		return success(res);
	} catch (error: any) {
		if(error.message.includes('Duplicate entry') && error.message.includes('usuario.username')){
			return bad(res, 'Nome de usuário não disponível');
		}
		
		internalError(res);
	}
}

export const removeUserController = async (req: Request, res: Response) => {
	try {
		const usuarioRepository = new UsuarioRepository();
		const removeUsuarioUsecase = new RemoveUsuarioUsecase(usuarioRepository);
		await removeUsuarioUsecase.execute(req.body.user);

		return success(res);
	} catch (error: any) {
		return internalError(res);
	}
}

export const updateUserController = async (req: Request, res: Response) => {
	try {
		const { user, nome, username } = req.body;
		const usuarioRepository = new UsuarioRepository();
		const updateUsuarioUsecase = new UpdateUsuarioUsecase(usuarioRepository);
		await updateUsuarioUsecase.execute(user, nome, username);

		return success(res);
	} catch (error: any) {
		return internalError(res);
	}
}