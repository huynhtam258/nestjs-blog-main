import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarToUserTable1693123707188 implements MigrationInterface {
    name = 'AddAvatarToUserTable1693123707188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
