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
exports.AddLembreteUsecase = void 0;
const repository_1 = require("../repository");
const Lembrete_1 = require("../../../shared/database/entities/Lembrete");
const mapper_1 = __importDefault(require("../../../../mappings/mapper"));
const LembreteDto_1 = __importDefault(require("../dto/LembreteDto"));
class AddLembreteUsecase {
    constructor() {
        this.lembreteRepository = new repository_1.LembreteRepository();
    }
    execute(titulo, descricao, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedLembrete = yield this.lembreteRepository.create(titulo, descricao, usuario);
            return mapper_1.default.map(savedLembrete, Lembrete_1.Lembrete, LembreteDto_1.default);
        });
    }
}
exports.AddLembreteUsecase = AddLembreteUsecase;
