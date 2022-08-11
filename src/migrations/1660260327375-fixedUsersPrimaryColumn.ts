import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixedUsersPrimaryColumn1660260327375 implements MigrationInterface {
  name = 'fixedUsersPrimaryColumn1660260327375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`EXEC sp_rename "master.dbo.users.PK_users", "id"`);
    await queryRunner.query(`EXEC sp_rename "master.dbo.users.PK_0a21a5d1be8adf5ed4cbb40ec84", "PK_users"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`EXEC sp_rename "master.dbo.users.PK_users", "PK_0a21a5d1be8adf5ed4cbb40ec84"`);
    await queryRunner.query(`EXEC sp_rename "master.dbo.users.id", "PK_users"`);
  }
}
