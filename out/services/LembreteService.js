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
const Lembrete_1 = require("../entity/Lembrete");
const LembreteDto_1 = __importDefault(require("../controller/dto/LembreteDto"));
const mapper_1 = __importDefault(require("../mappings/mapper"));
class LembreteService {
    constructor(lembreteRepository) {
        this.repository = lembreteRepository;
    }
    // public async getAll(usuarioId: number) {
    // 	const lembretes = await this.repository.createQueryBuilder('lembrete')
    // 		.leftJoinAndSelect("lembrete.usuario", "usuario")
    // 		.where('usuario.id = ' + usuarioId)
    // 		.getMany();
    // 	return mapper.mapArray(lembretes, Lembrete, LembreteDto);
    // }
    // public async create(titulo: string, descricao: string, usuario: Usuario ) {
    // 	const lembrete = this.getLembrete(titulo, descricao, new Date(), usuario);
    // 	return this.repository.save(lembrete)
    // 		.then((lembrete: Lembrete) =>  mapper.map(lembrete, Lembrete, LembreteDto))
    // 		.catch(() => null);
    // }
    update(id, novoTitulo, novaDescricao) {
        return __awaiter(this, void 0, void 0, function* () {
            const lembrete = yield this.repository.findOne({ where: { id }, relations: { usuario: true } });
            if (!lembrete)
                return;
            lembrete.titulo = novoTitulo;
            lembrete.descricao = novaDescricao;
            return this.repository.save(lembrete)
                .then((lembrete) => mapper_1.default.map(lembrete, Lembrete_1.Lembrete, LembreteDto_1.default))
                .catch(() => undefined);
        });
    }
    // public async remove(id: number) {
    // 	const lembrete = await this.repository.findOneBy({id});
    // 	if(!lembrete) return;
    // 	return this.repository.remove(lembrete)
    // 		.then(() => true)
    // 		.catch(() => false);
    // }
    setArchive(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const lembrete = yield this.repository.findOneBy({ id });
            if (!lembrete)
                return;
            lembrete.arquivado = value;
            return this.repository.save(lembrete)
                .then(() => true)
                .catch(() => false);
        });
    }
}
exports.default = LembreteService;
