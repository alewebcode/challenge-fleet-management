import { CreateVehicleUseCase } from '../create-vehicle.use-case';
import { VehicleRepositoryPort } from '../../../domain/ports/vehicle-repository.port';
import { DomainConflictException } from '../../../../../common/exceptions/domain.exception';
import { Vehicle } from '../../../domain/entities/vehicle.entity';

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

const dto = {
  licensePlate: 'ABC-1234',
  chassis: 'CHS001',
  renavam: 'RNV001',
  year: 2022,
  modelId: 'model-uuid',
};

const existingVehicle = new Vehicle(
  'v1',
  dto.licensePlate,
  dto.chassis,
  dto.renavam,
  dto.year,
  dto.modelId,
  'user-1',
);

describe('CreateVehicleUseCase', () => {
  let repo: jest.Mocked<VehicleRepositoryPort>;
  let cache: ReturnType<typeof makeCache>;
  let useCase: CreateVehicleUseCase;
  let eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    repo = makeRepo();
    cache = makeCache();
    useCase = new CreateVehicleUseCase(
      cache as any,
      repo,
      eventPublisher as any,
    );
  });

  it('cria veículo com dados válidos', async () => {
    await useCase.execute(dto, 'user-1');

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(cache.del).toHaveBeenCalledWith('vehicles:all');
  });

  it('lança DomainConflictException se placa já existe', async () => {
    repo.findByLicensePlate.mockResolvedValue(existingVehicle);

    await expect(useCase.execute(dto, 'user-1')).rejects.toThrow(
      new DomainConflictException('Veículo com essa placa já existe'),
    );
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('lança DomainConflictException se chassi já existe', async () => {
    repo.findByChassis.mockResolvedValue(existingVehicle);

    await expect(useCase.execute(dto, 'user-1')).rejects.toThrow(
      new DomainConflictException('Veículo com esse chassi já existe'),
    );
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('lança DomainConflictException se RENAVAM já existe', async () => {
    repo.findByRenavam.mockResolvedValue(existingVehicle);

    await expect(useCase.execute(dto, 'user-1')).rejects.toThrow(
      new DomainConflictException('Veículo com esse RENAVAM já existe'),
    );
    expect(repo.create).not.toHaveBeenCalled();
  });
});
