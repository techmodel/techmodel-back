import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProgramToInstitution1669645487791 implements MigrationInterface {
  name = 'programToInstitution1669645487791';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "program_to_institution" ("id" int NOT NULL IDENTITY(1,1), "institutionId" int NOT NULL, "programId" int NOT NULL, CONSTRAINT "PK_program_to_institution" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_program_to_institution_UQ_institutionid_programid" ON "program_to_institution" ("institutionId", "programId") `
    );
    await queryRunner.query(
      `ALTER TABLE "program_to_institution" ADD CONSTRAINT "FK_program_to_institution_institution_id" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "program_to_institution" ADD CONSTRAINT "FK_program_to_institution_program_id" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "program_to_institution" DROP CONSTRAINT "FK_program_to_institution_program_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "program_to_institution" DROP CONSTRAINT "FK_program_to_institution_institution_id"`
    );
    await queryRunner.query(
      `DROP INDEX "IDX_program_to_institution_UQ_institutionid_programid" ON "program_to_institution"`
    );
    await queryRunner.query(`DROP TABLE "program_to_institution"`);
  }
}
