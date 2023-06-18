"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateDb1687053124264 = void 0;
class GenerateDb1687053124264 {
    constructor() {
        this.name = 'GenerateDb1687053124264';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "usuario" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nome" varchar NOT NULL, "username" varchar NOT NULL, "senha" varchar NOT NULL, "excluido" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_6ccff37176a6978449a99c82e10" UNIQUE ("username"))`);
            yield queryRunner.query(`CREATE TABLE "lembrete" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "titulo" varchar NOT NULL, "descricao" varchar NOT NULL, "arquivado" boolean NOT NULL, "criadoEm" datetime NOT NULL, "usuarioId" integer)`);
            yield queryRunner.query(`CREATE TABLE "temporary_lembrete" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "titulo" varchar NOT NULL, "descricao" varchar NOT NULL, "arquivado" boolean NOT NULL, "criadoEm" datetime NOT NULL, "usuarioId" integer, CONSTRAINT "FK_0a9b2caa53b763a28116393add6" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_lembrete"("id", "titulo", "descricao", "arquivado", "criadoEm", "usuarioId") SELECT "id", "titulo", "descricao", "arquivado", "criadoEm", "usuarioId" FROM "lembrete"`);
            yield queryRunner.query(`DROP TABLE "lembrete"`);
            yield queryRunner.query(`ALTER TABLE "temporary_lembrete" RENAME TO "lembrete"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "lembrete" RENAME TO "temporary_lembrete"`);
            yield queryRunner.query(`CREATE TABLE "lembrete" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "titulo" varchar NOT NULL, "descricao" varchar NOT NULL, "arquivado" boolean NOT NULL, "criadoEm" datetime NOT NULL, "usuarioId" integer)`);
            yield queryRunner.query(`INSERT INTO "lembrete"("id", "titulo", "descricao", "arquivado", "criadoEm", "usuarioId") SELECT "id", "titulo", "descricao", "arquivado", "criadoEm", "usuarioId" FROM "temporary_lembrete"`);
            yield queryRunner.query(`DROP TABLE "temporary_lembrete"`);
            yield queryRunner.query(`DROP TABLE "lembrete"`);
            yield queryRunner.query(`DROP TABLE "usuario"`);
        });
    }
}
exports.GenerateDb1687053124264 = GenerateDb1687053124264;
