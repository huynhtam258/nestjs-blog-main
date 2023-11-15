import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDraftIsPublishProductQuantityToProductTable1700002247183 implements MigrationInterface {
    name = 'AddIsDraftIsPublishProductQuantityToProductTable1700002247183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`product_quantity\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`isDraft\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`isPublish\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`CREATE INDEX \`IDX_7811e12c49f7ec41bd018c8bb0\` ON \`product\` (\`isDraft\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_3f5d20ebcfb19f1da66a16310a\` ON \`product\` (\`isPublish\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3f5d20ebcfb19f1da66a16310a\` ON \`product\``);
        await queryRunner.query(`DROP INDEX \`IDX_7811e12c49f7ec41bd018c8bb0\` ON \`product\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`isPublish\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`isDraft\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`product_quantity\``);
    }

}
