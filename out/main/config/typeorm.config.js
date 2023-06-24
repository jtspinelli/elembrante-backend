"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lembrete_1 = require("../../app/shared/database/entities/Lembrete");
const Usuario_1 = require("../../app/shared/database/entities/Usuario");
const _1684598200838_GenerateDb_1 = require("../../app/shared/database/migrations/1684598200838-GenerateDb");
const _1687053124264_GenerateDb_1 = require("../../app/shared/database/migrations/1687053124264-GenerateDb");
const appEnv_1 = require("../../app/env/appEnv");
let typeormconfig = {
    type: 'postgres',
    url: appEnv_1.appEnv.dbUrl,
    ssl: {
        rejectUnauthorized: false
    },
    entities: [Usuario_1.Usuario, Lembrete_1.Lembrete],
    migrations: [_1684598200838_GenerateDb_1.GenerateDb1684598200838]
};
if (process.env.NODE_ENV === 'test') {
    typeormconfig = {
        type: 'sqlite',
        database: './dbtest.sqlite',
        logging: false,
        synchronize: true,
        entities: [Usuario_1.Usuario, Lembrete_1.Lembrete],
        migrations: [_1687053124264_GenerateDb_1.GenerateDb1687053124264]
    };
}
exports.default = typeormconfig;
