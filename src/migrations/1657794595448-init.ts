import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1657794595448 implements MigrationInterface {
  name = 'init1657794595448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "location" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_location" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, CONSTRAINT "PK_company" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "program" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, CONSTRAINT "UQ_2156fc4598c9a1b865d85b5f1ec" UNIQUE ("name"), CONSTRAINT "PK_program" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "skill" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "type" nvarchar(255) NOT NULL, CONSTRAINT "PK_skill" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_skill_UQ_name_type" ON "skill" ("name", "type") `);
    await queryRunner.query(
      `CREATE TABLE "skill_to_volunteer_request" ("id" int NOT NULL IDENTITY(1,1), "skillId" int NOT NULL, "volunteerRequestId" int NOT NULL, CONSTRAINT "PK_skill_to_volunteer_request" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_skill_to_volunteer_request_UQ_skillid_volunteerrequestid" ON "skill_to_volunteer_request" ("skillId", "volunteerRequestId") `
    );
    await queryRunner.query(
      `CREATE TABLE "volunteer_request_to_volunteer" ("id" int NOT NULL IDENTITY(1,1), "volunteerId" nvarchar(255) NOT NULL, "volunteerRequestId" int NOT NULL, CONSTRAINT "PK_volunteer_request_to_volunteer" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_volunteer_request_to_volunteer_UQ_volunteerid_volunteerrequestid" ON "volunteer_request_to_volunteer" ("volunteerId", "volunteerRequestId") `
    );
    await queryRunner.query(
      `CREATE TABLE "volunteer_request" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_c94f4850d7481b4a81777bbd16c" DEFAULT getdate(), "name" nvarchar(255) NOT NULL, "audience" int NOT NULL, "isPhysical" bit NOT NULL, "description" nvarchar(255) NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, "duration" nvarchar(255) NOT NULL, "startTime" datetime NOT NULL, "totalVolunteers" int NOT NULL, "currentVolunteers" int, "status" varchar(255) NOT NULL, "creatorId" nvarchar(255), "language" varchar(255) NOT NULL, CONSTRAINT "PK_volunteer_request" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("PK_users" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_204e9b624861ff4a5b268192101" DEFAULT getdate(), "email" nvarchar(255) NOT NULL, "phone" nvarchar(255) NOT NULL, "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "userType" varchar(255) NOT NULL, "institutionId" int, "programId" int, "companyId" int, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_0a21a5d1be8adf5ed4cbb40ec84" PRIMARY KEY ("PK_users"))`
    );
    await queryRunner.query(
      `CREATE TABLE "institution" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_bddda33015bc18a5afb81fd2e03" DEFAULT getdate(), "name" nvarchar(255) NOT NULL, "address" nvarchar(255) NOT NULL, "locationId" int NOT NULL, "cityId" int NOT NULL, "populationType" varchar(255) NOT NULL, "institutionType" varchar(255) NOT NULL, CONSTRAINT "PK_institution" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf" UNIQUE ("name"), CONSTRAINT "PK_city" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_volunteer_request" ADD CONSTRAINT "FK_skill_to_volunteer_request_skill_id" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_volunteer_request" ADD CONSTRAINT "FK_skill_to_volunteer_request_volunteer_request_id" FOREIGN KEY ("volunteerRequestId") REFERENCES "volunteer_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request_to_volunteer" ADD CONSTRAINT "FK_volunteer_request_to_volunteer_volunteer_id" FOREIGN KEY ("volunteerId") REFERENCES "users"("PK_users") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request_to_volunteer" ADD CONSTRAINT "FK_volunteer_request_to_volunteer_volunteer_request_id" FOREIGN KEY ("volunteerRequestId") REFERENCES "volunteer_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request" ADD CONSTRAINT "FK_volunteer_request_creator_id" FOREIGN KEY ("creatorId") REFERENCES "users"("PK_users") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_institution_id" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_program_id" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_company_id" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "institution" ADD CONSTRAINT "FK_institution_location_id" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "institution" ADD CONSTRAINT "FK_institution_city_id" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "institution" DROP CONSTRAINT "FK_institution_city_id"`);
    await queryRunner.query(`ALTER TABLE "institution" DROP CONSTRAINT "FK_institution_location_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_company_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_program_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_institution_id"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP CONSTRAINT "FK_volunteer_request_creator_id"`);
    await queryRunner.query(
      `ALTER TABLE "volunteer_request_to_volunteer" DROP CONSTRAINT "FK_volunteer_request_to_volunteer_volunteer_request_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request_to_volunteer" DROP CONSTRAINT "FK_volunteer_request_to_volunteer_volunteer_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_volunteer_request" DROP CONSTRAINT "FK_skill_to_volunteer_request_volunteer_request_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_volunteer_request" DROP CONSTRAINT "FK_skill_to_volunteer_request_skill_id"`
    );
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "institution"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "volunteer_request"`);
    await queryRunner.query(
      `DROP INDEX "IDX_volunteer_request_to_volunteer_UQ_volunteerid_volunteerrequestid" ON "volunteer_request_to_volunteer"`
    );
    await queryRunner.query(`DROP TABLE "volunteer_request_to_volunteer"`);
    await queryRunner.query(
      `DROP INDEX "IDX_skill_to_volunteer_request_UQ_skillid_volunteerrequestid" ON "skill_to_volunteer_request"`
    );
    await queryRunner.query(`DROP TABLE "skill_to_volunteer_request"`);
    await queryRunner.query(`DROP INDEX "IDX_skill_UQ_name_type" ON "skill"`);
    await queryRunner.query(`DROP TABLE "skill"`);
    await queryRunner.query(`DROP TABLE "program"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "location"`);
  }
}
