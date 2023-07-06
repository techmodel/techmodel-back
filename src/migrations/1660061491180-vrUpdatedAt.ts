import { MigrationInterface, QueryRunner } from 'typeorm';

export class VrUpdatedAt1660061491180 implements MigrationInterface {
  name = 'vrUpdatedAt1660061491180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "volunteer_request" ADD "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_42ac599a1b2896d4eedd6908062" DEFAULT getdate()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP CONSTRAINT "DF_42ac599a1b2896d4eedd6908062"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "updatedAt"`);
  }
}
