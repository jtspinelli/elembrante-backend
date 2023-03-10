import { bad, unauthorized, internalError } from '../httpResponses';
import { Request, Response } from 'express';
import { usuarioRepository } from '../..';
import { tokenRepository } from './../../index';
import { Token } from '../../entity/Token';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const authenticateUser = async (req: Request, res: Response) => {
	const secret = process.env.SECRET;
	if(!secret) return;

	const senha = req.body.senha;
	const username = req.body.username;
	if(!senha || !username ) return bad(res, 'Erro: dados necessários não encontrados no objeto enviado.');

	const user = await usuarioRepository.findOneBy({username});
	if(!user) return bad(res, `Erro: usuário ${username} não encontrado.`);

	bcrypt.compare(senha, user.senha).then(async (pass) => {
		if(!pass) return unauthorized(res, 'Erro: usuário e/ou senha incorretos.');

		const savedToken = await tokenRepository.findOneBy({username});
		const today = new Date();
		const tokenExpired = savedToken && today > savedToken?.expiraEm;

		if(!savedToken || tokenExpired) {
			const userData = { nome: user.nome, username: user.username };
			const access_token = jwt.sign(userData, secret);

			const token = savedToken ?? new Token();
			token.username = user.username;
			token.accessToken = access_token

			token.expiraEm = new Date(new Date().setDate(today.getDate() + 5));
			
			tokenRepository.save(token)
				.then(() => res.status(200).send({userData, access_token}))
				.catch(() => internalError(res));
			return;
		}

		const validToken = savedToken && today < savedToken.expiraEm;
		if(validToken) {
			const userData = { nome: user.nome, username: user.username };
			const access_token = savedToken.accessToken;

			return res.status(200).send({userData, access_token});
		}
	});
}