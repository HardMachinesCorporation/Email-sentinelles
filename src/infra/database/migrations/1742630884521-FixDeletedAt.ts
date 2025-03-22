import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FixDeletedAt1742639999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'Client',
      'deletedAt',
      new TableColumn({
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: true, // ✅ Rend bien nullable
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'Client',
      'deletedAt',
      new TableColumn({
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: false, // ❌ Revert en non-nullable
      }),
    );
  }
}
