import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Usuario } from '../app/shared/database/entities/Usuario';

export class AuthenticationService {
	public static checkSenha(senha: string, savedSenha: string): Promise<boolean> {
		return new Promise((res, _rej) => {
			bcrypt.compare(senha, savedSenha).then(pass => {
				res(pass);
			})
		});
	}

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