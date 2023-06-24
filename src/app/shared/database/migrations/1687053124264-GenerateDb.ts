import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateDb1687053124264 implements MigrationInterface {
    name = 'GenerateDb1687053124264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuario" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nome" varchar NOT NULL, "username" varchar NOT NULL, "senha" varchar NOT NULL, "excluido" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_6ccff37176a6978449a99c82e10" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "lembrete" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "titulo" varchar NOT NULL, "descricao" varchar NOT NULL, "arquivado" boolean NOT NULL, "criadoEm" datetime NOT NULL, "usuarioId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_lembrete" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "titulo" varchar NOT NULL, "descricao" varchar NOT NULL, "arquivado" boolean NOT NULL, "criadoEm" datetime NOT NULL, "usuarioId" integer, CONSTRAINT "FK_0a9b2caa53b763a28116393add6" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_lembrete"("id", "titulo", "descricao", "arquivado", "criadoEm", "usuarioId") SELECT "id", "titulo", "descricao", "arquivado", "criadoEm", "usuarioId" FROM "lembrete"`);
        await queryRunner.query(`DROP TABLE "lembrete"`);
        await queryRunner.query(`ALTER TABLE "temporary_lembrete" RENAME TO "lembrete"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lembrete" RENAME TO "temporary_lembrete"`);
        await queryRunner.query(`CREATE TABLE "lembrete" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "titulo" varchar NOT NULL, "descricao" varchar NOT NULL, "arquivado" boolean NOT NULL, "criadoEm" datetime NOT NULL, "usuarioId" integer)`);
        await queryRunner.query(`INSERT INTO "lembrete"("id", "titulo", "descricao", "arquivado", "criadoEm", "usuarioId") SELECT "id", "titulo", "descricao", "arquivado", "criadoEm", "usuarioId" FROM "temporary_lembrete"`);
        await queryRunner.query(`DROP TABLE "temporary_lembrete"`);
        await queryRunner.query(`DROP TABLE "lembrete"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
    }

}
