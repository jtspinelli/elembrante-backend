import "reflect-metadata";
import express, { json, Request, Response } from 'express';
import { createMap, forMember, mapFrom } from '@automapper/core';
import { registerRoutes } from './config/httpRoutes.config';
import { appEnv } from '../app/env/appEnv';
import { Lembrete } from "../app/shared/database/entities/Lembrete";
import db from './config/dataSource';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import https from 'https';
import cookieParser from 'cookie-parser';
import LembreteDto from "../app/features/lembrete/dto/LembreteDto";
import mapper from "../app/shared/mappings/mapper";

const resolveCertPath = () => {
	return process.env.NODE_ENV == 'test'
		? [__dirname, '..', '..', 'out', 'cert']
		: [__dirname, '..', 'cert'];
};

// const key = fs.readFileSync(path.join(...resolveCertPath(), 'localhost.key'));
// const cert = fs.readFileSync(path.join(...resolveCertPath(), 'localhost.crt'));

export const app = express();
app.use(express.static(path.join(__dirname, '..', "public")));
app.use(json());
app.use(cookieParser());
app.use(cors({
	credentials: true
}));

registerRoutes(app);

// const server = https.createServer({key, cert}, app);

createMap(mapper, Lembrete, LembreteDto, forMember(dto => dto.usuarioId, mapFrom(lembrete => lembrete.usuario.id)));

app.get('*', (_req: Request, res:Response) => {
	res.sendFile(path.join(__dirname, '..', "public", "index.html"));
});

if(process.env.NODE_ENV !== 'test') {
	db.initialize().then(async () => {
		app.listen(appEnv.port, () => console.log("APP RUNNING ON PORT " + appEnv.port));
		// server.listen(appEnv.port, () => console.log("APP RUNNING ON PORT " + appEnv.port));
	});
}
