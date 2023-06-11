"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpResponses_1 = require("./helpers/httpResponses");
const jsonwebtoken_1 = require("jsonwebtoken");
const jsonwebtoken_2 = __importStar(require("jsonwebtoken"));
class UserController {
    constructor(service, validationService) {
        this.service = service;
        this.validationService = validationService;
    }
    // public userExists() : ExpressRouteFunc {
    // 	return async (req: Request, res: Response) => {			
    // 		const username = req.body.username;
    // 		if(!username) return;
    // 		const user = await this.service.findByUsername(username);
    // 		if(!user) return notfound(res, 'Erro: usuário não encontrado.');
    // 		res.status(200).send();
    // 	}
    // }
    // public createUser() : ExpressRouteFunc {
    // 	return async (req: Request, res: Response) => {
    // 		if(!req.body.nome || !req.body.username || !req.body.senha) return bad(res, 'Impossível criar usuário com o objeto enviado.');
    // 		const user = await this.service.findByUsername(req.body.username);
    // 		if(user) return res.status(409).send('Nome de usuário não disponível.');
    // 		bcrypt.hash(req.body.senha, 10, (err, hash) => {
    // 			if(err) return internalError(res);
    // 			if(req.body.username.includes('@')){
    // 				return bad(res, 'Para registrar-se com email utilize o loggin via Google');
    // 			}
    // 			const newUser = new Usuario();
    // 			newUser.nome = req.body.nome;
    // 			newUser.username = req.body.username;
    // 			newUser.senha = hash;
    // 			this.service.save(newUser)
    // 			.then(async () => {
    // 				const data = await AuthenticationService.createToken(newUser);
    // 				res.setHeader('Set-Cookie', data?.headerPayload as string);
    // 				res.setHeader('Set-Cookie', data?.sign as string);
    // 				success(res);
    // 			})
    // 			.catch((e) => {
    // 				if(e.message.includes('Duplicate entry') && e.message.includes('usuario.username')){
    // 					return bad(res, 'Nome de usuário não disponível');
    // 				}
    // 				internalError(res);
    // 			});
    // 		});
    // 	}
    // }
    updateUser() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            const secret = process.env.SECRET;
            if (!secret)
                return;
            const id = Number(req.params.id);
            if (isNaN(id))
                return (0, httpResponses_1.bad)(res, 'Erro: id informado está em formato inválido.');
            if (this.validationService.tokenNotPresent(req))
                return (0, httpResponses_1.bad)(res, 'Token não encontrado ou inválido.');
            const token = `${req.cookies.token}.${req.cookies.sign}`;
            try {
                const tokenPayload = jsonwebtoken_2.default.verify(token, secret);
                const user = yield this.service.findById(id);
                if (!user)
                    return (0, httpResponses_1.bad)(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);
                if (tokenPayload.id !== id)
                    return (0, httpResponses_1.unauthorized)(res, 'Não autorizado.');
                const nome = req.body.nome;
                const username = req.body.username;
                if (!nome && !username)
                    return (0, httpResponses_1.bad)(res, 'Erro: Impossível atualizar usuário com o objeto enviado.');
                if (username) {
                    const userWithSameUsername = yield this.service.findByUsername(username);
                    const usernameInUse = !!userWithSameUsername && userWithSameUsername.id !== id;
                    if (usernameInUse)
                        return (0, httpResponses_1.bad)(res, 'Erro: este nome de usuário não está disponível.');
                }
                user.nome = nome !== null && nome !== void 0 ? nome : user.nome;
                user.username = username !== null && username !== void 0 ? username : user.username;
                this.service.save(user)
                    .then(() => (0, httpResponses_1.success)(res))
                    .catch(() => (0, httpResponses_1.internalError)(res));
            }
            catch (err) {
                if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                    return (0, httpResponses_1.bad)(res, 'Token expirado. Autentique-se novamente.');
                }
                if (err instanceof jsonwebtoken_2.JsonWebTokenError) {
                    return (0, httpResponses_1.bad)(res, 'Token não encontrado ou inválido.');
                }
            }
        });
    }
}
exports.default = UserController;
