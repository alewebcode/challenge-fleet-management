import { LoginUseCase } from '../login.use-case';
import { UserRepositoryPort } from '../../../domain/ports/user-repository.port';
import { PasswordHasherPort } from '../../../domain/ports/password-hasher.port';
import { TokenGeneratorPort } from '../../../domain/ports/token-generator.port';
import { DomainUnauthorizedException } from '../../../../../common/exceptions/domain.exception';
import { User } from '../../../domain/entities/user.entity';

const user = new User(
  'u1',
  'johndoe',
  'John Doe',
  'john@example.com',
  'hashed_password',
);

const makeUserRepo = (): jest.Mocked<UserRepositoryPort> => ({
  findByNickname: jest.fn().mockResolvedValue(null),
  findByEmail: jest.fn().mockResolvedValue(null),
});

const makePasswordHasher = (): jest.Mocked<PasswordHasherPort> => ({
  compare: jest.fn().mockResolvedValue(false),
});

const makeTokenGenerator = (): jest.Mocked<TokenGeneratorPort> => ({
  generateToken: jest.fn().mockResolvedValue('access_token_jwt'),
});

describe('LoginUseCase', () => {
  let userRepo: jest.Mocked<UserRepositoryPort>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;
  let tokenGenerator: jest.Mocked<TokenGeneratorPort>;
  let useCase: LoginUseCase;

  beforeEach(() => {
    userRepo = makeUserRepo();
    passwordHasher = makePasswordHasher();
    tokenGenerator = makeTokenGenerator();
    useCase = new LoginUseCase(userRepo, passwordHasher, tokenGenerator);
  });

  it('lança DomainUnauthorizedException quando usuário não é encontrado', async () => {
    await expect(useCase.execute('nao-existe', 'senha')).rejects.toThrow(
      new DomainUnauthorizedException('Credenciais inválidas'),
    );
    expect(passwordHasher.compare).not.toHaveBeenCalled();
  });

  it('encontra usuário por nickname', async () => {
    userRepo.findByNickname.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);

    await useCase.execute('johndoe', 'senha');

    expect(userRepo.findByNickname).toHaveBeenCalledWith('johndoe');
  });

  it('encontra usuário por email quando nickname não encontra', async () => {
    userRepo.findByNickname.mockResolvedValue(null);
    userRepo.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);

    await useCase.execute('john@example.com', 'senha');

    expect(userRepo.findByEmail).toHaveBeenCalledWith('john@example.com');
  });

  it('lança DomainUnauthorizedException quando senha é inválida', async () => {
    userRepo.findByNickname.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute('johndoe', 'senha_errada')).rejects.toThrow(
      new DomainUnauthorizedException('Credenciais inválidas'),
    );
    expect(tokenGenerator.generateToken).not.toHaveBeenCalled();
  });

  it('retorna accessToken quando credenciais são válidas', async () => {
    userRepo.findByNickname.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);

    const result = await useCase.execute('johndoe', 'senha_correta');

    expect(result).toEqual({
      accessToken: 'access_token_jwt',
      userName: 'John Doe',
    });
    expect(tokenGenerator.generateToken).toHaveBeenCalledWith({
      sub: 'u1',
      nickname: 'johndoe',
    });
  });
});
