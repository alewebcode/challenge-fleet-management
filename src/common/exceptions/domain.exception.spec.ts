import {
  DomainConflictException,
  DomainException,
  DomainNotFoundException,
  DomainUnauthorizedException,
} from './domain.exception';

describe('DomainException', () => {
  it('deve preservar mensagem e name base', () => {
    const err = new DomainException('base error');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('base error');
    expect(err.name).toBe('DomainException');
  });

  it.each([
    [DomainNotFoundException, 'DomainNotFoundException'],
    [DomainConflictException, 'DomainConflictException'],
    [DomainUnauthorizedException, 'DomainUnauthorizedException'],
  ])(
    '%s deve herdar de DomainException e Error, preservar mensagem e name',
    (ExceptionClass, expectedName) => {
      const err = new ExceptionClass('test message');

      expect(err).toBeInstanceOf(DomainException);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('test message');
      expect(err.name).toBe(expectedName);
    },
  );
});
