import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateDb1684598200838 implements MigrationInterface {
    name = 'GenerateDb1684598200838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "username" character varying NOT NULL, "senha" character varying NOT NULL, "excluido" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_6ccff37176a6978449a99c82e10" UNIQUE ("username"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lembrete" ("id" SERIAL NOT NULL, "titulo" character varying NOT NULL, "descricao" character varying NOT NULL, "arquivado" boolean NOT NULL, "criadoEm" TIMESTAMP NOT NULL, "usuarioId" integer, CONSTRAINT "PK_23fa84acc924f66f19f26d63d47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lembrete" ADD CONSTRAINT "FK_0a9b2caa53b763a28116393add6" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lembrete" DROP CONSTRAINT "FK_0a9b2caa53b763a28116393add6"`);
        await queryRunner.query(`DROP TABLE "lembrete"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
    }

}
