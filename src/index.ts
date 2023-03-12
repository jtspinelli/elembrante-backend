import express, { json, Request, Response } from 'express';
import { addLembrete, archiveLembrete, getLembretes, recoverLembrete, removeLembrete, updateLembrete } from './features/lembretes/crud';
import { createUser, removeUser, updateUser, userExists } from './features/users/crud';
import { authenticateUser } from './features/users/auth';
import { Lembrete } from './entity/Lembrete';
import { Usuario } from './entity/Usuario';
import { Token } from './entity/Token';
import { db } from './dataSource';
import "reflect-metadata";
import cors from 'cors';

const port = process.env.PORT || 8080;

const app = express();
app.use(json());
app.use(cors());

export const usuarioRepository = db.getRepository(Usuario);
export const tokenRepository = db.getRepository(Token);
export const lembreteRepository = db.getRepository(Lembrete);

app.get('/', (_req: Request, res: Response) => res.send("Hello"));
app.post('/checkuser', userExists);
app.post('/user', createUser);
app.put('/user/:id', updateUser);
app.delete('/user/:id', removeUser);
app.post('/auth', authenticateUser);
app.get('/lembretes', getLembretes);
app.post('/lembrete', addLembrete);
app.put('/lembrete/:id', updateLembrete);
app.put('/lembrete/archive/:id', archiveLembrete);
app.put('/lembrete/recover/:id', recoverLembrete);
app.delete('/lembrete/:id', removeLembrete);


db.initialize().then(async () => {	
	app.listen(port, () => console.log("APP RUNNING ON PORT " + port));
});
