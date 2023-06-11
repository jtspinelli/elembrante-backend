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
exports.UpdateLembreteUsecase = void 0;
const mapper_1 = __importDefault(require("../../../../mappings/mapper"));
const Lembrete_1 = require("../../../shared/database/entities/Lembrete");
const LembreteDto_1 = __importDefault(require("../dto/LembreteDto"));
const repository_1 = require("../repository");
class UpdateLembreteUsecase {
    constructor() {
        this.repository = new repository_1.LembreteRepository();
    }
    execute(id, novoTitulo, novaDescricao) {
        return __awaiter(this, void 0, void 0, function* () {
            const lembrete = yield this.repository.findOneByIdWithRelations(id);
            if (!lembrete)
                return;
            lembrete.titulo = novoTitulo;
            lembrete.descricao = novaDescricao;
            const savedLembrete = yield this.repository.save(lembrete);
            return mapper_1.default.map(savedLembrete, Lembrete_1.Lembrete, LembreteDto_1.default);
        });
    }
}
exports.UpdateLembreteUsecase = UpdateLembreteUsecase;
