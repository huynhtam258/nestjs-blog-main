import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKeyToUser1693630039810 implements MigrationInterface {
    name = 'AddKeyToUser1693630039810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`key\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`key\``);
    }

}
