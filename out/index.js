"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lembreteRepository = exports.tokenRepository = exports.usuarioRepository = void 0;
const express_1 = __importStar(require("express"));
const crud_1 = require("./features/lembretes/crud");
const crud_2 = require("./features/users/crud");
const auth_1 = require("./features/users/auth");
const Lembrete_1 = require("./entity/Lembrete");
const Usuario_1 = require("./entity/Usuario");
const Token_1 = require("./entity/Token");
const dataSource_1 = require("./dataSource");
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.use((0, cors_1.default)());
exports.usuarioRepository = dataSource_1.db.getRepository(Usuario_1.Usuario);
exports.tokenRepository = dataSource_1.db.getRepository(Token_1.Token);
exports.lembreteRepository = dataSource_1.db.getRepository(Lembrete_1.Lembrete);
app.get('/', (_req, res) => res.send('Hello!'));
app.post('/user', crud_2.createUser);
app.put('/user/:id', crud_2.updateUser);
app.delete('/user/:id', crud_2.removeUser);
app.post('/auth', auth_1.authenticateUser);
app.put('/lembrete/archive/:id', crud_1.archiveLembrete);
app.put('/lembrete/recover/:id', crud_1.recoverLembrete);
app.post('/lembrete', crud_1.addLembrete);
dataSource_1.db.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    app.listen(port, () => console.log("APP RUNNING ON PORT " + port));
}));
