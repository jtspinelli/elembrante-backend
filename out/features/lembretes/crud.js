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
exports.addLembrete = void 0;
const __1 = require("../..");
const httpResponses_1 = require("../httpResponses");
const index_1 = require("./../../index");
const httpResponses_2 = require("./../httpResponses");
const Lembrete_1 = require("../../entity/Lembrete");
const addLembrete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers.access_token;
    if (!accessToken)
        return (0, httpResponses_1.unauthorized)(res, 'Token não encontrado ou inválido.');
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const id = Number(req.body.userId);
    if (!titulo || !descricao || !id)
        return (0, httpResponses_1.bad)(res, 'Erro: impossível criar um lembrete com o objeto enviado.');
    const user = yield __1.usuarioRepository.findOneBy({ id });
    if (!user)
        return (0, httpResponses_1.bad)(res, `Erro: o id ${id} não está vinculado a nenhum usuário ativo.`);
    const savedToken = yield __1.tokenRepository.findOneBy({ userId: user.id });
    if (!savedToken)
        return (0, httpResponses_1.bad)(res, 'Erro: o usuário não possui token de acesso. Autentique-se.');
    const today = new Date();
    if (today > savedToken.expiraEm)
        return (0, httpResponses_1.bad)(res, 'Erro: token expirou. Autentique-se novamente.');
    if (accessToken !== savedToken.accessToken)
        return (0, httpResponses_1.unauthorized)(res, 'Não autorizado.');
    const newLembrete = new Lembrete_1.Lembrete();
    newLembrete.titulo = titulo;
    newLembrete.descricao = descricao;
    newLembrete.usuario = user;
    newLembrete.excluido = false;
    index_1.lembreteRepository.save(newLembrete)
        .then(() => (0, httpResponses_1.success)(res))
        .catch((err) => {
        console.log(err);
        (0, httpResponses_2.internalError)(res);
    });
});
exports.addLembrete = addLembrete;
