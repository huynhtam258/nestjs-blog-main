import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCartStatusToCartTable1700665235501 implements MigrationInterface {
    name = 'AddCartStatusToCartTable1700665235501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`cart_status\` enum ('INCART', 'PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`cart_status\``);
    }

}
