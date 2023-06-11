"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Factory_1 = __importDefault(require("../factory/Factory"));
const lembreteRoutes = (0, express_1.Router)();
// lembreteRoutes.get('/lembretes', Factory.lembreteController.getLembretes());
// lembreteRoutes.post('/lembrete', Factory.lembreteController.addLembrete());
lembreteRoutes.put('/lembrete/:id', Factory_1.default.lembreteController.updateLembrete());
lembreteRoutes.put('/lembrete/archive/:id', Factory_1.default.lembreteController.archiveLembrete());
lembreteRoutes.put('/lembrete/recover/:id', Factory_1.default.lembreteController.recoverLembrete());
// lembreteRoutes.delete('/lembrete/:id', Factory.lembreteController.removeLembrete());
exports.default = lembreteRoutes;
