import { Request, Response } from "express";
import { internalError } from "../../helpers/httpResponses";
import { Usuario } from "../../../entity/Usuario";
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

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