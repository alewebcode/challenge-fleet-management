import { FindAllBrandsUseCase } from '../find-all-brands.use-case';
import { BrandRepositoryPort } from '../../../domain/ports/brand-repository.port';
import { Brand } from '../../../domain/entities/brand.entity';

const brands = [
  new Brand('b1', 'Toyota', 'user-1'),
  new Brand('b2', 'Honda', 'user-1'),
];

const makeRepo = (): jest.Mocked<BrandRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue(brands),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(null),
  }) as jest.Mocked<BrandRepositoryPort>;

describe('FindAllBrandsUseCase', () => {
  let repo: jest.Mocked<BrandRepositoryPort>;
  let useCase: FindAllBrandsUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    useCase = new FindAllBrandsUseCase(repo, eventPublisher as any);
  });

  it('retorna todas as marcas do repositório', async () => {
    const result = await useCase.execute('user-1');

    expect(result).toBe(brands);
    expect(repo.findAll).toHaveBeenCalledTimes(1);
  });
});
