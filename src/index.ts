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

app.get('/', (_req: Request, res: Response) => res.send("Hello!") );

app.listen(port, () => console.log("APP RUNNING ON PORT " + port));