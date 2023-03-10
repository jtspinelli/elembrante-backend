import { Request, Response } from 'express';
import { usuarioRepository } from '..';
import { Usuario } from '../entity/Usuario';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response) => {
	if(!req.body.nome || !req.body.username || !req.body.senha) return res.status(400).send("Impossível criar usuário com o objeto enviado.");

	bcrypt.hash(req.body.senha, 10, (err, hash) => {
		if(err) return res.status(500).send("Internal error.");

		const newUser = new Usuario();
		newUser.nome = req.body.nome;
		newUser.username = req.body.username;
		newUser.senha = hash;

		usuarioRepository.save(newUser)
			.then(() => res.status(200).send("Okayy"))
			.catch(() => res.status(500).send("Internal error"));

	});
}

export const removeUser = async (req: Request, res: Response) => {	
	const id = Number(req.params.id);

	if(isNaN(id)) return res.status(400).send("Erro: id informado está em formato inválido.");

	const user = await usuarioRepository.findOneBy({id});

	if(!user) return res.status(400).send(`Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);

	usuarioRepository.remove(user)
		.then(() => res.status(200).send("Usuário removido com sucesso!"))
		.catch(() => res.status(500).send("Internal error."));
}