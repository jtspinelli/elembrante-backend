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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
const httpResponses_1 = require("../../helpers/httpResponses");
const repository_1 = require("../usuario/repository");
const validateLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.SECRET;
    if (!secret)
        return;
    const senha = req.body.senha;
    const username = req.body.username;
    if (!senha || !username)
        return (0, httpResponses_1.bad)(res, 'Erro: dados necessários não encontrados no objeto enviado.');
    if (username.includes('@'))
        return (0, httpResponses_1.bad)(res, 'Para logar com Gmail utilize o GoogleLogin');
    const usuarioRepository = new repository_1.UsuarioRepository();
    const user = yield usuarioRepository.findByUsername(username);
    if (!user)
        return (0, httpResponses_1.bad)(res, `Erro: usuário ${username} não encontrado.`);
    const senhaIsCorrect = yield usuarioRepository.checkSenha(senha, user.senha);
    if (!senhaIsCorrect)
        return (0, httpResponses_1.unauthorized)(res, 'Err: usuário e/ou senha incorretos.');
    req.body.user = user;
    next();
});
exports.validateLogin = validateLogin;
