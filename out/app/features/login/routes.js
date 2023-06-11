"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const validators_1 = require("./validators");
const loginRouter = (0, express_1.Router)();
exports.loginRouter = loginRouter;
loginRouter.post('/', validators_1.validateLogin, controller_1.loginController);
