import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeletedToPostTable1715400156614 implements MigrationInterface {
    name = 'AddIsDeletedToPostTable1715400156614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`is_deleted\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`thumbnail\` \`thumbnail\` varchar(255) NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`thumbnail\` \`thumbnail\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`is_deleted\``);
    }

}
