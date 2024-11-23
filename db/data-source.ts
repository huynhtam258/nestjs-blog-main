import { DataSourceOptions, DataSource  } from 'typeorm'
import * as dotenv from 'dotenv';

dotenv.config();
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV || 'development'}` : '.env';

dotenv.config({ path: envFile });

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource