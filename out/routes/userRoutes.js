"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Factory_1 = __importDefault(require("../factory/Factory"));
const userRoutes = (0, express_1.Router)();
userRoutes.post('/checkuser', Factory_1.default.usuarioControler.userExists.bind(Factory_1.default.usuarioControler));
userRoutes.post('/user', Factory_1.default.usuarioControler.createUser.bind(Factory_1.default.usuarioControler));
userRoutes.put('/user/:id', Factory_1.default.usuarioControler.updateUser.bind(Factory_1.default.usuarioControler));
userRoutes.delete('/user/:id', Factory_1.default.usuarioControler.removeUser.bind(Factory_1.default.usuarioControler));
exports.default = userRoutes;
