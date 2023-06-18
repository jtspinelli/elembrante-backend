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
exports.UpdateUsuarioUsecase = void 0;
class UpdateUsuarioUsecase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    execute(user, nome, username) {
        return __awaiter(this, void 0, void 0, function* () {
            user.nome = nome !== null && nome !== void 0 ? nome : user.nome;
            user.username = username !== null && username !== void 0 ? username : user.username;
            return yield this.usuarioRepository.save(user);
        });
    }
}
exports.UpdateUsuarioUsecase = UpdateUsuarioUsecase;
