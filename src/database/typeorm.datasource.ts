import { databaseConfig } from './database.config';
import { DataSource } from 'typeorm';

export default new DataSource({
  ...databaseConfig,
  entities: ['src/**/*.orm-entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
