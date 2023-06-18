import request from 'supertest';
import db from '../../../../src/main/config/dataSource';
import { app } from '../../../../src/main/index';


describe('[LOGIN ROUTES]', () => {
	beforeAll(async() => {
		await db.initialize()
	});
	afterAll(async() => {
		await db.destroy()
	});

	test('Retorna 400 (bad request) quando não enviados dados para autenticação', async() => {
		const result = await request(app).post('/auth');		

		expect(result.statusCode).toBe(400);
		expect(result.text).toBe('Erro: dados necessários não encontrados no objeto enviado.');
	});

	test('Retorna 404 (não encontrado) quando usuário não encontrado', async () => {
		const result = await request(app)
			.post('/auth')
			.send({username: 'blah', senha: 'pass123*'});
		
		expect(result.statusCode).toBe(404);
		expect(result.text).toBe('Erro: usuário blah não encontrado.');
	});

	test('Retorna 400 (bad request) se tentativa de login com email', async () => {
		const result = await request(app)
		.post('/auth')
		.send({username: 'user@email.com', senha: 'pass123*'});
	
		expect(result.statusCode).toBe(400);
		expect(result.text).toBe('Para logar com Gmail utilize o GoogleLogin');
	});

	test('Retorna 401 (não autorizado) se senha incorreta', async () => {
		const result = await request(app)
		.post('/auth')
		.send({username: 'user', senha: 'pass123*'});

		expect(result.statusCode).toBe(401);
		expect(result.text).toBe('Err: usuário e/ou senha incorretos.');	
	});

	test('Retorna 200 (Ok) com token quando Login realizado com sucesso', async () => {
		const result = await request(app)
		.post('/auth')
		.send({username: 'user', senha: 'password123*'});

		expect(result.statusCode).toBe(200);
		expect(result.body.userData).toBeDefined();
		expect(result.body.headerPayload).toBeDefined();
		expect(result.body.sign).toBeDefined();
	});
});