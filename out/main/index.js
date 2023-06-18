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
exports.app = void 0;
require("reflect-metadata");
const express_1 = __importStar(require("express"));
const core_1 = require("@automapper/core");
const httpRoutes_config_1 = require("./config/httpRoutes.config");
const appEnv_1 = require("../app/env/appEnv");
const Lembrete_1 = require("../app/shared/database/entities/Lembrete");
const dataSource_1 = __importDefault(require("./config/dataSource"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const https_1 = __importDefault(require("https"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const LembreteDto_1 = __importDefault(require("../app/features/lembrete/dto/LembreteDto"));
const mapper_1 = __importDefault(require("../app/shared/mappings/mapper"));
// const key = fs.readFileSync(path.join(__dirname, '..', '/cert/localhost.key'));
// const cert = fs.readFileSync(path.join(__dirname, '..', '/cert/localhost.crt'));
// Use when running tests:
const key = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '/out/cert/localhost.key'));
const cert = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '/out/cert/localhost.crt'));
/////////
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.static(path_1.default.join(__dirname, '..', "public")));
exports.app.use((0, express_1.json)());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    credentials: true
}));
(0, httpRoutes_config_1.registerRoutes)(exports.app);
const server = https_1.default.createServer({ key, cert }, exports.app);
(0, core_1.createMap)(mapper_1.default, Lembrete_1.Lembrete, LembreteDto_1.default, (0, core_1.forMember)(dto => dto.usuarioId, (0, core_1.mapFrom)(lembrete => lembrete.usuario.id)));
exports.app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', "public", "index.html"));
});
if (process.env.NODE_ENV !== 'test') {
    dataSource_1.default.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
        // app.listen(appEnv.port, () => console.log("APP RUNNING ON PORT " + appEnv.port));
        server.listen(appEnv_1.appEnv.port, () => console.log("APP RUNNING ON PORT " + appEnv_1.appEnv.port));
    }));
}
