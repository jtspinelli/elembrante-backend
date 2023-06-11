"use strict";
// import express, { json, Request, Response } from 'express';
// import { createMap, forMember, mapFrom } from '@automapper/core';
// import { Lembrete } from './entity/Lembrete';
// import { db } from './dataSource';
// import path from 'path';
// import "reflect-metadata";
// import fs from 'fs';
// import cors from 'cors';
// import https from 'https';
// import mapper from './mappings/mapper';
// import LembreteDto from './controller/dto/LembreteDto';
// import cookieParser from 'cookie-parser';
// import authRoutes from './routes/authRoutes';
// import userRoutes from './routes/userRoutes';
// import lembreteRoutes from './routes/lembreteRoutes';
// const port = process.env.PORT || 8081;
// // const key = fs.readFileSync(__dirname + '/cert/localhost.key');
// // const cert = fs.readFileSync(__dirname + '/cert/localhost.crt');
// const app = express();
// app.use(express.static(path.join(__dirname, "public")));
// app.use(json());
// app.use(cookieParser());
// app.use(cors({
// 	credentials: true
// }));
// app.use(authRoutes);
// app.use(userRoutes);
// app.use(lembreteRoutes)
// // const server = https.createServer({key, cert}, app);
// createMap(mapper, Lembrete, LembreteDto, forMember(dto => dto.usuarioId, mapFrom(lembrete => lembrete.usuario.id)));
// app.get('*', (_req: Request, res:Response) => {
// 	res.sendFile(path.join(__dirname, "public", "index.html"));
// });
// db.initialize().then(async () => {
// 	app.listen(port, () => console.log("APP RUNNING ON PORT " + port));
// 	// server.listen(port, () => console.log("APP RUNNING ON PORT " + port));
// });
