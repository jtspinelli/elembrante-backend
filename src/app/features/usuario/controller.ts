import { Request, Response } from "express";
import { UsuarioRepository } from "./repository";
import { notfound } from "../../helpers/httpResponses";

export const checkUserExistsController = async (req: Request, res: Response) => {
	const usuarioRepository = new UsuarioRepository();
	const username = req.body.username;
	if(!username) return;

	const user = await usuarioRepository.findByUsername(username);
	if(!user) return notfound(res, 'Erro: usuário não encontrado.');

	res.status(200).send();
}