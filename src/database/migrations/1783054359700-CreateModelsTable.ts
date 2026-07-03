import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModelsTable1783054359700 implements MigrationInterface {
  name = 'CreateModelsTable1783054359700';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "models" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_ef9ed7160ea69013636466bf2d5" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_2fa3da3e3ed8f1379f8e29ebf49" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_04615a558292d5f284fa7e73bfb" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, "brand_id" uniqueidentifier, CONSTRAINT "PK_ef9ed7160ea69013636466bf2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "models" ADD CONSTRAINT "FK_f2b1673c6665816ff753e81d1a0" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "models" DROP CONSTRAINT "FK_f2b1673c6665816ff753e81d1a0"`,
    );
    await queryRunner.query(`DROP TABLE "models"`);
  }
}
