"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lembrete = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const classes_1 = require("@automapper/classes");
let Lembrete = class Lembrete {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], Lembrete.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], Lembrete.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], Lembrete.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, (usuario) => usuario.lembretes),
    __metadata("design:type", Usuario_1.Usuario)
], Lembrete.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], Lembrete.prototype, "arquivado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Date)
], Lembrete.prototype, "criadoEm", void 0);
Lembrete = __decorate([
    (0, typeorm_1.Entity)()
], Lembrete);
exports.Lembrete = Lembrete;
