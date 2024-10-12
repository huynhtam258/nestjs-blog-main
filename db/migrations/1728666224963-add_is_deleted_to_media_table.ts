import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeletedToMediaTable1728666224963 implements MigrationInterface {
    name = 'AddIsDeletedToMediaTable1728666224963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` ADD \`is_deleted\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`is_deleted\``);
    }

}
