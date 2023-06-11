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
exports.checkUserExistsController = void 0;
const repository_1 = require("./repository");
const httpResponses_1 = require("../../helpers/httpResponses");
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
