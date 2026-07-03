import { CreateBrandUseCase } from '../create-brand.use-case';
import { BrandRepositoryPort } from '../../../domain/ports/brand-repository.port';
import { DomainConflictException } from '../../../../../common/exceptions/domain.exception';
import { Brand } from '../../../domain/entities/brand.entity';

const existing = new Brand('b1', 'Toyota', 'user-1');

const makeRepo = (): jest.Mocked<BrandRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(null),
  }) as jest.Mocked<BrandRepositoryPort>;

describe('CreateBrandUseCase', () => {
  let repo: jest.Mocked<BrandRepositoryPort>;
  let useCase: CreateBrandUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CreateBrandUseCase(repo, eventPublisher as any);
  });

  it('cria marca com dados válidos', async () => {
    await useCase.execute({ name: 'Honda' }, 'user-1');

    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it('lança DomainConflictException se marca já existe', async () => {
    repo.findByName.mockResolvedValue(existing);

    await expect(useCase.execute({ name: 'Toyota' }, 'user-1')).rejects.toThrow(
      new DomainConflictException('Marca já existe'),
    );
    expect(repo.create).not.toHaveBeenCalled();
  });
});
