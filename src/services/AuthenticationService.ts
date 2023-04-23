import { serialize } from 'cookie';
import { Response } from 'express';
import { Usuario } from '../entity/Usuario';
import { Token } from '../entity/Token';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthenticationService {
	public static checkSenha(senha: string, savedSenha: string): Promise<boolean> {
		return new Promise((res, _rej) => {
			bcrypt.compare(senha, savedSenha).then(pass => {
				res(pass);
			})
		});
	}

	// public static returnToken(savedToken: Token, user: Usuario, res: Response) {
	// 	const userData = { nome: user.nome, username: user.username };
	// 	const access_token = savedToken.accessToken;
	
	// 	return res.status(200).send({userData, access_token});
	// } 

	public static createToken(user: Usuario) {
		const secret = process.env.SECRET;
		if(!secret) return;
		
		return new Promise<{userData: { nome: string, username: string }, headerPayload: string, sign: string} | null>((res, _rej) => {
			const userData = {id: user.id, nome: user.nome, username: user.username };
			jwt.sign(
				userData, 
				secret,
				{
					expiresIn: 600
				},
				(_err, jwtToken) => {
					const sign = serialize('sign', (jwtToken as string).split('.')[2], {
						httpOnly: true,
						secure: true,
						sameSite: 'strict',						
						maxAge: 600,
						path: '/',
					});

					res({userData, headerPayload: `${(jwtToken as string).split('.')[0]}.${(jwtToken as string).split('.')[1]}`, sign})
				}
			);
	
			
		})
	}
}