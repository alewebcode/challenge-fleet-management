import { FindBrandByIdUseCase } from '../find-brand-by-id.use-case';
import { BrandRepositoryPort } from '../../../domain/ports/brand-repository.port';
import { DomainNotFoundException } from '../../../../../common/exceptions/domain.exception';
import { Brand } from '../../../domain/entities/brand.entity';

const brand = new Brand('b1', 'Toyota', 'user-1');

const makeRepo = (): jest.Mocked<BrandRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(brand),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(null),
  }) as jest.Mocked<BrandRepositoryPort>;

describe('FindBrandByIdUseCase', () => {
  let repo: jest.Mocked<BrandRepositoryPort>;
  let useCase: FindBrandByIdUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    useCase = new FindBrandByIdUseCase(repo, eventPublisher as any);
  });

  it('retorna a marca encontrada', async () => {
    const result = await useCase.execute('b1', 'user-1');

    expect(result).toBe(brand);
    expect(repo.findById).toHaveBeenCalledWith('b1');
  });

  it('lança DomainNotFoundException quando marca não existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('nao-existe', 'user-1')).rejects.toThrow(
      new DomainNotFoundException('Marca não encontrada'),
    );
  });
});
