import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageIdToMedia1728401893494 implements MigrationInterface {
    name = 'AddImageIdToMedia1728401893494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` ADD \`image_id\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`image_id\``);
    }

}
