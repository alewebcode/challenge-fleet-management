import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBrandsTable1783053752128 implements MigrationInterface {
    name = 'CreateBrandsTable1783053752128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "brands" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_b0c437120b624da1034a81fc561" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_1f247307b5b1a85dd981ec8ffc8" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_367e19a7371f10544739c56d1a3" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "brands"`);
    }

}
