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
exports.googleLoginController = exports.loginController = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpResponses_1 = require("../../shared/helpers/httpResponses");
const repository_1 = require("../usuario/repository");
const cookie_1 = require("cookie");
const googleLoginUsecase_1 = require("./usecases/googleLoginUsecase");
const InvalidGoogleTokenError_1 = require("../../shared/errors/InvalidGoogleTokenError");
function createToken(user) {
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
exports.createToken = createToken;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield createToken(req.body.user);
    res.setHeader('Set-Cookie', data === null || data === void 0 ? void 0 : data.headerPayload);
    res.setHeader('Set-Cookie', data === null || data === void 0 ? void 0 : data.sign);
    if (data)
        return res.status(200).send(data);
    return (0, httpResponses_1.internalError)(res);
});
exports.loginController = loginController;
const googleLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repository = new repository_1.UsuarioRepository();
    const googleLoginUsecase = new googleLoginUsecase_1.GoogleLoginUsecase(repository);
    try {
        const data = yield googleLoginUsecase.execute(req.body.credential);
        res.setHeader('Set-Cookie', data === null || data === void 0 ? void 0 : data.headerPayload);
        res.setHeader('Set-Cookie', data === null || data === void 0 ? void 0 : data.sign);
        return res.status(200).send(data);
    }
    catch (error) {
        if (error instanceof InvalidGoogleTokenError_1.InvalidGoogleTokenError)
            return error.respond(res);
    }
});
exports.googleLoginController = googleLoginController;
