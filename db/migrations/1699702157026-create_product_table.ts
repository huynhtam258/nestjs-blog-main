import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1699702157026 implements MigrationInterface {
    name = 'CreateProductTable1699702157026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_name\` varchar(255) NOT NULL, \`product_thumb\` varchar(255) NOT NULL, \`product_slug\` varchar(255) NOT NULL, \`product_description\` varchar(255) NOT NULL, \`product_price\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`product\``);
    }

}
