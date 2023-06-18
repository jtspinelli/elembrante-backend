import { Response } from "supertest";

export const expectTokenNotFoundResponse = (res: Response) => {
	expect(res.statusCode).toBe(400);
	expect(res.text).toBe('Token não encontrado ou inválido.');
};

export const expectInvalidTokenResponse = (res: Response) => {
	expect(res.statusCode).toBe(400);
	expect(res.text).toBe('Token não encontrado ou inválido.');
};

export const expectExpiredTokenResponse = (res: Response) => {
	expect(res.statusCode).toBe(401);
	expect(res.text).toBe('Erro: o usuário não possui token válido. Autentique-se novamente.');
};

export const expectUsuarioNotFoundResponse = (res: Response) => {
	expect(res.statusCode).toBe(404);
	expect(res.text).toBe('Usuário não encontrado');
};

export const expectLembreteNotFoundResponse = (res: Response) => {
	expect(res.statusCode).toBe(404);
	expect(res.text).toBe('Erro: o id 1000 não está vinculado a nenhum lembrete')
};