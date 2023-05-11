"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const typeorm_1 = require("typeorm");
const Lembrete_1 = require("./entity/Lembrete");
const Usuario_1 = require("./entity/Usuario");
// dotenv.config();
const host = process.env.HOST;
const username = process.env.HOSTUSERNAME;
const password = process.env.HOSTPASSWORD;
exports.db = new typeorm_1.DataSource({
    type: 'mysql',
    host,
    username,
    password,
    database: 'elembrante',
    entities: [Usuario_1.Usuario, Lembrete_1.Lembrete],
    // synchronize: true
});
