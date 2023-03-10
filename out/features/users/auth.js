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
exports.authenticateUser = void 0;
const httpResponses_1 = require("../httpResponses");
const __1 = require("../..");
const index_1 = require("./../../index");
const Token_1 = require("../../entity/Token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    bcrypt_1.default.compare(senha, user.senha).then((pass) => __awaiter(void 0, void 0, void 0, function* () {
        if (!pass)
            return (0, httpResponses_1.unauthorized)(res, 'Erro: usuário e/ou senha incorretos.');
        const savedToken = yield index_1.tokenRepository.findOneBy({ username });
        const today = new Date();
        const tokenExpired = savedToken && today > (savedToken === null || savedToken === void 0 ? void 0 : savedToken.expiraEm);
        if (!savedToken || tokenExpired) {
            const userData = { nome: user.nome, username: user.username };
            const access_token = jsonwebtoken_1.default.sign(userData, secret);
            const token = savedToken !== null && savedToken !== void 0 ? savedToken : new Token_1.Token();
            token.username = user.username;
            token.accessToken = access_token;
            token.expiraEm = new Date(new Date().setDate(today.getDate() + 5));
            index_1.tokenRepository.save(token)
                .then(() => res.status(200).send({ userData, access_token }))
                .catch(() => (0, httpResponses_1.internalError)(res));
            return;
        }
        const validToken = savedToken && today < savedToken.expiraEm;
        if (validToken) {
            const userData = { nome: user.nome, username: user.username };
            const access_token = savedToken.accessToken;
            return res.status(200).send({ userData, access_token });
        }
    }));
});
exports.authenticateUser = authenticateUser;
