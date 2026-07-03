import { FindAllVehiclesUseCase } from '../find-all-vehicles.use-case';
import { VehicleRepositoryPort } from '../../../domain/ports/vehicle-repository.port';
import { Vehicle } from '../../../domain/entities/vehicle.entity';

const vehicles = [
  new Vehicle(
    'v1',
    'ABC-1234',
    'CHS001',
    'RNV001',
    2022,
    'model-uuid',
    'user-1',
  ),
  new Vehicle(
    'v2',
    'DEF-5678',
    'CHS002',
    'RNV002',
    2023,
    'model-uuid',
    'user-1',
  ),
];

const makeRepo = (): jest.Mocked<VehicleRepositoryPort> =>
  ({
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue(vehicles),
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

describe('FindAllVehiclesUseCase', () => {
  let repo: jest.Mocked<VehicleRepositoryPort>;
  let cache: ReturnType<typeof makeCache>;
  let useCase: FindAllVehiclesUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    cache = makeCache();
    useCase = new FindAllVehiclesUseCase(
      repo,
      cache as any,
      eventPublisher as any,
    );
  });

  it('retorna lista do cache sem consultar repositório', async () => {
    cache.get.mockResolvedValue(vehicles);

    const result = await useCase.execute('user-1');

    expect(result).toBe(vehicles);
    expect(repo.findAll).not.toHaveBeenCalled();
  });

  it('busca no repositório quando não está em cache e armazena', async () => {
    const result = await useCase.execute('user-1');

    expect(result).toBe(vehicles);
    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith('vehicles:all', vehicles);
  });
});
