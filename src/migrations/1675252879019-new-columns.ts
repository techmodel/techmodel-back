import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewColumns1675252879019 implements MigrationInterface {
  name = 'newColumns1675252879019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" ADD "companyUrl" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "meetingUrl" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "genericUrl" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ADD "dateFlexible" bit`);
    await queryRunner.query(`ALTER TABLE "program" ADD "programUrl" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "durationTimeAmount" int`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "durationTimeUnit" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "frequencyTimeAmount" int`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "frequencyTimeUnit" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "institution" ALTER COLUMN "populationType" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "institution" ALTER COLUMN "institutionType" varchar(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "institution" ALTER COLUMN "institutionType" varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "institution" ALTER COLUMN "populationType" varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "frequencyTimeUnit" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "frequencyTimeAmount" int NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "durationTimeUnit" nvarchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" ALTER COLUMN "durationTimeAmount" int NOT NULL`);
    await queryRunner.query(`ALTER TABLE "program" DROP COLUMN "programUrl"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "dateFlexible"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "genericUrl"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP COLUMN "meetingUrl"`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "companyUrl"`);
  }
}
