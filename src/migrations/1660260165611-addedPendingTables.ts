import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPendingTables1660260165611 implements MigrationInterface {
  name = 'addedPendingTables1660260165611';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pending_program_coordinator" ("id" int NOT NULL IDENTITY(1,1), "userId" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_e5d9415ea4078f0bed1b553e17b" DEFAULT getdate(), "programId" int NOT NULL, "institutionId" int NOT NULL, CONSTRAINT "PK_pending_program_coordinator" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_0746b2924726f336a50e4ba081" ON "pending_program_coordinator" ("userId") WHERE "userId" IS NOT NULL`
    );
    await queryRunner.query(
      `CREATE TABLE "pending_program_manager" ("id" int NOT NULL IDENTITY(1,1), "userId" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_6a67ce5b549a43eacbb8258c2af" DEFAULT getdate(), "programId" int NOT NULL, CONSTRAINT "PK_pending_program_manager" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_d272a699c096b54683fa5981d7" ON "pending_program_manager" ("userId") WHERE "userId" IS NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_coordinator" ADD CONSTRAINT "FK_pending_program_coordinator_program_id" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_coordinator" ADD CONSTRAINT "FK_pending_program_coordinator_institution_id" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_coordinator" ADD CONSTRAINT "FK_pending_program_coordinator_user_id" FOREIGN KEY ("userId") REFERENCES "users"("PK_users") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_manager" ADD CONSTRAINT "FK_pending_program_manager_program_id" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_manager" ADD CONSTRAINT "FK_pending_program_manager_user_id" FOREIGN KEY ("userId") REFERENCES "users"("PK_users") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pending_program_manager" DROP CONSTRAINT "FK_pending_program_manager_user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_manager" DROP CONSTRAINT "FK_pending_program_manager_program_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_coordinator" DROP CONSTRAINT "FK_pending_program_coordinator_user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_coordinator" DROP CONSTRAINT "FK_pending_program_coordinator_institution_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_coordinator" DROP CONSTRAINT "FK_pending_program_coordinator_program_id"`
    );
    await queryRunner.query(`DROP INDEX "REL_d272a699c096b54683fa5981d7" ON "pending_program_manager"`);
    await queryRunner.query(`DROP TABLE "pending_program_manager"`);
    await queryRunner.query(`DROP INDEX "REL_0746b2924726f336a50e4ba081" ON "pending_program_coordinator"`);
    await queryRunner.query(`DROP TABLE "pending_program_coordinator"`);
  }
}
