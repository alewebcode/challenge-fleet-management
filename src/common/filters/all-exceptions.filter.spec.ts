import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import {
  DomainConflictException,
  DomainNotFoundException,
  DomainUnauthorizedException,
} from '../exceptions/domain.exception';

const makeHost = (url = '/test'): ArgumentsHost => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ url }),
    }),
  } as unknown as ArgumentsHost;
};

const getJsonCall = (host: ArgumentsHost) => {
  const res = host.switchToHttp().getResponse<any>();
  return res.status.mock.results[0].value.json.mock.calls[0][0] as Record<
    string,
    unknown
  >;
};

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
  });

  it('mapeia DomainNotFoundException para 404', () => {
    const host = makeHost();
    filter.catch(new DomainNotFoundException('Recurso não encontrado'), host);

    const body = getJsonCall(host);
    expect(body.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.error).toBe('NOT_FOUND');
    expect(body.message).toBe('Recurso não encontrado');
    expect(body.path).toBe('/test');
    expect(new Date(body.timestamp as string).toISOString()).toBe(body.timestamp);
  });

  it('mapeia DomainConflictException para 409', () => {
    const host = makeHost();
    filter.catch(new DomainConflictException('Já existe'), host);

    const body = getJsonCall(host);
    expect(body.statusCode).toBe(HttpStatus.CONFLICT);
    expect(body.error).toBe('CONFLICT');
    expect(body.message).toBe('Já existe');
  });

  it('mapeia DomainUnauthorizedException para 401', () => {
    const host = makeHost();
    filter.catch(new DomainUnauthorizedException('Não autorizado'), host);

    const body = getJsonCall(host);
    expect(body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(body.error).toBe('UNAUTHORIZED');
    expect(body.message).toBe('Não autorizado');
  });

  it('mantém status original de HttpException (400)', () => {
    const host = makeHost();
    filter.catch(new BadRequestException('campo inválido'), host);

    const body = getJsonCall(host);
    expect(body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.error).toBe('BAD_REQUEST');
    expect(body.message).toBe('campo inválido');
  });

  it('mapeia Error genérico para 500 com mensagem genérica', () => {
    const host = makeHost();
    filter.catch(new Error('erro inesperado'), host);

    const body = getJsonCall(host);
    expect(body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(body.error).toBe('INTERNAL_SERVER_ERROR');
    expect(body.message).toBe('Erro interno do servidor');
  });

  it('inclui path e timestamp ISO em todas as respostas', () => {
    const host = makeHost('/vehicles/create');
    filter.catch(new DomainConflictException('msg'), host);

    const body = getJsonCall(host);
    expect(body.path).toBe('/vehicles/create');
    expect(typeof body.timestamp).toBe('string');
    expect(() => new Date(body.timestamp as string).toISOString()).not.toThrow();
  });
});
