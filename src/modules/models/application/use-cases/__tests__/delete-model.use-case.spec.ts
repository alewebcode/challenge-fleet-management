import { DeleteModelUseCase } from '../delete-model.use-case';
import { ModelRepositoryPort } from '../../../domain/ports/model-repository.port';
import { DomainNotFoundException } from '../../../../../common/exceptions/domain.exception';
import { Model } from '../../../domain/entities/model.entity';

const existing = new Model('m1', 'Corolla', 'brand-1', 'user-1');

const makeRepo = (): jest.Mocked<ModelRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(existing),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(null),
    findByBrandId: jest.fn().mockResolvedValue([]),
  }) as jest.Mocked<ModelRepositoryPort>;

describe('DeleteModelUseCase', () => {
  let repo: jest.Mocked<ModelRepositoryPort>;
  let useCase: DeleteModelUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };
  let vehicleRepository = { findByModelId: jest.fn().mockResolvedValue([]) };

  beforeEach(() => {
    repo = makeRepo();
    useCase = new DeleteModelUseCase(
      repo,
      eventPublisher as any,
      vehicleRepository as any,
    );
  });

  it('deleta modelo existente', async () => {
    await useCase.execute('m1', 'user-1');

    expect(repo.delete).toHaveBeenCalledWith('m1');
  });

  it('lança DomainNotFoundException quando modelo não existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('nao-existe', 'user-1')).rejects.toThrow(
      new DomainNotFoundException('Modelo não encontrado'),
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
