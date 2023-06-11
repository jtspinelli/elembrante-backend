"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const lembreteRouter = (0, express_1.Router)();
lembreteRouter.get('/lembretes', controller_1.getLembretesController);
exports.default = lembreteRouter;
