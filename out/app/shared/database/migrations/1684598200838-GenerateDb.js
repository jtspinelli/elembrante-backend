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
exports.GenerateDb1684598200838 = void 0;
class GenerateDb1684598200838 {
    constructor() {
        this.name = 'GenerateDb1684598200838';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "username" character varying NOT NULL, "senha" character varying NOT NULL, "excluido" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_6ccff37176a6978449a99c82e10" UNIQUE ("username"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "lembrete" ("id" SERIAL NOT NULL, "titulo" character varying NOT NULL, "descricao" character varying NOT NULL, "arquivado" boolean NOT NULL, "criadoEm" TIMESTAMP NOT NULL, "usuarioId" integer, CONSTRAINT "PK_23fa84acc924f66f19f26d63d47" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "lembrete" ADD CONSTRAINT "FK_0a9b2caa53b763a28116393add6" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "lembrete" DROP CONSTRAINT "FK_0a9b2caa53b763a28116393add6"`);
            yield queryRunner.query(`DROP TABLE "lembrete"`);
            yield queryRunner.query(`DROP TABLE "usuario"`);
        });
    }
}
exports.GenerateDb1684598200838 = GenerateDb1684598200838;
