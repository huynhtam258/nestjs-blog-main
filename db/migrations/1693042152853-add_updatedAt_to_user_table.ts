import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdatedAtToUserTable1693042152853 implements MigrationInterface {
    name = 'AddUpdatedAtToUserTable1693042152853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updated_at\``);
    }

}
