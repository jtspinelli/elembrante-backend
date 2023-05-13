"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const typeorm_1 = require("typeorm");
const Lembrete_1 = require("./entity/Lembrete");
const Usuario_1 = require("./entity/Usuario");
// dotenv.config();
exports.db = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [Usuario_1.Usuario, Lembrete_1.Lembrete],
    //synchronize: true
});
