import { DeleteBrandUseCase } from '../delete-brand.use-case';
import { BrandRepositoryPort } from '../../../domain/ports/brand-repository.port';
import { DomainNotFoundException } from '../../../../../common/exceptions/domain.exception';
import { Brand } from '../../../domain/entities/brand.entity';

const existing = new Brand('b1', 'Toyota', 'user-1');

const makeRepo = (): jest.Mocked<BrandRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(existing),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(null),
  }) as jest.Mocked<BrandRepositoryPort>;

describe('DeleteBrandUseCase', () => {
  let repo: jest.Mocked<BrandRepositoryPort>;
  let useCase: DeleteBrandUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };
  let modelRepository = { findByBrandId: jest.fn().mockResolvedValue([]) };

  beforeEach(() => {
    repo = makeRepo();
    useCase = new DeleteBrandUseCase(
      repo,
      eventPublisher as any,
      modelRepository as any,
    );
  });

  it('deleta marca existente', async () => {
    await useCase.execute('b1', 'user-1');

    expect(repo.delete).toHaveBeenCalledWith('b1');
  });

  it('lança DomainNotFoundException quando marca não existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('nao-existe', 'user-1')).rejects.toThrow(
      new DomainNotFoundException('Marca não encontrada'),
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
