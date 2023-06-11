import { Request, Response, NextFunction } from 'express';
import { bad, unauthorized } from '../../shared/helpers/httpResponses';
import { UsuarioRepository } from '../usuario/repository';

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
	const secret = process.env.SECRET;
	if(!secret) return;

	const senha = req.body.senha;
	const username = req.body.username;
	if(!senha || !username ) return bad(res, 'Erro: dados necessários não encontrados no objeto enviado.');
	
	if(username.includes('@')) return bad(res, 'Para logar com Gmail utilize o GoogleLogin');

	const usuarioRepository = new UsuarioRepository();

	const user = await usuarioRepository.findByUsername(username);
	if(!user) return bad(res, `Erro: usuário ${username} não encontrado.`);

	const senhaIsCorrect = await usuarioRepository.checkSenha(senha, user.senha);
	if(!senhaIsCorrect) return unauthorized(res, 'Err: usuário e/ou senha incorretos.');

	req.body.user = user;

	next();
}