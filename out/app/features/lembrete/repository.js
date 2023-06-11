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
exports.LembreteRepository = void 0;
const Lembrete_1 = require("../../../entity/Lembrete");
const dataSource_1 = __importDefault(require("../../../main/config/dataSource"));
const mapper_1 = __importDefault(require("../../../mappings/mapper"));
const LembreteDto_1 = __importDefault(require("./dto/LembreteDto"));
class LembreteRepository {
    constructor() {
        this.repository = dataSource_1.default.getRepository(Lembrete_1.Lembrete);
    }
    getAll(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lembretes = yield this.repository.createQueryBuilder('lembrete')
                .leftJoinAndSelect("lembrete.usuario", "usuario")
                .where('usuario.id = ' + usuarioId)
                .getMany();
            return mapper_1.default.mapArray(lembretes, Lembrete_1.Lembrete, LembreteDto_1.default);
        });
    }
}
exports.LembreteRepository = LembreteRepository;
