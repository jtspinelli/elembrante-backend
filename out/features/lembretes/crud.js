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
const index_1 = require("./../../index");
const ValidatedResponse_1 = require("../../entity/ValidatedResponse");
const httpResponses_1 = require("./../httpResponses");
const Lembrete_1 = require("../../entity/Lembrete");
const validations_1 = require("./validations");
const httpResponses_2 = require("../httpResponses");
const getLembrete = (titulo, descricao, usuario) => {
    const newLembrete = new Lembrete_1.Lembrete();
    newLembrete.titulo = titulo;
    newLembrete.descricao = descricao;
    newLembrete.usuario = usuario;
    newLembrete.excluido = false;
    return newLembrete;
};
const addLembrete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validations_1.validate)(req, res, { strings: ['titulo', 'descricao'], numbers: ['userId'] });
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const { titulo, descricao, usuario } = validation;
    const newLembrete = getLembrete(titulo, descricao, usuario);
    index_1.lembreteRepository.save(newLembrete)
        .then(() => (0, httpResponses_2.success)(res))
        .catch(() => (0, httpResponses_1.internalError)(res));
});
exports.addLembrete = addLembrete;
