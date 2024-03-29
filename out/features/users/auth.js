"use strict";
// import { bad, unauthorized, internalError } from '../httpResponses';
// import { AuthenticationService } from '../../services/AuthenticationService';
// import { Request, Response } from 'express';
// import { usuarioRepository } from '../..';
// import { tokenRepository } from './../../index';
// import { Usuario } from '../../entity/Usuario';
// import axios, { AxiosResponse } from 'axios';
// import bcrypt from 'bcrypt';
// import crypto from 'crypto';
// export const authenticateUser = async (req: Request, res: Response) => {
// 	const secret = process.env.SECRET;
// 	if(!secret) return;
// 	const senha = req.body.senha;
// 	const username = req.body.username;
// 	if(!senha || !username ) return bad(res, 'Erro: dados necessários não encontrados no objeto enviado.');
// 	if(username.includes('@')) return bad(res, 'Para logar com Gmail utilize o GoogleLogin');
// 	const user = await usuarioRepository.findOneBy({username});
// 	if(!user) return bad(res, `Erro: usuário ${username} não encontrado.`);
// 	const senhaIsCorrect = await AuthenticationService.checkSenha(senha, user.senha);
// 	if(!senhaIsCorrect) return unauthorized(res, 'Err: usuário e/ou senha incorretos.');
// 	const data = await AuthenticationService.createOrUpdateToken(user);
// 	res.setHeader('Set-Cookie', data?.headerPayload as string);
// 	res.setHeader('Set-Cookie', data?.sign as string);
// 	if(data) return res.status(200).send(data);
// 	return internalError(res);
// }
// export const googleLogin = async (req: Request, res: Response) => {
// 	const credential = req.body.credential;
// 	const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + credential;
// 	const googleResponse: AxiosResponse<any, any> = await axios.get(url)
// 		.then(data => data)
// 		.catch(e => e);
// 	if(googleResponse.status !== 200) return bad(res, 'Google Token inválido.');
// 	const user = await usuarioRepository.findOneBy({username: googleResponse.data.email});
// 	if(user) {
// 		const data = await AuthenticationService.createOrUpdateToken(user);
// 		res.setHeader('Set-Cookie', data?.headerPayload as string);
// 		res.setHeader('Set-Cookie', data?.sign as string);
// 		if(data) return res.status(200).send(data);
// 		return internalError(res);
// 	}
// 	bcrypt.hash(crypto.randomUUID(), 10, (err, hash) => {
// 		if(err) return internalError(res);
// 		const newUser = new Usuario();
// 		newUser.nome = googleResponse.data.name;
// 		newUser.username = googleResponse.data.email;
// 		newUser.senha = hash;
// 		usuarioRepository.save(newUser)
// 			.then(async () => {
// 				const data = await AuthenticationService.createOrUpdateToken(newUser);
// 				res.setHeader('Set-Cookie', data?.headerPayload as string);
// 				res.setHeader('Set-Cookie', data?.sign as string);
// 				if(data) return res.status(200).send(data);
// 				return internalError(res);
// 			})
// 			.catch(() => internalError(res));
// 	});
// }
