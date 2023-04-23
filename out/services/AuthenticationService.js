"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const cookie_1 = require("cookie");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthenticationService {
    static checkSenha(senha, savedSenha) {
        return new Promise((res, _rej) => {
            bcrypt_1.default.compare(senha, savedSenha).then(pass => {
                res(pass);
            });
        });
    }
    // public static returnToken(savedToken: Token, user: Usuario, res: Response) {
    // 	const userData = { nome: user.nome, username: user.username };
    // 	const access_token = savedToken.accessToken;
    // 	return res.status(200).send({userData, access_token});
    // } 
    static createToken(user) {
        const secret = process.env.SECRET;
        if (!secret)
            return;
        return new Promise((res, _rej) => {
            const userData = { id: user.id, nome: user.nome, username: user.username };
            jsonwebtoken_1.default.sign(userData, secret, {
                expiresIn: 600
            }, (_err, jwtToken) => {
                const sign = (0, cookie_1.serialize)('sign', jwtToken.split('.')[2], {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 600,
                    path: '/',
                });
                res({ userData, headerPayload: `${jwtToken.split('.')[0]}.${jwtToken.split('.')[1]}`, sign });
            });
        });
    }
}
exports.AuthenticationService = AuthenticationService;
