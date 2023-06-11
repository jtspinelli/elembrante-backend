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
exports.getLembretesController = void 0;
const ValidatedResponse_1 = require("../../../controller/helpers/ValidatedResponse");
const validators_1 = require("./validators");
const getLembretesUsecase_1 = require("./usecases/getLembretesUsecase");
const getLembretesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, validators_1.validate)(req, res, { strings: [], numbers: [] }, null);
    if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
        return;
    const getLembretesUsecase = new getLembretesUsecase_1.GetLembretesUsecase();
    const lembretes = yield getLembretesUsecase.execute(validation.usuario.id);
    return res.status(200).send(lembretes);
});
exports.getLembretesController = getLembretesController;
