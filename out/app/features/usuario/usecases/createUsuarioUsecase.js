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
exports.CreateUsuarioUsecase = void 0;
const repository_1 = require("../repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Usuario_1 = require("../../../../entity/Usuario");
const controller_1 = require("../../login/controller");
class CreateUsuarioUsecase {
    constructor() {
        this.usuarioRepository = new repository_1.UsuarioRepository();
    }
    execute(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                bcrypt_1.default.hash(req.body.senha, 10, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                    // if(err) return internalError(res);
                    const newUser = new Usuario_1.Usuario();
                    newUser.nome = req.body.nome;
                    newUser.username = req.body.username;
                    newUser.senha = hash;
                    yield this.usuarioRepository.save(newUser);
                    res(yield (0, controller_1.createToken)(newUser));
                    // res.setHeader('Set-Cookie', data?.headerPayload as string);
                    // res.setHeader('Set-Cookie', data?.sign as string);
                    // success(res);
                }));
            });
        });
    }
}
exports.CreateUsuarioUsecase = CreateUsuarioUsecase;
