import express, { json, Request, Response } from 'express';
import { Lembrete } from './entity/Lembrete';
import { Usuario } from './entity/Usuario';
import { Token } from './entity/Token';
import { db } from './dataSource';
import path from 'path';
import "reflect-metadata";
import fs from 'fs';
import cors from 'cors';
import https from 'https';
import cookieParser from 'cookie-parser';
import UserController from './controller/UserController';
import LembreteController from './controller/LembreteController';
import ValidationService from './services/ValidationService';
import AuthenticationController from './controller/AuthenticationController';

const port = process.env.PORT || 8081;
const key = fs.readFileSync(__dirname + '/cert/localhost.key');
const cert = fs.readFileSync(__dirname + '/cert/localhost.crt');

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(json());
app.use(cookieParser());
app.use(cors({
	credentials: true
}));

const server = https.createServer({key, cert}, app);

export const usuarioRepository = db.getRepository(Usuario);
export const tokenRepository = db.getRepository(Token);
export const lembreteRepository = db.getRepository(Lembrete);
const validationService = new ValidationService(usuarioRepository, lembreteRepository);

const authenticationController = new AuthenticationController(usuarioRepository);
const userController = new UserController(usuarioRepository, validationService);
const lembreteController = new LembreteController(lembreteRepository, validationService);

app.post('/checkuser', userController.userExists.bind(userController));
app.post('/user', userController.createUser.bind(userController));
app.put('/user/:id', userController.updateUser.bind(userController));
app.delete('/user/:id', userController.removeUser.bind(userController));
app.post('/auth', authenticationController.authenticateUser.bind(authenticationController));
app.get('/lembretes', lembreteController.getLembretes.bind(lembreteController));
app.post('/lembrete', lembreteController.addLembrete.bind(lembreteController));
app.put('/lembrete/:id', lembreteController.updateLembrete.bind(lembreteController));
app.put('/lembrete/archive/:id', lembreteController.archiveLembrete.bind(lembreteController));
app.put('/lembrete/recover/:id', lembreteController.recoverLembrete.bind(lembreteController));
app.delete('/lembrete/:id', lembreteController.removeLembrete.bind(lembreteController));
app.post('/googlelogin', authenticationController.googleLogin.bind(authenticationController));
app.get('*', (_req: Request, res:Response) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

db.initialize().then(async () => {
	// app.listen(port, () => console.log("APP RUNNING ON PORT " + port));
	server.listen(port, () => console.log("APP RUNNING ON PORT " + port));
});
