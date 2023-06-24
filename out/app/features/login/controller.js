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
exports.googleLoginController = exports.loginController = void 0;
const httpResponses_1 = require("../../shared/helpers/httpResponses");
const repository_1 = require("../usuario/repository");
const googleLoginUsecase_1 = require("./usecases/googleLoginUsecase");
const InvalidGoogleTokenError_1 = require("../../shared/errors/InvalidGoogleTokenError");
const loginUsecase_1 = require("./usecases/loginUsecase");
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUsecase = new loginUsecase_1.LoginUsecase();
    const data = yield loginUsecase.execute(req.body.user);
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
