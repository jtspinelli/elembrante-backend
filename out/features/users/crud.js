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
exports.removeUser = exports.createUser = void 0;
const httpResponses_1 = require("../httpResponses");
const __1 = require("../..");
const Usuario_1 = require("../../entity/Usuario");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.nome || !req.body.username || !req.body.senha)
        return (0, httpResponses_1.bad)(res, 'Impossível criar usuário com o objeto enviado.');
    bcrypt_1.default.hash(req.body.senha, 10, (err, hash) => {
        if (err)
            (0, httpResponses_1.internalError)(res);
        const newUser = new Usuario_1.Usuario();
        newUser.nome = req.body.nome;
        newUser.username = req.body.username;
        newUser.senha = hash;
        __1.usuarioRepository.save(newUser)
            .then(() => (0, httpResponses_1.success)(res))
            .catch(() => (0, httpResponses_1.internalError)(res));
    });
});
exports.createUser = createUser;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.senha)
        return (0, httpResponses_1.bad)(res, 'Erro: procedimento não autorizado sem informar senha.');
    const id = Number(req.params.id);
    if (isNaN(id))
        return (0, httpResponses_1.bad)(res, 'Erro: id informado está em formato inválido.');
    const user = yield __1.usuarioRepository.findOneBy({ id });
    if (!user)
        return (0, httpResponses_1.bad)(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);
    bcrypt_1.default.compare(req.body.senha, user.senha).then(pass => {
        if (!pass)
            return (0, httpResponses_1.bad)(res, 'Erro: senha incorreta.');
        __1.usuarioRepository.remove(user)
            .then(() => (0, httpResponses_1.success)(res))
            .catch(() => (0, httpResponses_1.internalError)(res));
    });
});
exports.removeUser = removeUser;
