import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUserTable1693040257246 implements MigrationInterface {
    name = 'AddRefreshTokenToUserTable1693040257246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``);
    }

}
