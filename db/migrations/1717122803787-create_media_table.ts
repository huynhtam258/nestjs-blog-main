import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMediaTable1717122803787 implements MigrationInterface {
    name = 'CreateMediaTable1717122803787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`media\` (\`id\` int NOT NULL AUTO_INCREMENT, \`media_url\` varchar(255) NOT NULL, \`media_type\` enum ('IMAGE') NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`media\` ADD CONSTRAINT \`FK_0db866835bf356d896e1892635d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_0db866835bf356d896e1892635d\``);
        await queryRunner.query(`DROP TABLE \`media\``);
    }

}
