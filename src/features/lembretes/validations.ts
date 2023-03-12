import jwt from 'jsonwebtoken';
import { tokenRepository, usuarioRepository } from '../..';
import { lembreteRepository } from './../../index';
import { Request, Response } from 'express';
import { ValidatedResponse } from '../../entity/ValidatedResponse';
import { bad, unauthorized } from '../httpResponses';
import { Lembrete } from '../../entity/Lembrete';
import { Usuario } from '../../entity/Usuario';

export const validate = async (req: Request, res: Response, requiredFields: { strings: string[], numbers: string[] }, lembreteId: string | null) => {
	const secret = process.env.SECRET;
	if(!secret) return;

	if(tokenNotPresent(req)) return unauthorized(res, 'Token não encontrado ou inválido.');
	if(requiredFieldsAreNotPresent(req, requiredFields)) return bad(res, 'Erro: impossível criar um lembrete com o objeto enviado.');
	
	let lembrete: Lembrete | null = null;
	if(lembreteId) {
		if(isNaN(Number(lembreteId))) return bad(res, 'Erro: o id do lembrete é inválido.');

		lembrete = await lembreteRepository.findOne({
			where: { id: Number(lembreteId) },
			relations: { usuario: true }
		});

		if(!lembrete) return bad(res, `Erro: o id ${lembreteId} não está vinculado a nenhum lembrete`);
	}

	try {
		const payload = jwt.verify(req.headers.access_token as string, secret);
		const username = (payload as {username: string}).username;
		const usuario = await usuarioRepository.findOne({
			where: {username: username},
			relations: { lembretes: true }
		});
		if(!usuario) return bad(res, 'Usuário não encontrado');

		const tokenValidation = await getTokenValidation(req, usuario);
		if(!tokenValidation.userHasValidToken) return bad(res, 'Erro: o usuário não possui token válido. Autentique-se novamente.');
		if(!tokenValidation.requestTokenPass) return unauthorized(res, 'Erro: não autorizado.');

		const response = new ValidatedResponse();
		response.pass = true;
		if(usuario) response.usuario = usuario;

		requiredFields.strings.forEach(field => {
			eval(`
				response.${field} = req.body.${field};
			`);
		});

		return response;

	} catch (err) {
		return bad(res, 'Token inválido.');
	}		
}

const tokenIsPresent = (req: Request) => {
	return req.headers.access_token as string !== undefined;
}

const tokenNotPresent = (req: Request) => {
	return !tokenIsPresent(req);
}

const getTokenValidation = async (req: Request, usuario: Usuario) => {
	const today = new Date();
	const savedToken = await tokenRepository.findOneBy({userId: usuario.id});
	return { 
		userHasValidToken: savedToken && today < savedToken.expiraEm,
		requestTokenPass: savedToken && (req.headers.access_token as string) === savedToken.accessToken
	 };
}

const requiredFieldsArePresent = (req: Request, requiredFields: { strings: string[], numbers: string[] }) => {
	let result = true;

	requiredFields.strings.forEach(field => {
		eval(`
			const ${field} = req.body.${field};

			if(!${field}) result = false;
		`);
	});

	requiredFields.numbers.forEach(numberField => {
		eval(`
			const ${numberField} = Number(req.body.${numberField});
			if(!${numberField}) result = false;
		`);
	})

	return result;
}

const requiredFieldsAreNotPresent = (req: Request, requiredFields: { strings: string[], numbers: string[] }) => {
	return !requiredFieldsArePresent(req, requiredFields);
}

const getUser = async (id: number) => {
	return await usuarioRepository.findOneBy({id});
}