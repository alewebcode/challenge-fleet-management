import { CreateModelUseCase } from '../create-model.use-case';
import { ModelRepositoryPort } from '../../../domain/ports/model-repository.port';
import { DomainConflictException } from '../../../../../common/exceptions/domain.exception';
import { Model } from '../../../domain/entities/model.entity';

const existing = new Model('m1', 'Corolla', 'brand-1', 'user-1');

const makeRepo = (): jest.Mocked<ModelRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(null),
    findByBrandId: jest.fn().mockResolvedValue([]),
  }) as jest.Mocked<ModelRepositoryPort>;

describe('CreateModelUseCase', () => {
  let repo: jest.Mocked<ModelRepositoryPort>;
  let useCase: CreateModelUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };
  beforeEach(() => {
    repo = makeRepo();
    useCase = new CreateModelUseCase(repo, eventPublisher as any);
  });

  it('cria modelo com dados válidos sem brandId', async () => {
    await useCase.execute({ name: 'Civic' }, 'user-1');

    expect(repo.create).toHaveBeenCalledTimes(1);
    const created: Model = repo.create.mock.calls[0][0];
    expect(created.brandId).toBeNull();
  });

  it('cria modelo com brandId informado', async () => {
    await useCase.execute({ name: 'Civic', brandId: 'brand-1' }, 'user-1');

    expect(repo.create).toHaveBeenCalledTimes(1);
    const created: Model = repo.create.mock.calls[0][0];
    expect(created.brandId).toBe('brand-1');
  });

  it('lança DomainConflictException se modelo já existe', async () => {
    repo.findByName.mockResolvedValue(existing);

    await expect(
      useCase.execute({ name: 'Corolla' }, 'user-1'),
    ).rejects.toThrow(new DomainConflictException('Modelo já existe'));
    expect(repo.create).not.toHaveBeenCalled();
  });
});
