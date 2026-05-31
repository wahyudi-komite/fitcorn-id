import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSaltColumn20260531000000 implements MigrationInterface {
  name = 'AddSaltColumn20260531000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN salt VARCHAR(64) NULL AFTER password
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN salt
    `);
  }
}
