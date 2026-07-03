export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class DomainNotFoundException extends DomainException {}

export class DomainConflictException extends DomainException {}

export class DomainUnauthorizedException extends DomainException {}
