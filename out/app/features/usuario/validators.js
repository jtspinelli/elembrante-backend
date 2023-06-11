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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateUser = exports.validateRemoveUser = exports.validateCreateUser = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const httpResponses_1 = require("../../shared/helpers/httpResponses");
const repository_1 = require("./repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const appEnv_1 = require("../../env/appEnv");
const validateCreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.nome || !req.body.username || !req.body.senha)
        return (0, httpResponses_1.bad)(res, 'Impossível criar usuário com o objeto enviado.');
    const usuarioRepository = new repository_1.UsuarioRepository();
    const user = yield usuarioRepository.findByUsername(req.body.username);
    if (user)
        return res.status(409).send('Nome de usuário não disponível.');
    if (req.body.username.includes('@')) {
        return (0, httpResponses_1.bad)(res, 'Para registrar-se com email utilize o loggin via Google');
    }
    next();
});
exports.validateCreateUser = validateCreateUser;
const validateRemoveUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.senha)
        return (0, httpResponses_1.bad)(res, 'Erro: procedimento não autorizado sem informar senha.');
    const id = Number(req.params.id);
    if (isNaN(id))
        return (0, httpResponses_1.bad)(res, 'Erro: id informado está em formato inválido.');
    const usuarioRepository = new repository_1.UsuarioRepository();
    const user = yield usuarioRepository.findById(id);
    if (!user || user.excluido)
        return (0, httpResponses_1.bad)(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);
    const senhaPass = yield bcrypt_1.default.compare(req.body.senha, user.senha);
    if (!senhaPass)
        return (0, httpResponses_1.bad)(res, 'Erro: senha incorreta.');
    req.body.user = user;
    next();
});
exports.validateRemoveUser = validateRemoveUser;
function tokenIsPresent(req) {
    return req.cookies.sign !== undefined && req.cookies.token !== undefined;
}
const validateUpdateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id))
        return (0, httpResponses_1.bad)(res, 'Erro: id informado está em formato inválido.');
    if (!tokenIsPresent(req))
        return (0, httpResponses_1.bad)(res, 'Token não encontrado ou inválido.');
    const token = `${req.cookies.token}.${req.cookies.sign}`;
    try {
        const tokenPayload = jsonwebtoken_1.default.verify(token, appEnv_1.appEnv.secret);
        const usuarioRepository = new repository_1.UsuarioRepository();
        const user = yield usuarioRepository.findById(id);
        if (!user || user.excluido)
            return (0, httpResponses_1.bad)(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);
        if (tokenPayload.id !== id)
            return (0, httpResponses_1.unauthorized)(res, 'Não autorizado.');
        const nome = req.body.nome;
        const username = req.body.username;
        if (!nome && !username)
            return (0, httpResponses_1.bad)(res, 'Erro: Impossível atualizar usuário com o objeto enviado.');
        if (username) {
            const userWithSameUsername = yield usuarioRepository.findByUsername(username);
            const usernameInUse = !!userWithSameUsername && userWithSameUsername.id !== id;
            if (usernameInUse)
                return (0, httpResponses_1.bad)(res, 'Erro: este nome de usuário não está disponível.');
        }
        req.body.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return (0, httpResponses_1.bad)(res, 'Token expirado. Autentique-se novamente.');
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return (0, httpResponses_1.bad)(res, 'Token não encontrado ou inválido.');
        }
    }
});
exports.validateUpdateUser = validateUpdateUser;
