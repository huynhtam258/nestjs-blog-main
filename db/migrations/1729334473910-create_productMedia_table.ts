import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductMediaTable1729334473910 implements MigrationInterface {
    name = 'CreateProductMediaTable1729334473910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_media\` (\`product_id\` int NOT NULL, \`media_id\` int NOT NULL, PRIMARY KEY (\`product_id\`, \`media_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE INDEX \`IDX_e6bb4a69096db4f6a1f5bada15\` ON \`product_media\` (\`product_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_b0895b1d84d747625a54b7fe9c\` ON \`product_media\` (\`media_id\`)`);
        await queryRunner.query(`ALTER TABLE \`product_media\` ADD CONSTRAINT \`FK_e6bb4a69096db4f6a1f5bada151\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_media\` ADD CONSTRAINT \`FK_b0895b1d84d747625a54b7fe9cf\` FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_media\` DROP FOREIGN KEY \`FK_b0895b1d84d747625a54b7fe9cf\``);
        await queryRunner.query(`ALTER TABLE \`product_media\` DROP FOREIGN KEY \`FK_e6bb4a69096db4f6a1f5bada151\``);
        await queryRunner.query(`DROP INDEX \`IDX_b0895b1d84d747625a54b7fe9c\` ON \`product_media\``);
        await queryRunner.query(`DROP INDEX \`IDX_e6bb4a69096db4f6a1f5bada15\` ON \`product_media\``);
        await queryRunner.query(`DROP TABLE \`product_media\``);
    }

}
