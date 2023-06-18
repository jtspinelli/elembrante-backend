import { expectExpiredTokenResponse, expectInvalidTokenResponse, expectLembreteNotFoundResponse, expectTokenNotFoundResponse, expectUsuarioNotFoundResponse } from '../../../expectations';
import { app } from '../../../../src/main/index';
import request from 'supertest';
import dotenv from 'dotenv-safe';
import db from '../../../../src/main/config/dataSource';

dotenv.config();

describe('[LEMBRETE ROUTES]', () => {
	beforeAll(async() => {
		await db.initialize();
	});
	afterAll(async() => {
		await db.destroy();
	});	

	describe('[GET /lembretes]', () => {
		test('Retorna 400 (Bad Request) se token ausente', async () => {
			expectTokenNotFoundResponse(await request(app).get('/lembretes'));
		});

		test('Retorna 400 (Bad Request) se token inválido', async () => {
			expectInvalidTokenResponse(
				await request(app)
					.get('/lembretes')
					.set('Cookie', 'token')
			);
		});

		test('Retorna 401 (não autorizado) se token expirado', async () => {
			expectExpiredTokenResponse(
				await request(app)
					.get('/lembretes')
					.set('Cookie', process.env.EXPIRED_TOKEN_EXAMPLE as string)
			);
		});

		test('Retorna 404 (not found) se o usuário não for encontrado', async () => {
			expectUsuarioNotFoundResponse(
				await request(app)
					.get('/lembretes')
					.set('Cookie', process.env.USER_NOT_FOUND_TOKEN_EXAMPLE as string)
			);
		});

		test('Retorna 200 (Ok) com lista de lembretes do usuário', async () => {
			const result = await request(app)
				.get('/lembretes')
				.set('Cookie', process.env.DEFAULT_USER_VALID_TOKEN_EXAMPLE as string);
			
			expect(result.statusCode).toBe(200);
			expect(result.body.length).toBe(2);
			result.body.forEach((lembrete: any) => {
				expect(lembrete.titulo).toBeDefined();
				expect(lembrete.descricao).toBeDefined();
			});
		});
	});

	describe('[POST /lembrete]', () => {
		test('Retorna 400 (bad request) se token ausente', async () => {
			expectTokenNotFoundResponse(await request(app).post('/lembrete'));
		});

		test('Retorna 400 (Bad Request) se token inválido', async () => {
			expectInvalidTokenResponse(
				await request(app)
					.post('/lembrete')
					.set('Cookie', 'token')
			);			
		});

		test('Retorna 401 (não autorizado) se token expirado', async () => {
			expectExpiredTokenResponse(
				await request(app)
					.post('/lembrete')
					.send({titulo: 'title', descricao: 'description'})
					.set('Cookie', process.env.EXPIRED_TOKEN_EXAMPLE as string)
			);
		});

		test('Retorna 404 (not found) se o usuário não for encontrado', async () => {
			expectUsuarioNotFoundResponse(
				await request(app)
					.post('/lembrete')
					.send({titulo: 'title', descricao: 'description'})
					.set('Cookie', process.env.USER_NOT_FOUND_TOKEN_EXAMPLE as string)
			);
		});

		test('Retorna 201 (created) quando lembrete criado com sucesso', async () => {
			const result = await request(app)
				.post('/lembrete')
				.send({titulo: 'test title', descricao: 'test description'})
				.set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string);
			
			expect(result.statusCode).toBe(201);
		});
	});

	describe('[DELETE /lembrete/:id]', () => {
		test('Retorna 400 (bad request) se token ausente', async () => {
			expectTokenNotFoundResponse(await request(app).delete('/lembrete/1'));
		});

		test('Retorna 400 (Bad Request) se token inválido', async () => {
			expectInvalidTokenResponse(
				await request(app)
					.delete('/lembrete/1')
					.set('Cookie', 'token')
			);
		});

		test('Retorna 401 (não autorizado) se token expirado', async () => {
			expectExpiredTokenResponse(
				await request(app)
					.delete('/lembrete/1')
					.set('Cookie', process.env.EXPIRED_TOKEN_EXAMPLE as string)
			);
		});

		test('Retorna 404 (not found) se o usuário não for encontrado', async () => {
			expectUsuarioNotFoundResponse(
				await request(app)
					.delete('/lembrete/1')
					.set('Cookie', process.env.USER_NOT_FOUND_TOKEN_EXAMPLE as string)
			);
		});

		test('Retorna 404 (not found) se o lembrete não for encontrado', async () => {
			expectLembreteNotFoundResponse(
				await request(app)
					.delete('/lembrete/1000')
					.set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string)
			);
		});

		test('Retorna 200 (Ok) quando lembrete excluído com sucesso', async () => {
			const insertResult = await request(app)
				.post('/lembrete')
				.set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string)
				.send({titulo: 'title', descricao: 'description'});
			
			const result = await request(app)
				.delete('/lembrete/' + insertResult.body.id)
				.set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string);

			expect(result.statusCode).toBe(200);
			expect(result.text).toBe('Operação realizada com sucesso!');
		});
	});	

	describe('[PUT /lembrete/archive/:id]', () => {
		test('Retorna 400 (bad request) se token ausente', async () => {
			expectTokenNotFoundResponse(await request(app).put('/lembrete/archive/1'));
		});

		test('Retorna 400 (Bad Request) se token inválido', async () => {
			expectInvalidTokenResponse(
				await request(app)
					.put('/lembrete/archive/1')
					.set('Cookie', 'token')
			);
		});

		test('Retorna 401 (não autorizado) se token expirado', async () => {
			expectExpiredTokenResponse(
				await request(app)
					.put('/lembrete/archive/1')
					.set('Cookie', process.env.EXPIRED_TOKEN_EXAMPLE as string)
			);
		});

		test('Retorna 404 (not found) se o usuário não for encontrado', async () => {
			expectUsuarioNotFoundResponse(
				await request(app)
					.put('/lembrete/archive/1')
					.set('Cookie', process.env.USER_NOT_FOUND_TOKEN_EXAMPLE as string)
			);
		});

		test('Retorna 404 (not found) se o lembrete não for encontrado', async () => {
			expectLembreteNotFoundResponse(
				await request(app)
					.put('/lembrete/archive/1000')
					.set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string)
			);
		});

		test('Retorna 200 (Ok) quando o lembrete é arquivado com sucesso', async () => {
			const insertResult = await request(app)
				.post('/lembrete')
				.set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string)
				.send({titulo: 'test title', descricao: 'test description'});

			const result = await request(app)
				.put('/lembrete/archive/' + insertResult.body.id)
				.set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string);

			expect(result.statusCode).toBe(200);

			await request(app)
				.delete('/lembrete/' + insertResult.body.id)
				.set('Cookie', process.env.VALID_TOKEN_EXAMPLE as string);
		});
	});
});
