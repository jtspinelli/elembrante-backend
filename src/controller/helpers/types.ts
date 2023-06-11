import { Request, Response, NextFunction } from "express";
import { Repository } from "typeorm";
import { Usuario } from "../../app/shared/database/entities/Usuario";
import { Lembrete } from "../../app/shared/database/entities/Lembrete";

export type ExpressRouteFunc = (req: Request, res: Response, next?: NextFunction) => void | Promise<Response<any, Record<string, any>> | undefined>;
export type UsuarioRepository = Repository<Usuario>;
export type LembreteRepository = Repository<Lembrete>;