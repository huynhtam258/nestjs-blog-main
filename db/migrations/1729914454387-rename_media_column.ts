import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameMediaColumn1729914454387 implements MigrationInterface {
    name = 'RenameMediaColumn1729914454387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasMediasColumn = await queryRunner.hasColumn("product_media", "medias");
        if (hasMediasColumn) {
            await queryRunner.query(`ALTER TABLE product_media DROP COLUMN medias;`);
        }

        const hasMediaIdColumn = await queryRunner.hasColumn("product_media", "media_id");
        if (!hasMediaIdColumn) {
            await queryRunner.query(`ALTER TABLE product_media ADD media_id INT;`);
        }

        await queryRunner.query(`ALTER TABLE product_media ADD CONSTRAINT FK_media FOREIGN KEY (media_id) REFERENCES media(id);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasMediaIdColumn = await queryRunner.hasColumn("product_media", "media_id");
        if (hasMediaIdColumn) {
            await queryRunner.query(`ALTER TABLE product_media DROP COLUMN media_id;`);
        }

        const hasMediasColumn = await queryRunner.hasColumn("product_media", "medias");
        if (!hasMediasColumn) {
            await queryRunner.query(`ALTER TABLE product_media ADD medias INT;`);
        }

        await queryRunner.query(`ALTER TABLE product_media ADD CONSTRAINT FK_medias FOREIGN KEY (medias) REFERENCES media(id);`);
    }

}
