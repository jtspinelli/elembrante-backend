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
exports.RemoveLembreteUsecase = void 0;
const repository_1 = require("../repository");
class RemoveLembreteUsecase {
    constructor() {
        this.repository = new repository_1.LembreteRepository();
    }
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lembrete = yield this.repository.findOneById(id);
            if (!lembrete)
                return;
            yield this.repository.remove(lembrete);
        });
    }
}
exports.RemoveLembreteUsecase = RemoveLembreteUsecase;
