import express, { json, Request, Response } from 'express';
import { createUser, removeUser } from './features/users/crud';
import { authenticateUser } from './features/users/auth';
import { Usuario } from './entity/Usuario';
import { Token } from './entity/Token';
import { db } from './dataSource';
import "reflect-metadata";
import cors from 'cors';

const port = process.env.PORT || 3000;

const app = express();
app.use(json());
app.use(cors());

export const usuarioRepository = db.getRepository(Usuario);
export const tokenRepository = db.getRepository(Token);

app.get('/', (_req: Request, res: Response) => res.send('Hello!'));
app.post('/user', createUser);
app.delete('/user/:id', removeUser);
app.post('/auth', authenticateUser);

db.initialize().then(() => {	
	app.listen(port, () => console.log("APP RUNNING ON PORT " + port));
});
