import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";
import { bad, internalError } from "../../helpers/httpResponses";
import { UsuarioRepository } from "../usuario/repository";
import { Usuario } from "../../../entity/Usuario";
import { serialize } from 'cookie';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

async function createToken(user: Usuario) {
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

export const loginController = async (req: Request, res: Response) => {
	const data = await createToken(req.body.user);
	res.setHeader('Set-Cookie', data?.headerPayload as string);
	res.setHeader('Set-Cookie', data?.sign as string);
	
	if(data) return res.status(200).send(data);
	
	return internalError(res);
}

export const googleLoginController = async (req: Request, res: Response) => {
	const credential = req.body.credential;
			const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + credential;
		
			const googleResponse: AxiosResponse<any, any> = await axios.get(url)
				.then(data => data)
				.catch(e => e);
			if(googleResponse.status !== 200) return bad(res, 'Google Token inválido.');
		
			const usuarioRepository = new UsuarioRepository();
			const user = await usuarioRepository.findByUsername(googleResponse.data.email);
		
			if(user) {
				const data = await createToken(user);
				res.setHeader('Set-Cookie', data?.headerPayload as string);
				res.setHeader('Set-Cookie', data?.sign as string);
				if(data) return res.status(200).send(data);
				return internalError(res);
			}
		
			bcrypt.hash(randomUUID(), 10, (err, hash) => {
				if(err) return internalError(res);
		
				const newUser = new Usuario();
				newUser.nome = googleResponse.data.name;
				newUser.username = googleResponse.data.email;
				newUser.senha = hash;
		
				usuarioRepository.save(newUser)
					.then(async () => {
						const data = await createToken(newUser);
						res.setHeader('Set-Cookie', data?.headerPayload as string);
						res.setHeader('Set-Cookie', data?.sign as string);
						if(data) return res.status(200).send(data);
						return internalError(res);
					})
					.catch(() => internalError(res));
			});
}