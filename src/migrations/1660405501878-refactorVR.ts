import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorVR1660405501878 implements MigrationInterface {
  name = 'refactorVR1660405501878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP CONSTRAINT "FK_volunteer_request_creator_id"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "creatorId"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "institutionId" int NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "programId" int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "volunteer_request" ADD CONSTRAINT "FK_volunteer_request_institution_id" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request" ADD CONSTRAINT "FK_volunteer_request_program_id" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP CONSTRAINT "FK_volunteer_request_program_id"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP CONSTRAINT "FK_volunteer_request_institution_id"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "programId"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "institutionId"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "creatorId" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "volunteer_request" ADD CONSTRAINT "FK_volunteer_request_creator_id" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
