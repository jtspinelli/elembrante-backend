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
exports.updateLembrete = exports.removeLembrete = exports.setArchive = exports.recoverLembrete = exports.archiveLembrete = exports.addLembrete = exports.getLembretes = void 0;
const index_1 = require("./../../index");
const LembreteViewModel_1 = require("./../../viewModels/LembreteViewModel");
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
    newLembrete.arquivado = false;
    return newLembrete;
};
const getLembretes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validations_1.validate)(req, res, { strings: [], numbers: [] }, null);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const usuario = validation.usuario;
    const lembretes = usuario.lembretes
        .map(lembrete => {
        const viewModel = new LembreteViewModel_1.LembreteViewModel();
        viewModel.id = lembrete.id;
        viewModel.arquivado = lembrete.arquivado;
        viewModel.titulo = lembrete.titulo;
        viewModel.descricao = lembrete.descricao;
        viewModel.criadoEm = lembrete.criadoEm;
        return viewModel;
    });
    return res.status(200).send(lembretes);
});
exports.getLembretes = getLembretes;
const addLembrete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validations_1.validate)(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, null);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const { titulo, descricao, usuario } = validation;
    const newLembrete = getLembrete(titulo, descricao, usuario);
    index_1.lembreteRepository.save(newLembrete)
        .then(() => (0, httpResponses_2.success)(res))
        .catch(() => (0, httpResponses_1.internalError)(res));
});
exports.addLembrete = addLembrete;
const archiveLembrete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.setArchive)(req, res, true);
});
exports.archiveLembrete = archiveLembrete;
const recoverLembrete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.setArchive)(req, res, false);
});
exports.recoverLembrete = recoverLembrete;
const setArchive = (req, res, value) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validations_1.validate)(req, res, { strings: [], numbers: [] }, req.params.id);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const lembrete = yield index_1.lembreteRepository.findOneBy({ id: Number(req.params.id) });
    if (!lembrete)
        return;
    lembrete.arquivado = value;
    index_1.lembreteRepository.save(lembrete)
        .then(() => (0, httpResponses_2.success)(res))
        .catch(() => (0, httpResponses_1.internalError)(res));
});
exports.setArchive = setArchive;
const removeLembrete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validations_1.validate)(req, res, { strings: [], numbers: [] }, req.params.id);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const lembrete = yield index_1.lembreteRepository.findOneBy({ id: Number(req.params.id) });
    if (!lembrete)
        return;
    index_1.lembreteRepository.remove(lembrete)
        .then(() => (0, httpResponses_2.success)(res))
        .catch(() => (0, httpResponses_1.internalError)(res));
});
exports.removeLembrete = removeLembrete;
const updateLembrete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validations_1.validate)(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, req.params.id);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const lembrete = yield index_1.lembreteRepository.findOneBy({ id: Number(req.params.id) });
    if (!lembrete)
        return;
    lembrete.titulo = req.body.titulo;
    lembrete.descricao = req.body.descricao;
    index_1.lembreteRepository.save(lembrete)
        .then(() => (0, httpResponses_2.success)(res))
        .catch(() => (0, httpResponses_1.internalError)(res));
});
exports.updateLembrete = updateLembrete;
