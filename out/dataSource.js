"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./entity/Usuario");
dotenv_safe_1.default.config();
const host = process.env.HOST;
const username = process.env.HOSTUSERNAME;
const password = process.env.HOSTPASSWORD;
exports.db = new typeorm_1.DataSource({
    type: 'mysql',
    host,
    username,
    password,
    database: 'elembrante',
    entities: [Usuario_1.Usuario]
});
