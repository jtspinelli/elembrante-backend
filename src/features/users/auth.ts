import { bad, unauthorized, internalError } from '../httpResponses';
import { AuthenticationService } from '../../services/AuthenticationService';
import { Request, Response } from 'express';
import { usuarioRepository } from '../..';
import { tokenRepository } from './../../index';

export const authenticateUser = async (req: Request, res: Response) => {
	const secret = process.env.SECRET;
	if(!secret) return;

	const senha = req.body.senha;
	const username = req.body.username;
	if(!senha || !username ) return bad(res, 'Erro: dados necessários não encontrados no objeto enviado.');

	const user = await usuarioRepository.findOneBy({username});
	if(!user) return bad(res, `Erro: usuário ${username} não encontrado.`);

	const senhaIsCorrect = await AuthenticationService.checkSenha(senha, user.senha);
	if(!senhaIsCorrect) return unauthorized(res, 'Err: usuário e/ou senha incorretos.');

	const savedToken = await tokenRepository.findOneBy({username});
	const today = new Date();
	const savedTokenExpired = savedToken && today > savedToken.expiraEm;

	if(!savedToken || savedTokenExpired) {
		const data = await AuthenticationService.createOrUpdateToken(savedToken, user, today);
		if(data) return res.status(200).send(data);
		return internalError(res);
	}

	const validToken = savedToken && today < savedToken.expiraEm;
	if(validToken) AuthenticationService.returnToken(savedToken, user, res);
}