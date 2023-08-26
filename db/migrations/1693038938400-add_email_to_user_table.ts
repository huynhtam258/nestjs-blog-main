import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToUserTable1693038938400 implements MigrationInterface {
    name = 'AddEmailToUserTable1693038938400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }

}
