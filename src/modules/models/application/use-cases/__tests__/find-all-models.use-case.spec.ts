import { FindAllModelsUseCase } from '../find-all-models.use-case';
import { ModelRepositoryPort } from '../../../domain/ports/model-repository.port';
import { Model } from '../../../domain/entities/model.entity';

const models = [
  new Model('m1', 'Corolla', 'brand-1', 'user-1'),
  new Model('m2', 'Civic', 'brand-1', 'user-1'),
];

const makeRepo = (): jest.Mocked<ModelRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue(models),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(null),
    findByBrandId: jest.fn().mockResolvedValue([]),
  }) as jest.Mocked<ModelRepositoryPort>;

describe('FindAllModelsUseCase', () => {
  let repo: jest.Mocked<ModelRepositoryPort>;
  let useCase: FindAllModelsUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    useCase = new FindAllModelsUseCase(repo, eventPublisher as any);
  });

  it('retorna todos os modelos do repositório', async () => {
    const result = await useCase.execute('user-1');

    expect(result).toBe(models);
    expect(repo.findAll).toHaveBeenCalledTimes(1);
  });
});
