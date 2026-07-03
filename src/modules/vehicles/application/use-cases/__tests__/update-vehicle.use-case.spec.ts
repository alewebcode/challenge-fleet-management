import { UpdateVehicleUseCase } from '../update-vehicle.use-case';
import { VehicleRepositoryPort } from '../../../domain/ports/vehicle-repository.port';
import {
  DomainConflictException,
  DomainNotFoundException,
} from '../../../../../common/exceptions/domain.exception';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { EventPublisherPort } from '../../../../../common/messaging/ports/event-publisher.port';

const existing = new Vehicle(
  'v1',
  'ABC-1234',
  'CHS001',
  'RNV001',
  2022,
  'model-uuid',
  'user-1',
);
const otherVehicle = new Vehicle(
  'v2',
  'XYZ-9999',
  'CHS002',
  'RNV002',
  2021,
  'model-uuid',
  'user-1',
);

const makeEventPublisher = (): jest.Mocked<EventPublisherPort> =>
  ({
    publish: jest.fn().mockResolvedValue(undefined),
  }) as jest.Mocked<EventPublisherPort>;

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

describe('UpdateVehicleUseCase', () => {
  let repo: jest.Mocked<VehicleRepositoryPort>;
  let cache: ReturnType<typeof makeCache>;
  let useCase: UpdateVehicleUseCase;
  let eventPublisher = makeEventPublisher();

  beforeEach(() => {
    repo = makeRepo();
    cache = makeCache();
    useCase = new UpdateVehicleUseCase(repo, cache as any, eventPublisher);
  });

  it('atualiza veículo e invalida cache', async () => {
    await useCase.execute('v1', { year: 2023 });

    expect(repo.update).toHaveBeenCalledTimes(1);
    expect(cache.del).toHaveBeenCalledWith('vehicles:all');
    expect(cache.del).toHaveBeenCalledWith('vehicles:v1');
  });

  it('lança DomainNotFoundException quando veículo não existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('nao-existe', { year: 2023 })).rejects.toThrow(
      new DomainNotFoundException('Veículo não encontrado'),
    );
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('lança DomainConflictException quando nova placa pertence a outro veículo', async () => {
    repo.findByLicensePlate.mockResolvedValue(otherVehicle);

    await expect(
      useCase.execute('v1', { licensePlate: 'XYZ-9999' }),
    ).rejects.toThrow(
      new DomainConflictException('Placa de Veículo já existe'),
    );
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('não lança conflito quando a placa nova é a mesma do próprio veículo', async () => {
    repo.findByLicensePlate.mockResolvedValue(existing);

    await expect(
      useCase.execute('v1', { licensePlate: 'ABC-1234' }),
    ).resolves.toBeUndefined();
    expect(repo.update).toHaveBeenCalledTimes(1);
  });
});
