import { tokenRepository, usuarioRepository } from '../..';
import { Request, Response } from 'express';
import { ValidatedResponse } from '../../entity/ValidatedResponse';
import { bad, unauthorized } from '../httpResponses';

export const tokenIsPresent = (req: Request) => {
	return req.headers.access_token as string !== undefined;
}

export const tokenNotPresent = (req: Request) => {
	return !tokenIsPresent(req);
}

export const getTokenValidation = async (req: Request, userId: number) => {
	const today = new Date();
	const savedToken = await tokenRepository.findOneBy({userId});
	return { 
		userHasValidToken: savedToken && today < savedToken.expiraEm,
		requestTokenPass: savedToken && (req.headers.access_token as string) === savedToken.accessToken
	 };
}

export const validate = async (req: Request, res: Response, requiredFields: { strings: string[], numbers: string[] }) => {
	if(tokenNotPresent(req)) return unauthorized(res, 'Token não encontrado ou inválido.');
	if(requiredFieldsAreNotPresent(req, requiredFields)) return bad(res, 'Erro: impossível criar um lembrete com o objeto enviado.');	
	const usuario = await getUser(req.body.userId);
	if(!usuario) return bad(res, `Erro: o id ${req.body.userId} não está vinculado a nenhum usuário ativo.`);
	const tokenValidation = await getTokenValidation(req, usuario.id);
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
}

export const requiredFieldsArePresent = (req: Request, requiredFields: { strings: string[], numbers: string[] }) => {
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

export const requiredFieldsAreNotPresent = (req: Request, requiredFields: { strings: string[], numbers: string[] }) => {
	return !requiredFieldsArePresent(req, requiredFields);
}

export const getUser = async (id: number) => {
	return await usuarioRepository.findOneBy({id});
}