import jwt from 'jsonwebtoken';
import { Repository } from "typeorm";
import { Usuario } from "../entity/Usuario";
import { Lembrete } from "../entity/Lembrete";
import { Request, Response } from "express";
import { bad, unauthorized } from "../controller/httpResponses";
import { ValidatedResponse } from '../entity/ValidatedResponse';

class ValidationService {
	private usuarioRepository: Repository<Usuario>;
	private lembreteRepository: Repository<Lembrete>;

	constructor(usuarioRepository: Repository<Usuario>, lembreteRepository: Repository<Lembrete>){
		this.usuarioRepository = usuarioRepository;
		this.lembreteRepository = lembreteRepository;
	}

	public async validate(req: Request, res: Response, requiredFields: { strings: string[], numbers: string[] }, lembreteId: string | null) {
		const secret = process.env.SECRET;
		if(!secret) return;
	
		if(this.tokenNotPresent(req)) return bad(res, 'Token não encontrado ou inválido.');
		if(this.requiredFieldsAreNotPresent(req, requiredFields)) return bad(res, 'Erro: impossível criar um lembrete com o objeto enviado.');
		
		const accessToken = req.cookies.token + '.' + req.cookies.sign;
	
		try {
			const payload = jwt.verify(accessToken, secret);
	
			const tokenExpired = Date.now() > (payload as { exp: number }).exp * 1000;		
			if(tokenExpired) return bad(res, 'Erro: o usuário não possui token válido. Autentique-se novamente.');
	
			const username = (payload as {username: string}).username;
			const usuario = await this.usuarioRepository.findOne({
				where: {username: username},
				relations: { lembretes: true }
			});
			if(!usuario) return bad(res, 'Usuário não encontrado');
	
			let lembrete: Lembrete | null = null;
			if(lembreteId) {
				if(isNaN(Number(lembreteId))) return bad(res, 'Erro: o id do lembrete é inválido.');
	
				lembrete = await this.lembreteRepository.findOne({
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

	private tokenIsPresent(req: Request) {
		return req.cookies.sign !== undefined && req.cookies.token !== undefined;
	}
	
	public tokenNotPresent(req: Request) {
		return !this.tokenIsPresent(req);
	}

	private requiredFieldsArePresent(req: Request, requiredFields: { strings: string[], numbers: string[] }) {
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

	private requiredFieldsAreNotPresent(req: Request, requiredFields: { strings: string[], numbers: string[] }) {
		return !this.requiredFieldsArePresent(req, requiredFields);
	}
}

export default ValidationService;