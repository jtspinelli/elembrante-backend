"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = void 0;
const dataSource_1 = require("../dataSource");
const Usuario_1 = require("../entity/Usuario");
class UsuarioRepository {
    constructor() {
        this.repository = dataSource_1.db.getRepository(Usuario_1.Usuario);
    }
}
exports.UsuarioRepository = UsuarioRepository;
