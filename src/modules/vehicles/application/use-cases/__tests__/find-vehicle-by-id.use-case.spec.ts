import { FindVehicleByIdUseCase } from '../find-vehicle-by-id.use-case';
import { VehicleRepositoryPort } from '../../../domain/ports/vehicle-repository.port';
import { DomainNotFoundException } from '../../../../../common/exceptions/domain.exception';
import { Vehicle } from '../../../domain/entities/vehicle.entity';

const vehicle = new Vehicle(
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
    findById: jest.fn().mockResolvedValue(null),
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

describe('FindVehicleByIdUseCase', () => {
  let repo: jest.Mocked<VehicleRepositoryPort>;
  let cache: ReturnType<typeof makeCache>;
  let useCase: FindVehicleByIdUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    cache = makeCache();
    useCase = new FindVehicleByIdUseCase(
      repo,
      cache as any,
      eventPublisher as any,
    );
  });

  it('retorna veículo do cache sem consultar repositório', async () => {
    cache.get.mockResolvedValue(vehicle);

    const result = await useCase.execute('v1', 'user-1');

    expect(result).toBe(vehicle);
    expect(repo.findById).not.toHaveBeenCalled();
  });

  it('busca no repositório quando não está em cache e armazena', async () => {
    repo.findById.mockResolvedValue(vehicle);

    const result = await useCase.execute('v1', 'user-1');

    expect(result).toBe(vehicle);
    expect(repo.findById).toHaveBeenCalledWith('v1');
    expect(cache.set).toHaveBeenCalledWith('vehicles:v1', vehicle);
  });

  it('lança DomainNotFoundException quando veículo não existe', async () => {
    await expect(useCase.execute('nao-existe', 'user-1')).rejects.toThrow(
      new DomainNotFoundException('Veículo não encontrado'),
    );
  });
});
