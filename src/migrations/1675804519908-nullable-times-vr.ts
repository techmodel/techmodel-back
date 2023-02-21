import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableTimesVr1675804519908 implements MigrationInterface {
  name = 'nullableTimesVr1675804519908';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "startDate" datetime`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "endDate" datetime`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "startTime" datetime`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "startTime" datetime NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "endDate" datetime NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "startDate" datetime NOT NULL`);
  }
}
