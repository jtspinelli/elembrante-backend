import { tokenRepository, usuarioRepository } from '../..';
import { bad, success, unauthorized } from '../httpResponses';
import { lembreteRepository } from './../../index';
import { ValidatedResponse } from '../../entity/ValidatedResponse';
import { Request, Response } from 'express';
import { internalError } from './../httpResponses';
import { Lembrete } from '../../entity/Lembrete';
import { Usuario } from '../../entity/Usuario';

const tokenIsPresent = (req: Request) => {
	return req.headers.access_token as string !== undefined;
}

const tokenNotPresent = (req: Request) => {
	return !tokenIsPresent(req);
}

const getTokenValidation = async (req: Request, userId: number) => {
	const today = new Date();
	const savedToken = await tokenRepository.findOneBy({userId});
	return { 
		userHasValidToken: savedToken && today < savedToken.expiraEm,
		requestTokenPass: savedToken && (req.headers.access_token as string) === savedToken.accessToken
	 };
}

const validate = async (req: Request, res: Response, requiredFields: string[], requiredNumberFields: string[]) => {
	if(tokenNotPresent(req)) return unauthorized(res, 'Token não encontrado ou inválido.');
	if(requiredFieldsAreNotPresent(req, requiredFields, requiredNumberFields)) return bad(res, 'Erro: impossível criar um lembrete com o objeto enviado.');	
	const usuario = await userWasFound(req.body.userId);
	if(!usuario) return bad(res, `Erro: o id ${req.body.userId} não está vinculado a nenhum usuário ativo.`);
	const tokenValidation = await getTokenValidation(req, usuario.id);
	if(!tokenValidation.userHasValidToken) return bad(res, 'Erro: o usuário não possui token válido. Autentique-se novamente.');
	if(!tokenValidation.requestTokenPass) return unauthorized(res, 'Erro: não autorizado.');

	const response = new ValidatedResponse();
	response.pass = true;
	if(usuario) response.usuario = usuario;

	requiredFields.forEach(field => {
		eval(`
			response.${field} = req.body.${field};
		`);
	});

	return response;
}

const requiredFieldsArePresent = (req: Request, requiredFields: string[], requiredNumberFields: string[]) => {
	let result = true;

	requiredFields.forEach(field => {
		eval(`
			const ${field} = req.body.${field};

			if(!${field}) result = false;
		`);
	});

	requiredNumberFields.forEach(numberField => {
		eval(`
			const ${numberField} = Number(req.body.${numberField});
			if(!${numberField}) result = false;
		`);
	})

	return result;
}

const requiredFieldsAreNotPresent = (req: Request, requiredFields: string[], requiredNumberFields: string[]) => {
	return !requiredFieldsArePresent(req, requiredFields, requiredNumberFields);
}

const userWasFound = async (id: number) => {
	const user = await usuarioRepository.findOneBy({id});
	if(!user) return false;

	return user;
}

const getLembrete = (titulo: string, descricao: string, usuario: Usuario) => {
	const newLembrete = new Lembrete();
	newLembrete.titulo = titulo;
	newLembrete.descricao = descricao;
	newLembrete.usuario = usuario;
	newLembrete.excluido = false;

	return newLembrete;
}

export const addLembrete = async (req: Request, res: Response) => {
	const validation = await validate(req, res, ["titulo", "descricao"], ["userId"]);
	if(!(validation instanceof ValidatedResponse)) return;

	const { titulo, descricao, usuario } = validation;

	const newLembrete = getLembrete(titulo, descricao, usuario);

	lembreteRepository.save(newLembrete)
		.then(() => success(res))
		.catch((err) => {
			console.log(err);	
			internalError(res)
		});
}