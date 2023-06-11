"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const usuarioRouter = (0, express_1.Router)();
usuarioRouter.post('/checkuser', controller_1.checkUserExistsController);
exports.default = usuarioRouter;
