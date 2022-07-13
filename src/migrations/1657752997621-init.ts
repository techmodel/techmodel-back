import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1657752997621 implements MigrationInterface {
  name = 'init1657752997621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "location" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "program" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, CONSTRAINT "UQ_2156fc4598c9a1b865d85b5f1ec" UNIQUE ("name"), CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "skill" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "type" nvarchar(255) NOT NULL, CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1bffacfa050206d150c4d213af" ON "skill" ("name", "type") `);
    await queryRunner.query(
      `CREATE TABLE "skill_to_volunteer_request" ("id" int NOT NULL IDENTITY(1,1), "skillId" int NOT NULL, "volunteerRequestId" int NOT NULL, CONSTRAINT "PK_59c371e53cc78390bbeb6baae05" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7d26b3523dd304ce9bd0eb310f" ON "skill_to_volunteer_request" ("skillId", "volunteerRequestId") `
    );
    await queryRunner.query(
      `CREATE TABLE "volunteer_request_to_volunteer" ("id" int NOT NULL IDENTITY(1,1), "volunteerId" nvarchar(255) NOT NULL, "volunteerRequestId" int NOT NULL, CONSTRAINT "PK_0a9fd8839cd55ed76ba2d2b313a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f5e68264a4c1c0e463e8086ae6" ON "volunteer_request_to_volunteer" ("volunteerId", "volunteerRequestId") `
    );
    await queryRunner.query(
      `CREATE TABLE "volunteer_request" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_c94f4850d7481b4a81777bbd16c" DEFAULT getdate(), "name" nvarchar(255) NOT NULL, "audience" int NOT NULL, "isPhysical" bit NOT NULL, "description" nvarchar(255) NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, "duration" nvarchar(255) NOT NULL, "startTime" datetime NOT NULL, "totalVolunteers" int NOT NULL, "currentVolunteers" int, "status" varchar(255) NOT NULL, "creatorId" nvarchar(255), "language" varchar(255) NOT NULL, CONSTRAINT "PK_af22f220170550099e4c0f6b3b7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_204e9b624861ff4a5b268192101" DEFAULT getdate(), "email" nvarchar(255) NOT NULL, "phone" nvarchar(255) NOT NULL, "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "userType" varchar(255) NOT NULL, "institutionId" int, "programId" int, "companyId" int, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "institution" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_bddda33015bc18a5afb81fd2e03" DEFAULT getdate(), "name" nvarchar(255) NOT NULL, "address" nvarchar(255) NOT NULL, "locationId" int NOT NULL, "cityId" int NOT NULL, "populationType" varchar(255) NOT NULL, "institutionType" varchar(255) NOT NULL, CONSTRAINT "PK_f60ee4ff0719b7df54830b39087" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf" UNIQUE ("name"), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_volunteer_request" ADD CONSTRAINT "FK_5fe9b9ad48ac86cac23234cbc44" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_volunteer_request" ADD CONSTRAINT "FK_5b12393961cca65c4450b018bf1" FOREIGN KEY ("volunteerRequestId") REFERENCES "volunteer_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request_to_volunteer" ADD CONSTRAINT "FK_7d80823b032a033b6f76f578e8c" FOREIGN KEY ("volunteerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request_to_volunteer" ADD CONSTRAINT "FK_aed91d780da3d53bbd008812d1e" FOREIGN KEY ("volunteerRequestId") REFERENCES "volunteer_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request" ADD CONSTRAINT "FK_9534acaf8cf7778da8bf33da7c6" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_412354ee74d15b76137f5dba3e3" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_edaf44538bef67012ac990c5ac4" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_6f9395c9037632a31107c8a9e58" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "institution" ADD CONSTRAINT "FK_ae37cd1f348618953ef4c6d2499" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "institution" ADD CONSTRAINT "FK_e5a41c16e4f91031eead1c9ce02" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "institution" DROP CONSTRAINT "FK_e5a41c16e4f91031eead1c9ce02"`);
    await queryRunner.query(`ALTER TABLE "institution" DROP CONSTRAINT "FK_ae37cd1f348618953ef4c6d2499"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6f9395c9037632a31107c8a9e58"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_edaf44538bef67012ac990c5ac4"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_412354ee74d15b76137f5dba3e3"`);
    await queryRunner.query(`ALTER TABLE "volunteer_request" DROP CONSTRAINT "FK_9534acaf8cf7778da8bf33da7c6"`);
    await queryRunner.query(
      `ALTER TABLE "volunteer_request_to_volunteer" DROP CONSTRAINT "FK_aed91d780da3d53bbd008812d1e"`
    );
    await queryRunner.query(
      `ALTER TABLE "volunteer_request_to_volunteer" DROP CONSTRAINT "FK_7d80823b032a033b6f76f578e8c"`
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_volunteer_request" DROP CONSTRAINT "FK_5b12393961cca65c4450b018bf1"`
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_volunteer_request" DROP CONSTRAINT "FK_5fe9b9ad48ac86cac23234cbc44"`
    );
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "institution"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "volunteer_request"`);
    await queryRunner.query(`DROP INDEX "IDX_f5e68264a4c1c0e463e8086ae6" ON "volunteer_request_to_volunteer"`);
    await queryRunner.query(`DROP TABLE "volunteer_request_to_volunteer"`);
    await queryRunner.query(`DROP INDEX "IDX_7d26b3523dd304ce9bd0eb310f" ON "skill_to_volunteer_request"`);
    await queryRunner.query(`DROP TABLE "skill_to_volunteer_request"`);
    await queryRunner.query(`DROP INDEX "IDX_1bffacfa050206d150c4d213af" ON "skill"`);
    await queryRunner.query(`DROP TABLE "skill"`);
    await queryRunner.query(`DROP TABLE "program"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "location"`);
  }
}
