import express, { json, Request, Response } from 'express';
import cors from 'cors';

const port = process.env.PORT || 3000;

const app = express();

app.use(json());
app.use(cors());

app.get('/', (_req: Request, res: Response) => res.send("Hello!"));

app.listen(port, () => console.log("APP RUNNING ON PORT " + port));