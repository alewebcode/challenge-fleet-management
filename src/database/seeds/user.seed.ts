import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../database.config';
import { UserOrmEntity } from '../../modules/users/adapters/typeorm/entities/user.orm-entity';

async function seed() {
  const dataSource = new DataSource({
    ...databaseConfig,
    entities: [UserOrmEntity],
  });

  await dataSource.initialize();

  const repo = dataSource.getRepository(UserOrmEntity);
  const hash = await bcrypt.hash('aivacol@123', 10);

  await repo.save(
    repo.create({
      name: 'Admin',
      nickname: 'aivacol',
      email: 'aivacol@admin.com',
      password: hash,
    }),
  );

  console.log('Usuário padrão criado com sucesso.');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Erro ao executar seed:', err);
  process.exit(1);
});
