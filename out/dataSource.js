"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const typeorm_1 = require("typeorm");
const Lembrete_1 = require("./entity/Lembrete");
const Usuario_1 = require("./entity/Usuario");
const _1684598200838_GenerateDb_1 = require("./migrations/1684598200838-GenerateDb");
// dotenv.config();
exports.db = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [Usuario_1.Usuario, Lembrete_1.Lembrete],
    migrations: [_1684598200838_GenerateDb_1.GenerateDb1684598200838]
    //synchronize: true
});
