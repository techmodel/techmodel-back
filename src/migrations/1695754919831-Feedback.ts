import { MigrationInterface, QueryRunner } from 'typeorm';

export class Feedback1695754919831 implements MigrationInterface {
  name = 'Feedback1695754919831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "feedback" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_59a7946f56cddfd6f80fafda48e" DEFAULT getdate(), "userId" nvarchar(255) NOT NULL, "volunteerRequestId" int NOT NULL, "rating" int NOT NULL, "notes" nvarchar(255) NOT NULL, CONSTRAINT "PK_feedback" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "feedback"`);
  }
}
