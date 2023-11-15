import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductTypeToProductTable1699862024742 implements MigrationInterface {
    name = 'AddProductTypeToProductTable1699862024742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`product_type\` enum ('Electronics', 'Clothing', 'Furniture') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`product_type\``);
    }

}
