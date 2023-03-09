import express, { json, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv-safe';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import "reflect-metadata";
import { db } from './dataSource';
import { Usuario } from './entity/Usuario';

const port = process.env.PORT || 3000;

const app = express();
app.use(json());
app.use(cors());

app.get('/', (_req: Request, res: Response) => {
	res.send("Hello!\nSECRET: " + process.env.SECRET);
} );

app.get('/users', async (_req: Request, res: Response) => {
	const users = await db.getRepository(Usuario).find();

	console.log(users);

	res.status(200).send('users count: ' + users.length);
});

app.post('/auth', (req: Request, res: Response) => {
	const secret = process.env.SECRET;
	const token = req.headers["access_token"] as string;

	if(!secret || !token) return;
	
	jwt.verify(token, secret, (err, decoded) => {
		if(err) return res.status(401).send("Unauthorized!");	
		  
		res.status(200).send("Authorized!");
	});
});

db.initialize().then(() => {	
	app.listen(port, () => console.log("APP RUNNING ON PORT " + port));
});
