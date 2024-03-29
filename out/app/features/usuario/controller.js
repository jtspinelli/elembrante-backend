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
exports.updateUserController = exports.removeUserController = exports.createUserController = exports.checkUserExistsController = void 0;
const repository_1 = require("./repository");
const httpResponses_1 = require("../../shared/helpers/httpResponses");
const createUsuarioUsecase_1 = require("./usecases/createUsuarioUsecase");
const removeUsuarioUsecase_1 = require("./usecases/removeUsuarioUsecase");
const updateUsuarioUsecase_1 = require("./usecases/updateUsuarioUsecase");
const checkUserExistsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioRepository = new repository_1.UsuarioRepository();
    const username = req.body.username;
    if (!username)
        return;
    const user = yield usuarioRepository.findByUsername(username);
    if (!user)
        return (0, httpResponses_1.notfound)(res, 'Erro: usuário não encontrado.');
    res.status(200).send();
});
exports.checkUserExistsController = checkUserExistsController;
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarioRepository = new repository_1.UsuarioRepository();
        const createUsuarioUsecase = new createUsuarioUsecase_1.CreateUsuarioUsecase(usuarioRepository);
        const { nome, username, senha } = req.body;
        const newUserToken = yield createUsuarioUsecase.execute(nome, username, senha);
        res.setHeader('Set-Cookie', newUserToken === null || newUserToken === void 0 ? void 0 : newUserToken.headerPayload);
        res.setHeader('Set-Cookie', newUserToken === null || newUserToken === void 0 ? void 0 : newUserToken.sign);
        return (0, httpResponses_1.success)(res);
    }
    catch (error) {
        if (error.message.includes('Duplicate entry') && error.message.includes('usuario.username')) {
            return (0, httpResponses_1.bad)(res, 'Nome de usuário não disponível');
        }
        (0, httpResponses_1.internalError)(res);
    }
});
exports.createUserController = createUserController;
const removeUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarioRepository = new repository_1.UsuarioRepository();
        const removeUsuarioUsecase = new removeUsuarioUsecase_1.RemoveUsuarioUsecase(usuarioRepository);
        yield removeUsuarioUsecase.execute(req.body.user);
        return (0, httpResponses_1.success)(res);
    }
    catch (error) {
        return (0, httpResponses_1.internalError)(res);
    }
});
exports.removeUserController = removeUserController;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, nome, username } = req.body;
        const usuarioRepository = new repository_1.UsuarioRepository();
        const updateUsuarioUsecase = new updateUsuarioUsecase_1.UpdateUsuarioUsecase(usuarioRepository);
        yield updateUsuarioUsecase.execute(user, nome, username);
        return (0, httpResponses_1.success)(res);
    }
    catch (error) {
        return (0, httpResponses_1.internalError)(res);
    }
});
exports.updateUserController = updateUserController;
