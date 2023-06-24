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
exports.GoogleLoginUsecase = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const InvalidGoogleTokenError_1 = require("../../../shared/errors/InvalidGoogleTokenError");
const Usuario_1 = require("../../../shared/database/entities/Usuario");
const cookie_1 = require("cookie");
const crypto_1 = require("crypto");
class GoogleLoginUsecase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    createToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getGoogleUserData(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + token;
            return yield axios_1.default.get(url)
                .then(data => data)
                .catch(e => e);
        });
    }
    execute(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            const googleResponse = yield this.getGoogleUserData(credential);
            if (googleResponse.status !== 200)
                throw new InvalidGoogleTokenError_1.InvalidGoogleTokenError();
            const user = yield this.usuarioRepository.findByUsername(googleResponse.data.email);
            if (user)
                return yield this.createToken(user);
            const hashedRandomPass = yield bcryptjs_1.default.hash((0, crypto_1.randomUUID)(), 10);
            const newUser = new Usuario_1.Usuario();
            newUser.nome = googleResponse.data.name;
            newUser.username = googleResponse.data.email;
            newUser.senha = hashedRandomPass;
            yield this.usuarioRepository.save(newUser);
            return yield this.createToken(newUser);
        });
    }
}
exports.GoogleLoginUsecase = GoogleLoginUsecase;
