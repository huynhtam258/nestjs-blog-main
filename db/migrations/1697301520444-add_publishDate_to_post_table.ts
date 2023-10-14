import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublishDateToPostTable1697301520444 implements MigrationInterface {
    name = 'AddPublishDateToPostTable1697301520444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`publish_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`publish_date\``);
    }

}
