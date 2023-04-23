"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Factory_1 = __importDefault(require("../factory/Factory"));
const lembreteRoutes = (0, express_1.Router)();
lembreteRoutes.get('/lembretes', Factory_1.default.lembreteController.getLembretes.bind(Factory_1.default.lembreteController));
lembreteRoutes.post('/lembrete', Factory_1.default.lembreteController.addLembrete.bind(Factory_1.default.lembreteController));
lembreteRoutes.put('/lembrete/:id', Factory_1.default.lembreteController.updateLembrete.bind(Factory_1.default.lembreteController));
lembreteRoutes.put('/lembrete/archive/:id', Factory_1.default.lembreteController.archiveLembrete.bind(Factory_1.default.lembreteController));
lembreteRoutes.put('/lembrete/recover/:id', Factory_1.default.lembreteController.recoverLembrete.bind(Factory_1.default.lembreteController));
lembreteRoutes.delete('/lembrete/:id', Factory_1.default.lembreteController.removeLembrete.bind(Factory_1.default.lembreteController));
exports.default = lembreteRoutes;
