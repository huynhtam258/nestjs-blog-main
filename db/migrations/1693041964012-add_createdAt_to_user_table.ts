import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToUserTable1693041964012 implements MigrationInterface {
    name = 'AddCreatedAtToUserTable1693041964012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`created_at\``);
    }

}
