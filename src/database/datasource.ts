import * as dotenv from 'dotenv';
import { Course } from 'src/course/entities/course.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { DataSource } from 'typeorm';

dotenv.config();

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isLocalDb = process.env.NODE_DB === 'local';

const dataSource = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  entities: [Course, Lesson],
  // entities: [process.env.DB_ENTITIES],
  migrations: [process.env.DB_MIGRATIONS],
  synchronize: isDevelopment,
  migrationsTableName: 'migrations',
  ssl: isLocalDb
    ? false
    : {
        rejectUnauthorized: true,
      },
});
export async function initializeDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}

export default dataSource;
