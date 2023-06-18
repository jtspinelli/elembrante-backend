import { app } from '../../../../src/main/index';
import { expectBadCreateUserRequestResponse } from '../../../expectations';
import { randomUUID } from 'crypto';
import { Usuario } from '../../../../src/app/shared/database/entities/Usuario';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import db from "../../../../src/main/config/dataSource";


describe('[USUARIO ROUTES]', () => {
	beforeAll(async() => {
		await db.initialize();
	});
	afterAll(async() => {
		await db.destroy();
	});

	describe.skip('[POST /checkuser]', () => {
		test('Retorna 404 (not found) se usuário não for encontrado', async () => {
			const result = await request(app)
				.post('/checkuser')
				.send({username: 'blah'});
			
			expect(result.statusCode).toBe(404);
		});

		test('Retorna 200 (Ok) se usuário encontrado', async () => {
			const result = await request(app)
				.post('/checkuser')
				.send({username: 'user'});
			
			expect(result.statusCode).toBe(200);
		});
	});

	describe.skip('[POST /user]', () => {
		test('Retorna 400 (Bad Request) se \'nome\' ausente no objeto enviado', async () => {
			expectBadCreateUserRequestResponse(
				await request(app)
					.post('/user')
					.send({username: 'testing', senha: 'test123*'})
			);
		});

		test('Retorna 400 (Bad Request) se \'username\' ausente no objeto enviado', async () => {
			expectBadCreateUserRequestResponse(
				await request(app)
					.post('/user')
					.send({nome: 'testing', senha: 'test123*'})
			);
		});

		test('Retorna 400 (Bad Request) se \'senha\' ausente no objeto enviado', async () => {
			expectBadCreateUserRequestResponse(
				await request(app)
					.post('/user')
					.send({username: 'testing', nome: 'Jeff'})
			);
		});

		test('Retorna 409 (Conflict) se já existir usuário com o \'username\' enviado', async () => {
			const result = await request(app)
				.post('/user')
				.send({nome: 'Jeff', username: 'user', senha: 'test123*'});
			
			expect(result.statusCode).toBe(409);
			expect(result.text).toBe('Nome de usuário não disponível.');
		});

		test('Retorna 400 (Bad Request) se tentativa de registrar usuário com email', async () => {
			const result = await request(app)
				.post('/user')
				.send({nome: 'Jeff', username: 'user@email.com', senha: 'test123*'});
			
			expect(result.statusCode).toBe(400);
			expect(result.text).toBe('Para registrar-se com email utilize o loggin via Google');
		});

		test('Retorna 200 (Ok) quando usuário criado com sucesso', async () => {
			const result = await request(app)
				.post('/user')
				.send({nome: 'Jonas', username: 'user-' + randomUUID(), senha: 'pass123*'});
			
			expect(result.statusCode).toBe(200);
		});
	});

	describe.skip('[DELETE /user:id]', () => {
		test('Retorna 401 (Não autorizado) se senha não for informada', async () => {
			const result = await request(app).delete('/user/3');

			expect(result.statusCode).toBe(401);
			expect(result.text).toBe('Erro: procedimento não autorizado sem informar senha.');
		});

		test('Retorna 400 (Bad Request) se id informado estiver em formato inválido', async () => {
			const result = await request(app)
				.delete('/user/userId')
				.send({senha: 'agaga'});

			expect(result.statusCode).toBe(400);
			expect(result.text).toBe('Erro: id informado está em formato inválido.');
		});

		test('Retorna 404 (Not Found) se o usuário não for encontrado', async () => {
			const result = await request(app)
				.delete('/user/1000')
				.send({senha: 'agaga'});
			
			expect(result.statusCode).toBe(404);
			expect(result.text).toBe('Erro: o id 1000 não está vinculado a nenhum usuário ativo.');
		});

		test('Retorna 401 (Não autorizado) se a senha estiver incorreta', async () => {
			const result = await request(app)
				.delete('/user/1')
				.send({senha: 'wrong'});
			
			expect(result.statusCode).toBe(401);
			expect(result.text).toBe('Erro: senha incorreta.');
		});

		test('Retorna 200 (Ok) quando exclusão de usuário realizada com sucesso', async () => {
			const tempUser: Usuario = {
				id: 1000,
				nome: 'Temp User',
				username: 'tempuser',
				senha: await bcrypt.hash('pass123*', 10),
				excluido: false,
				lembretes: []
			};
			const usuarioRepository = db.getRepository(Usuario);

			await usuarioRepository.save(tempUser);
			
			const result = await request(app)
				.delete('/user/1000')
				.send({senha: 'pass123*'});
			
			expect(result.statusCode).toBe(200);

			await usuarioRepository.remove(tempUser);
		});


	});

	describe('[PUT /user/:id]', () => {
		test('Retorna 400 (Bad Request) se id estiver em formato inválido', async () => {
			const result = await request(app).put('/user/userId');

			expect(result.statusCode).toBe(400);
			expect(result.text).toBe('Erro: id informado está em formato inválido.');
		});

		test('Retorna 400 (Bad Request) se token ausente', async () => {
			const result = await request(app).put('/user/1000');

			expect(result.statusCode).toBe(400);
			expect(result.text).toBe('Token não encontrado ou inválido.');
		});

		test('Retorna 400 (Bad Request) se token inválido', async () => {
			const result = await request(app).put('/user/1000').set('Cookie', 'cookie');

			expect(result.statusCode).toBe(400);
			expect(result.text).toBe('Token não encontrado ou inválido.');
		});

		test('Retorna 404 (Not Found) se usuário não encontrado', async () => {
			const result = await request(app).put('/user/3000').set('Cookie', process.env.USER_NOT_FOUND_TOKEN_EXAMPLE as string);
			
			expect(result.statusCode).toBe(404);
			expect(result.text).toBe('Erro: o id 3000 não está vinculado a nenhum usuário ativo.');
		});

		test('Retorna 401 (Não Autorizado) se token enviado for de outro usuário', async () => {
			const result = await request(app).put('/user/1').set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string);

			expect(result.statusCode).toBe(401);
			expect(result.text).toBe('Não autorizado.');
		});

		test('Retorna 400 (Bad Request) se \'nome\' e \'username\' ambos ausentes no objeto enviado', async () => {
			const result = await request(app).put('/user/2').set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string).send({});

			expect(result.statusCode).toBe(400);
			expect(result.text).toBe('Erro: Impossível atualizar usuário com o objeto enviado.');
		});

		test('Retorna 409 (Conflict) se username enviado já estiver em uso', async () => {
			const result = await request(app).put('/user/2').set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string).send({username: 'user'});

			expect(result.statusCode).toBe(409);
			expect(result.text).toBe('Erro: este nome de usuário não está disponível.');
		});

		test('Retorna 400 (Bad Request) se token expirado', async () => {
			const result = await request(app).put('/user/1').set('Cookie', process.env.EXPIRED_TOKEN_EXAMPLE as string).send({username: 'user'});

			expect(result.statusCode).toBe(400);
			expect(result.text).toBe('Token expirado. Autentique-se novamente.');
		});

		test('Retorna 200 (Ok) se atualização realizada com sucesso', async () => {
			const result = await request(app).put('/user/2').set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string).send({nome: 'Test User'});

			expect(result.statusCode).toBe(200);
		});
	});
});