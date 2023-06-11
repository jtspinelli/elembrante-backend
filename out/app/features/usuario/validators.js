"use strict";
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
exports.validateRemoveUser = exports.validateCreateUser = void 0;
const httpResponses_1 = require("../../helpers/httpResponses");
const repository_1 = require("./repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
