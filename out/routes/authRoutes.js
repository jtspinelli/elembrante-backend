"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Factory_1 = __importDefault(require("../factory/Factory"));
const authRoutes = (0, express_1.Router)();
authRoutes.post('/auth', Factory_1.default.authenticationController.authenticateUser.bind(Factory_1.default.authenticationController));
authRoutes.post('/googlelogin', Factory_1.default.authenticationController.googleLogin.bind(Factory_1.default.authenticationController));
exports.default = authRoutes;
