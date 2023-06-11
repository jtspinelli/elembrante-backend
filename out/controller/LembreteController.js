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
const httpResponses_1 = require("./helpers/httpResponses");
const ValidatedResponse_1 = require("./helpers/ValidatedResponse");
class LembreteController {
    constructor(validationService, lembreteService) {
        this.validationService = validationService;
        this.service = lembreteService;
    }
    // public getLembretes() : ExpressRouteFunc {
    // 	return async(req: Request, res: Response) => {
    // 		const validation = await this.validationService.validate(req, res, { strings: [], numbers: []}, null);
    // 		if(!(validation instanceof ValidatedResponse)) return;
    // 		return res.status(200).send(await this.service.getAll(validation.usuario.id));
    // 	}
    // }
    // public addLembrete() : ExpressRouteFunc {
    // 	return async (req: Request, res: Response) => {
    // 		const validation = await this.validationService.validate(req, res, { strings: ['titulo', 'descricao'], numbers: []}, null);
    // 		if(!(validation instanceof ValidatedResponse)) return;
    // 		const { titulo, descricao, usuario } = validation;
    // 		const newLembrete = await this.service.create(titulo, descricao, usuario);
    // 		if(!newLembrete) return internalError(res);
    // 		res.status(201).send(newLembrete);
    // 	}
    // }
    updateLembrete() {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            const validation = yield this.validationService.validate(req, res, { strings: ['titulo', 'descricao'], numbers: [] }, req.params.id);
            if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
                return;
            const lembrete = yield this.service.update(Number(req.params.id), req.body.titulo, req.body.descricao);
            if (!lembrete) {
                return (0, httpResponses_1.internalError)(res);
            }
            res.status(200).send(lembrete);
        });
    }
    archiveLembrete() {
        return this.setArchive(true);
    }
    recoverLembrete() {
        return this.setArchive(false);
    }
    setArchive(value) {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            const validation = yield this.validationService.validate(req, res, { strings: [], numbers: [] }, req.params.id);
            if (!(validation instanceof ValidatedResponse_1.ValidatedResponse))
                return;
            if (!(yield this.service.setArchive(Number(req.params.id), value))) {
                return (0, httpResponses_1.internalError)(res);
            }
            ;
            (0, httpResponses_1.success)(res);
        });
    }
}
exports.default = LembreteController;
