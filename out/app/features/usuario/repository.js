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
exports.UsuarioRepository = void 0;
const Usuario_1 = require("../../../entity/Usuario");
const dataSource_1 = __importDefault(require("../../../main/config/dataSource"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UsuarioRepository {
    constructor() {
        this.repository = dataSource_1.default.getRepository(Usuario_1.Usuario);
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOneBy({ username });
        });
    }
    checkSenha(senha, savedSenha) {
        return new Promise((res, _rej) => {
            bcrypt_1.default.compare(senha, savedSenha).then(pass => {
                res(pass);
            });
        });
    }
    save(usuario) {
        return this.repository.save(usuario);
    }
}
exports.UsuarioRepository = UsuarioRepository;
