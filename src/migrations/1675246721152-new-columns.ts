import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewColumns1675246721152 implements MigrationInterface {
  name = 'newColumns1675246721152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" ADD "url" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "meetingUrl" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "genericUrl" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "dateFlexible" bit NOT NULL`);
    await queryRunner.query(`ALTER TABLE "program" ADD "url" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "institution" ALTER COLUMN "populationType" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "institution" ALTER COLUMN "institutionType" varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "institution" ALTER COLUMN "institutionType" varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "institution" ALTER COLUMN "populationType" varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "program" DROP COLUMN "url"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "dateFlexible"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "genericUrl"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "meetingUrl"`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "url"`);
  }
}
