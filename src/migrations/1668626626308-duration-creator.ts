import { MigrationInterface, QueryRunner } from 'typeorm';

export class DurationCreator1668626626308 implements MigrationInterface {
  name = 'durationCreator1668626626308';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "duration"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "durationTimeAmount" int NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "durationTimeUnit" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "frequencyTimeAmount" int NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "frequencyTimeUnit" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "creatorId" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "audience"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "audience" nvarchar(255) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "volunteer_request" ADD CONSTRAINT "FK_volunteer_request_creator_id" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP CONSTRAINT "FK_volunteer_request_creator_id"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "audience"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "audience" int NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "creatorId"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "frequencyTimeUnit"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "frequencyTimeAmount"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "durationTimeUnit"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "durationTimeAmount"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "duration" nvarchar(255) NOT NULL`);
  }
}
