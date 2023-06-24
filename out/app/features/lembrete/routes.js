"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const lembreteRouter = (0, express_1.Router)();
lembreteRouter.get('/lembretes', controller_1.getLembretesController);
lembreteRouter.post('/lembrete', controller_1.addLembreteController);
lembreteRouter.delete('/lembrete/:id', controller_1.removeLembreteController);
lembreteRouter.put('/lembrete/archive/:id', controller_1.archiveLembreteController);
lembreteRouter.put('/lembrete/recover/:id', controller_1.recoverLembreteController);
lembreteRouter.put('/lembrete/:id', controller_1.updateLembreteController);
exports.default = lembreteRouter;
