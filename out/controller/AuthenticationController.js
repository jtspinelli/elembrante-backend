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
const httpResponses_1 = require("./httpResponses");
const Usuario_1 = require("../entity/Usuario");
const AuthenticationService_1 = require("../services/AuthenticationService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
class AuthenticationController {
    constructor(usuarioRepository) {
        this.googleLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const credential = req.body.credential;
            const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + credential;
            const googleResponse = yield axios_1.default.get(url)
                .then(data => {
                console.log(data);
                return data;
            })
                .catch(e => e);
            if (googleResponse.status !== 200)
                return (0, httpResponses_1.bad)(res, 'Google Token inválido.');
            const user = yield this.usuarioRepository.findOneBy({ username: googleResponse.data.email });
            if (user) {
                const data = yield AuthenticationService_1.AuthenticationService.createToken(user);
                res.setHeader('Set-Cookie', data === null || data === void 0 ? void 0 : data.headerPayload);
                res.setHeader('Set-Cookie', data === null || data === void 0 ? void 0 : data.sign);
                if (data)
                    return res.status(200).send(data);
                return (0, httpResponses_1.internalError)(res);
            }
            bcrypt_1.default.hash(crypto.randomUUID(), 10, (err, hash) => {
                if (err)
                    return (0, httpResponses_1.internalError)(res);
                const newUser = new Usuario_1.Usuario();
                newUser.nome = googleResponse.data.name;
                newUser.username = googleResponse.data.email;
                newUser.senha = hash;
                this.usuarioRepository.save(newUser)
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    const data = yield AuthenticationService_1.AuthenticationService.createToken(newUser);
                    res.setHeader('Set-Cookie', data === null || data === void 0 ? void 0 : data.headerPayload);
                    res.setHeader('Set-Cookie', data === null || data === void 0 ? void 0 : data.sign);
                    if (data)
                        return res.status(200).send(data);
                    return (0, httpResponses_1.internalError)(res);
                }))
                    .catch(() => (0, httpResponses_1.internalError)(res));
            });
        });
        this.usuarioRepository = usuarioRepository;
    }
    authenticateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = process.env.SECRET;
            if (!secret)
                return;
            const senha = req.body.senha;
            const username = req.body.username;
            if (!senha || !username)
                return (0, httpResponses_1.bad)(res, 'Erro: dados necessários não encontrados no objeto enviado.');
            if (username.includes('@'))
                return (0, httpResponses_1.bad)(res, 'Para logar com Gmail utilize o GoogleLogin');
            const user = yield this.usuarioRepository.findOneBy({ username });
            if (!user)
                return (0, httpResponses_1.bad)(res, `Erro: usuário ${username} não encontrado.`);
            const senhaIsCorrect = yield AuthenticationService_1.AuthenticationService.checkSenha(senha, user.senha);
            if (!senhaIsCorrect)
                return (0, httpResponses_1.unauthorized)(res, 'Err: usuário e/ou senha incorretos.');
            const data = yield AuthenticationService_1.AuthenticationService.createToken(user);
            res.setHeader('Set-Cookie', data === null || data === void 0 ? void 0 : data.headerPayload);
            res.setHeader('Set-Cookie', data === null || data === void 0 ? void 0 : data.sign);
            if (data)
                return res.status(200).send(data);
            return (0, httpResponses_1.internalError)(res);
        });
    }
}
exports.default = AuthenticationController;
