import { FindModelByIdUseCase } from '../find-model-by-id.use-case';
import { ModelRepositoryPort } from '../../../domain/ports/model-repository.port';
import { DomainNotFoundException } from '../../../../../common/exceptions/domain.exception';
import { Model } from '../../../domain/entities/model.entity';

const model = new Model('m1', 'Corolla', 'brand-1', 'user-1');

const makeRepo = (): jest.Mocked<ModelRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(model),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(null),
    findByBrandId: jest.fn().mockResolvedValue([]),
  }) as jest.Mocked<ModelRepositoryPort>;

describe('FindModelByIdUseCase', () => {
  let repo: jest.Mocked<ModelRepositoryPort>;
  let useCase: FindModelByIdUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    useCase = new FindModelByIdUseCase(repo, eventPublisher as any);
  });

  it('retorna o modelo encontrado', async () => {
    const result = await useCase.execute('m1', 'user-1');

    expect(result).toBe(model);
    expect(repo.findById).toHaveBeenCalledWith('m1');
  });

  it('lança DomainNotFoundException quando modelo não existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('nao-existe', 'user-1')).rejects.toThrow(
      new DomainNotFoundException('Modelo não encontrado'),
    );
  });
});
