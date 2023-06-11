"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Factory_1 = __importDefault(require("../factory/Factory"));
const userRoutes = (0, express_1.Router)();
// userRoutes.post('/checkuser', Factory.usuarioControler.userExists());
// userRoutes.post('/user', Factory.usuarioControler.createUser());
userRoutes.put('/user/:id', Factory_1.default.usuarioControler.updateUser());
// userRoutes.delete('/user/:id', Factory.usuarioControler.removeUser());
exports.default = userRoutes;
