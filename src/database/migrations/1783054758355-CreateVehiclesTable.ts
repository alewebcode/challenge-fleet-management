import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVehiclesTable1783054758355 implements MigrationInterface {
  name = 'CreateVehiclesTable1783054758355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vehicles" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_18d8646b59304dce4af3a9e35b6" DEFAULT NEWSEQUENTIALID(), "license_plate" nvarchar(20) NOT NULL, "chassis" nvarchar(17) NOT NULL, "renavam" nvarchar(11) NOT NULL, "year" int NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_5f657f45753e2ab552e6cf09c3e" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_894cae7674f3b507d73a585575c" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, "model_id" uniqueidentifier NOT NULL, CONSTRAINT "UQ_7e9fab2e8625b63613f67bd706c" UNIQUE ("license_plate"), CONSTRAINT "UQ_7c6681b16862bd33fcf11984445" UNIQUE ("chassis"), CONSTRAINT "UQ_f20513b1dd64f0b2da6f91ef540" UNIQUE ("renavam"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "vehicles"`);
  }
}
