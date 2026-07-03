import { UpdateBrandUseCase } from '../update-brand.use-case';
import { BrandRepositoryPort } from '../../../domain/ports/brand-repository.port';
import {
  DomainConflictException,
  DomainNotFoundException,
} from '../../../../../common/exceptions/domain.exception';
import { Brand } from '../../../domain/entities/brand.entity';

const existing = new Brand('b1', 'Toyota', 'user-1');
const otherBrand = new Brand('b2', 'Honda', 'user-1');

const makeRepo = (): jest.Mocked<BrandRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(existing),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(null),
  }) as jest.Mocked<BrandRepositoryPort>;

describe('UpdateBrandUseCase', () => {
  let repo: jest.Mocked<BrandRepositoryPort>;
  let useCase: UpdateBrandUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    useCase = new UpdateBrandUseCase(repo, eventPublisher as any);
  });

  it('atualiza marca com dados válidos', async () => {
    await useCase.execute('b1', { name: 'Toyota Novo' });

    expect(repo.update).toHaveBeenCalledTimes(1);
  });

  it('lança DomainNotFoundException quando marca não existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('nao-existe', { name: 'X' })).rejects.toThrow(
      new DomainNotFoundException('Marca não encontrada'),
    );
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('lança DomainConflictException quando novo nome pertence a outra marca', async () => {
    repo.findByName.mockResolvedValue(otherBrand);

    await expect(useCase.execute('b1', { name: 'Honda' })).rejects.toThrow(
      new DomainConflictException('Marca já existe'),
    );
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('não lança conflito quando o nome novo é o mesmo da própria marca', async () => {
    repo.findByName.mockResolvedValue(existing);

    await expect(
      useCase.execute('b1', { name: 'Toyota' }),
    ).resolves.toBeUndefined();
    expect(repo.update).toHaveBeenCalledTimes(1);
  });
});
