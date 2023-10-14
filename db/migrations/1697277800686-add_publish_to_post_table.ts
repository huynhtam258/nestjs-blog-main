import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublishToPostTable1697277800686 implements MigrationInterface {
    name = 'AddPublishToPostTable1697277800686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`publish\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`publish\``);
    }

}
