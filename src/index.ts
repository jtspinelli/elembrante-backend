import express, { json, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv-safe';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const port = process.env.PORT || 3000;

const app = express();
app.use(json());
app.use(cors());

// dotenv.config();

app.get('/', (_req: Request, res: Response) => {
	res.send("Hello!\nSECRET: " + process.env.SECRET);
} );

app.post('/auth', (req: Request, res: Response) => {
	const secret = process.env.SECRET;
	const token = req.headers["access_token"] as string;

	if(!secret || !token) return;
	
	jwt.verify(token, secret, (err, decoded) => {
		if(err) return res.status(401).send("Unauthorized!");	
		  
		res.status(200).send("Authorized!");
	});
});

app.listen(port, () => console.log("APP RUNNING ON PORT " + port));