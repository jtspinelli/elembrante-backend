"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const __1 = require("..");
const Token_1 = require("../entity/Token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthenticationService {
    static checkSenha(senha, savedSenha) {
        return new Promise((res, rej) => {
            bcrypt_1.default.compare(senha, savedSenha).then(pass => {
                res(pass);
            });
        });
    }
    static returnToken(savedToken, user, res) {
        const userData = { nome: user.nome, username: user.username };
        const access_token = savedToken.accessToken;
        return res.status(200).send({ userData, access_token });
    }
    static createOrUpdateToken(savedToken, user, today) {
        const secret = process.env.SECRET;
        if (!secret)
            return;
        return new Promise((res, _rej) => {
            const userData = { nome: user.nome, username: user.username };
            const access_token = jsonwebtoken_1.default.sign(userData, secret);
            const token = savedToken !== null && savedToken !== void 0 ? savedToken : new Token_1.Token();
            token.username = user.username;
            token.accessToken = access_token;
            token.expiraEm = new Date(new Date().setDate(today.getDate() + 5));
            __1.tokenRepository.save(token)
                .then(() => res({ userData, access_token }))
                .catch(() => res(null));
        });
    }
}
exports.AuthenticationService = AuthenticationService;
