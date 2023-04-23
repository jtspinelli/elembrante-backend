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
const Lembrete_1 = require("../entity/Lembrete");
const ValidatedResponse_1 = require("../entity/ValidatedResponse");
const LembreteViewModel_1 = require("../viewModels/LembreteViewModel");
const httpResponses_1 = require("./httpResponses");
class LembreteController {
    constructor(repository, validationService) {
        this.getLembrete = (titulo, descricao, criadoEm, usuario) => {
            const newLembrete = new Lembrete_1.Lembrete();
            newLembrete.titulo = titulo;
            newLembrete.descricao = descricao;
            newLembrete.usuario = usuario;
            newLembrete.criadoEm = criadoEm;
            newLembrete.arquivado = false;
            return newLembrete;
        };
        this.repository = repository;
        this.validationService = validationService;
    }
    getLembretes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield this.validationService.validate(req, res, { strings: [], numbers: [] }, null);
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
    }
    addLembrete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield this.validationService.validate(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, null);
            if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
                return;
            const { titulo, descricao, usuario } = validation;
            const newLembrete = this.getLembrete(titulo, descricao, new Date(), usuario);
            this.repository.save(newLembrete)
                .then((lembrete) => res.status(201).send(lembrete))
                .catch((err) => {
                console.log(err);
                (0, httpResponses_1.internalError)(res);
            });
        });
    }
    updateLembrete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield this.validationService.validate(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, req.params.id);
            if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
                return;
            const lembrete = yield this.repository.findOneBy({ id: Number(req.params.id) });
            if (!lembrete)
                return;
            lembrete.titulo = req.body.titulo;
            lembrete.descricao = req.body.descricao;
            this.repository.save(lembrete)
                .then((lembrete) => res.status(200).send(lembrete))
                .catch(() => (0, httpResponses_1.internalError)(res));
        });
    }
    archiveLembrete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setArchive(req, res, true);
        });
    }
    recoverLembrete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setArchive(req, res, false);
        });
    }
    setArchive(req, res, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield this.validationService.validate(req, res, { strings: [], numbers: [] }, req.params.id);
            if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
                return;
            const lembrete = yield this.repository.findOneBy({ id: Number(req.params.id) });
            if (!lembrete)
                return;
            lembrete.arquivado = value;
            this.repository.save(lembrete)
                .then(() => (0, httpResponses_1.success)(res))
                .catch(() => (0, httpResponses_1.internalError)(res));
        });
    }
    removeLembrete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = yield this.validationService.validate(req, res, { strings: [], numbers: [] }, req.params.id);
            if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
                return;
            const lembrete = yield this.repository.findOneBy({ id: Number(req.params.id) });
            if (!lembrete)
                return;
            this.repository.remove(lembrete)
                .then(() => (0, httpResponses_1.success)(res))
                .catch(() => (0, httpResponses_1.internalError)(res));
        });
    }
}
exports.default = LembreteController;
