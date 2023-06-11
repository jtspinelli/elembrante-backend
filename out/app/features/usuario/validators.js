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
exports.validateCreateUser = void 0;
const httpResponses_1 = require("../../helpers/httpResponses");
const repository_1 = require("./repository");
const validateCreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.nome || !req.body.username || !req.body.senha)
        return (0, httpResponses_1.bad)(res, 'Impossível criar usuário com o objeto enviado.');
    const usuarioRepository = new repository_1.UsuarioRepository();
    const user = yield usuarioRepository.findByUsername(req.body.username);
    if (user)
        return res.status(409).send('Nome de usuário não disponível.');
    if (req.body.username.includes('@')) {
        return (0, httpResponses_1.bad)(res, 'Para registrar-se com email utilize o loggin via Google');
    }
    next();
});
exports.validateCreateUser = validateCreateUser;
