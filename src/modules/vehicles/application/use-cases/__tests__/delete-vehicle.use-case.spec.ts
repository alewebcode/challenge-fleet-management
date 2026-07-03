import { DeleteVehicleUseCase } from '../delete-vehicle.use-case';
import { VehicleRepositoryPort } from '../../../domain/ports/vehicle-repository.port';
import { DomainNotFoundException } from '../../../../../common/exceptions/domain.exception';
import { Vehicle } from '../../../domain/entities/vehicle.entity';

const existing = new Vehicle(
  'v1',
  'ABC-1234',
  'CHS001',
  'RNV001',
  2022,
  'model-uuid',
  'user-1',
);

const makeRepo = (): jest.Mocked<VehicleRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(existing),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findByLicensePlate: jest.fn().mockResolvedValue(null),
    findByChassis: jest.fn().mockResolvedValue(null),
    findByRenavam: jest.fn().mockResolvedValue(null),
    findByModelId: jest.fn().mockResolvedValue([]),
  }) as jest.Mocked<VehicleRepositoryPort>;

const makeCache = () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
});

describe('DeleteVehicleUseCase', () => {
  let repo: jest.Mocked<VehicleRepositoryPort>;
  let cache: ReturnType<typeof makeCache>;
  let useCase: DeleteVehicleUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    cache = makeCache();
    useCase = new DeleteVehicleUseCase(
      repo,
      cache as any,
      eventPublisher as any,
    );
  });

  it('deleta veículo e invalida cache', async () => {
    await useCase.execute('v1', 'user-1');

    expect(repo.delete).toHaveBeenCalledWith('v1');
    expect(cache.del).toHaveBeenCalledWith('vehicles:all');
    expect(cache.del).toHaveBeenCalledWith('vehicles:v1');
  });

  it('lança DomainNotFoundException quando veículo não existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('nao-existe', 'user-1')).rejects.toThrow(
      new DomainNotFoundException('Veículo não encontrado'),
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
