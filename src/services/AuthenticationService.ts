import { tokenRepository } from '..';
import { Response } from 'express';
import { Usuario } from '../entity/Usuario';
import { Token } from '../entity/Token';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthenticationService {
	public static checkSenha(senha: string, savedSenha: string): Promise<boolean> {
		return new Promise((res, rej) => {
			bcrypt.compare(senha, savedSenha).then(pass => {
				res(pass);
			})
		});
	}

	public static returnToken(savedToken: Token, user: Usuario, res: Response) {
		const userData = { nome: user.nome, username: user.username };
		const access_token = savedToken.accessToken;
	
		return res.status(200).send({userData, access_token});
	} 

	public static createOrUpdateToken(savedToken: Token | null, user: Usuario, today: Date) {
		const secret = process.env.SECRET;
		if(!secret) return;
		
		return new Promise<{userData: { nome: string, username: string }, access_token: string} | null>((res, _rej) => {
			const userData = { nome: user.nome, username: user.username };
			const access_token = jwt.sign(userData, secret);
	
			const token = savedToken ?? new Token();
			token.userId = user.id;
			token.accessToken = access_token
	
			token.expiraEm = new Date(new Date().setDate(today.getDate() + 5));
			
			tokenRepository.save(token)
				.then(() => res({userData, access_token}))
				.catch(() => res(null));
		})
	}
}