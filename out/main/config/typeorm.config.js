"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
const _1684598200838_GenerateDb_1 = require("../../migrations/1684598200838-GenerateDb");
const Lembrete_1 = require("../../app/shared/database/entities/Lembrete");
const Usuario_1 = require("../../app/shared/database/entities/Usuario");
dotenv_safe_1.default.config();
const typeormconfig = {
    type: 'postgres',
    url: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    },
    entities: [Usuario_1.Usuario, Lembrete_1.Lembrete],
    migrations: [_1684598200838_GenerateDb_1.GenerateDb1684598200838]
};
exports.default = typeormconfig;
