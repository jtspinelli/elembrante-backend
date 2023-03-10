import { Request, Response } from 'express';
import { usuarioRepository } from '..';
import { Usuario } from '../entity/Usuario';
import bcrypt from 'bcrypt';

const internalError = (res: Response) => {
	return res.status(500).send('Erro interno no servidor.');
}

const success = (res: Response) => {
	return res.status(200).send('Operação realizada com sucesso!');
}

const bad = (res: Response, message: string) => {
	return res.status(400).send(message);
}

export const createUser = async (req: Request, res: Response) => {
	if(!req.body.nome || !req.body.username || !req.body.senha) return bad(res, 'Impossível criar usuário com o objeto enviado.');

	bcrypt.hash(req.body.senha, 10, (err, hash) => {
		if(err) internalError(res);

		const newUser = new Usuario();
		newUser.nome = req.body.nome;
		newUser.username = req.body.username;
		newUser.senha = hash;

		usuarioRepository.save(newUser)
			.then(() => success(res))
			.catch(() => internalError(res));
	});
}

export const removeUser = async (req: Request, res: Response) => {
	if(!req.body.senha) return bad(res, 'Erro: procedimento não autorizado sem informar senha.');

	const id = Number(req.params.id);
	if(isNaN(id)) return bad(res, 'Erro: id informado está em formato inválido.');

	const user = await usuarioRepository.findOneBy({id});
	if(!user) return bad(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);

	bcrypt.compare(req.body.senha, user.senha).then(pass => {
		if(!pass) return bad(res, 'Erro: senha incorreta.');

		usuarioRepository.remove(user)
			.then(() => success(res))
			.catch(() => internalError(res));
	});
}