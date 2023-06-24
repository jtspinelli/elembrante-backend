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
exports.LoginUsecase = void 0;
const cookie_1 = require("cookie");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginUsecase {
    static createToken(user) {
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
    execute(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            return LoginUsecase.createToken(usuario);
        });
    }
}
exports.LoginUsecase = LoginUsecase;
