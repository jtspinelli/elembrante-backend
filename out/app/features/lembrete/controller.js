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
exports.updateLembreteController = exports.recoverLembreteController = exports.archiveLembreteController = exports.removeLembreteController = exports.addLembreteController = exports.getLembretesController = void 0;
const getLembretesUsecase_1 = require("./usecases/getLembretesUsecase");
const addLembreteUsecase_1 = require("./usecases/addLembreteUsecase");
const removeLembreteUsecase_1 = require("./usecases/removeLembreteUsecase");
const archiveLembreteUsecase_1 = require("./usecases/archiveLembreteUsecase");
const recoverLembreteUsecase_1 = require("./usecases/recoverLembreteUsecase");
const validators_1 = require("./validators");
const httpResponses_1 = require("../../shared/helpers/httpResponses");
const updateLembreteUsecase_1 = require("./usecases/updateLembreteUsecase");
const ValidatedResponse_1 = require("../../shared/helpers/ValidatedResponse");
const repository_1 = require("./repository");
const mapper_1 = __importDefault(require("../../shared/mappings/mapper"));
const getLembretesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validators_1.validate)(req, res, { strings: [], numbers: [] }, null);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const repository = new repository_1.LembreteRepository(mapper_1.default);
    const getLembretesUsecase = new getLembretesUsecase_1.GetLembretesUsecase(repository);
    const lembretes = yield getLembretesUsecase.execute(validation.usuario.id);
    return res.status(200).send(lembretes);
});
exports.getLembretesController = getLembretesController;
const addLembreteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validators_1.validate)(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, null);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const { titulo, descricao, usuario } = validation;
    const repository = new repository_1.LembreteRepository(mapper_1.default);
    const addLembreteUsecase = new addLembreteUsecase_1.AddLembreteUsecase(repository);
    const savedLembreteDto = yield addLembreteUsecase.execute(titulo, descricao, usuario);
    return res.status(201).send(savedLembreteDto);
});
exports.addLembreteController = addLembreteController;
const removeLembreteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validators_1.validate)(req, res, { strings: [], numbers: [] }, req.params.id);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const repository = new repository_1.LembreteRepository(mapper_1.default);
    const removeLembreteUsecase = new removeLembreteUsecase_1.RemoveLembreteUsecase(repository);
    yield removeLembreteUsecase.execute(Number(req.params.id));
    return (0, httpResponses_1.success)(res);
});
exports.removeLembreteController = removeLembreteController;
const archiveLembreteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validators_1.validate)(req, res, { strings: [], numbers: [] }, req.params.id);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const repository = new repository_1.LembreteRepository(mapper_1.default);
    const archiveLembreteUsecase = new archiveLembreteUsecase_1.ArchiveLembreteUsecase(repository);
    yield archiveLembreteUsecase.execute(Number(req.params.id));
    return (0, httpResponses_1.success)(res);
});
exports.archiveLembreteController = archiveLembreteController;
const recoverLembreteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validators_1.validate)(req, res, { strings: [], numbers: [] }, req.params.id);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const repository = new repository_1.LembreteRepository(mapper_1.default);
    const recoverLembreteUsecase = new recoverLembreteUsecase_1.RecoverLembreteUsecase(repository);
    yield recoverLembreteUsecase.execute(Number(req.params.id));
    return (0, httpResponses_1.success)(res);
});
exports.recoverLembreteController = recoverLembreteController;
const updateLembreteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validators_1.validate)(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, req.params.id);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const repository = new repository_1.LembreteRepository(mapper_1.default);
    const updateLembreteUsecase = new updateLembreteUsecase_1.UpdateLembreteUsecase(repository);
    const savedLembrete = yield updateLembreteUsecase.execute(Number(req.params.id), req.body.titulo, req.body.descricao);
    return res.status(200).send(savedLembrete);
});
exports.updateLembreteController = updateLembreteController;
