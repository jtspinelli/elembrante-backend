import jwt from 'jsonwebtoken';
import { lembreteRepository } from './../../index';
import { usuarioRepository } from '../..';
import { Request, Response } from 'express';
import { ValidatedResponse } from '../../entity/ValidatedResponse';
import { bad, unauthorized } from '../httpResponses';
import { Lembrete } from '../../entity/Lembrete';

export const validate = async (req: Request, res: Response, requiredFields: { strings: string[], numbers: string[] }, lembreteId: string | null) => {
	const secret = process.env.SECRET;
	if(!secret) return;

	if(tokenNotPresent(req)) return bad(res, 'Token não encontrado ou inválido.');
	if(requiredFieldsAreNotPresent(req, requiredFields)) return bad(res, 'Erro: impossível criar um lembrete com o objeto enviado.');
	
	const accessToken = req.cookies.token + '.' + req.cookies.sign;

	try {
		const payload = jwt.verify(accessToken, secret);

		const tokenExpired = Date.now() > (payload as { exp: number }).exp * 1000;		
		if(tokenExpired) return bad(res, 'Erro: o usuário não possui token válido. Autentique-se novamente.');

		const username = (payload as {username: string}).username;
		const usuario = await usuarioRepository.findOne({
			where: {username: username},
			relations: { lembretes: true }
		});
		if(!usuario) return bad(res, 'Usuário não encontrado');

		let lembrete: Lembrete | null = null;
		if(lembreteId) {
			if(isNaN(Number(lembreteId))) return bad(res, 'Erro: o id do lembrete é inválido.');

			lembrete = await lembreteRepository.findOne({
				where: { id: Number(lembreteId) },
				relations: { usuario: true }
			});

			if(!lembrete) return bad(res, `Erro: o id ${lembreteId} não está vinculado a nenhum lembrete`);
		}

		if(lembrete && lembrete.usuario.id !== usuario.id) return unauthorized(res, 'Erro: não autorizado.');

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
	return req.cookies.sign !== undefined && req.cookies.token !== undefined;
}

const tokenNotPresent = (req: Request) => {
	return !tokenIsPresent(req);
}

const requiredFieldsArePresent = (req: Request, requiredFields: { strings: string[], numbers: string[] }) => {
	let result = true;

	requiredFields.strings.forEach(field => {
		eval(`
			const ${field} = req.body.${field};

			if(${field} === undefined) result = false;
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