import { MigrationInterface, QueryRunner } from 'typeorm';

export class SupportUserDeletion1676233341101 implements MigrationInterface {
  name = 'supportUserDeletion1676233341101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "volunteer_request_to_volunteer" DROP CONSTRAINT "FK_volunteer_request_to_volunteer_volunteer_id"`
    );
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP CONSTRAINT "FK_volunteer_request_creator_id"`);
    await queryRunner.query(
      `ALTER TABLE "pending_program_coordinator" DROP CONSTRAINT "FK_pending_program_coordinator_user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_manager" DROP CONSTRAINT "FK_pending_program_manager_user_id"`
    );
    await queryRunner.query(`DROP INDEX "REL_0746b2924726f336a50e4ba081" ON "pending_program_coordinator"`);
    await queryRunner.query(`DROP INDEX "REL_d272a699c096b54683fa5981d7" ON "pending_program_manager"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "oldId" nvarchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "oldId"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_d272a699c096b54683fa5981d7" ON "pending_program_manager" ("userId") WHERE ([userId] IS NOT NULL)`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_0746b2924726f336a50e4ba081" ON "pending_program_coordinator" ("userId") WHERE ([userId] IS NOT NULL)`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_manager" ADD CONSTRAINT "FK_pending_program_manager_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_program_coordinator" ADD CONSTRAINT "FK_pending_program_coordinator_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request" ADD CONSTRAINT "FK_volunteer_request_creator_id" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request_to_volunteer" ADD CONSTRAINT "FK_volunteer_request_to_volunteer_volunteer_id" FOREIGN KEY ("volunteerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
