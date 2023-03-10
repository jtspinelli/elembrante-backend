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
exports.authenticateUser = void 0;
const httpResponses_1 = require("../httpResponses");
const AuthenticationService_1 = require("../../services/AuthenticationService");
const __1 = require("../..");
const index_1 = require("./../../index");
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.SECRET;
    if (!secret)
        return;
    const senha = req.body.senha;
    const username = req.body.username;
    if (!senha || !username)
        return (0, httpResponses_1.bad)(res, 'Erro: dados necessários não encontrados no objeto enviado.');
    const user = yield __1.usuarioRepository.findOneBy({ username });
    if (!user)
        return (0, httpResponses_1.bad)(res, `Erro: usuário ${username} não encontrado.`);
    const senhaIsCorrect = yield AuthenticationService_1.AuthenticationService.checkSenha(senha, user.senha);
    if (!senhaIsCorrect)
        return (0, httpResponses_1.unauthorized)(res, 'Err: usuário e/ou senha incorretos.');
    const savedToken = yield index_1.tokenRepository.findOneBy({ userId: user.id });
    const today = new Date();
    const savedTokenExpired = savedToken && today > savedToken.expiraEm;
    if (!savedToken || savedTokenExpired) {
        const data = yield AuthenticationService_1.AuthenticationService.createOrUpdateToken(savedToken, user, today);
        if (data)
            return res.status(200).send(data);
        return (0, httpResponses_1.internalError)(res);
    }
    const validToken = savedToken && today < savedToken.expiraEm;
    if (validToken)
        AuthenticationService_1.AuthenticationService.returnToken(savedToken, user, res);
});
exports.authenticateUser = authenticateUser;
