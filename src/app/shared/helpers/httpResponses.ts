import { Response } from 'express';

export const internalError = (res: Response) => {
	return res.status(500).send('Erro interno no servidor.');
}

export const success = (res: Response) => {
	return res.status(200).send('Operação realizada com sucesso!');
}

export const bad = (res: Response, message: string) => {
	return res.status(400).send(message);
}

export const unauthorized = (res: Response, message: string) => {
	return res.status(401).send(message);
}

export const notfound = (res: Response, message: string) => {
	return res.status(404).send(message);
}