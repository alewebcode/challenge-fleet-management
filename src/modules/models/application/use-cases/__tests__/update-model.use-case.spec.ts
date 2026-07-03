import { UpdateModelUseCase } from '../update-model.use-case';
import { ModelRepositoryPort } from '../../../domain/ports/model-repository.port';
import {
  DomainConflictException,
  DomainNotFoundException,
} from '../../../../../common/exceptions/domain.exception';
import { Model } from '../../../domain/entities/model.entity';

const existing = new Model('m1', 'Corolla', 'brand-1', 'user-1');
const otherModel = new Model('m2', 'Civic', 'brand-1', 'user-1');

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

describe('UpdateModelUseCase', () => {
  let repo: jest.Mocked<ModelRepositoryPort>;
  let useCase: UpdateModelUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    useCase = new UpdateModelUseCase(repo, eventPublisher as any);
  });

  it('atualiza modelo com dados válidos', async () => {
    await useCase.execute('m1', { name: 'Corolla Novo' });

    expect(repo.update).toHaveBeenCalledTimes(1);
  });

  it('lança DomainNotFoundException quando modelo não existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('nao-existe', { name: 'X' })).rejects.toThrow(
      new DomainNotFoundException('Modelo não encontrado'),
    );
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('lança DomainConflictException quando novo nome pertence a outro modelo', async () => {
    repo.findByName.mockResolvedValue(otherModel);

    await expect(useCase.execute('m1', { name: 'Civic' })).rejects.toThrow(
      new DomainConflictException('Modelo já existe'),
    );
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('não lança conflito quando o nome novo é o mesmo do próprio modelo', async () => {
    repo.findByName.mockResolvedValue(existing);

    await expect(
      useCase.execute('m1', { name: 'Corolla' }),
    ).resolves.toBeUndefined();
    expect(repo.update).toHaveBeenCalledTimes(1);
  });

  it('atualiza brandId do modelo', async () => {
    await useCase.execute('m1', { brandId: 'brand-2' });

    expect(repo.update).toHaveBeenCalledTimes(1);
    const updated: Model = repo.update.mock.calls[0][0];
    expect(updated.brandId).toBe('brand-2');
  });

  it('mantém brandId existente quando não informado no DTO', async () => {
    await useCase.execute('m1', { name: 'Corolla Novo' });

    expect(repo.update).toHaveBeenCalledTimes(1);
    const updated: Model = repo.update.mock.calls[0][0];
    expect(updated.brandId).toBe('brand-1');
  });
});
