export abstract class TokenGeneratorPort {
  abstract generateToken(payload: any): Promise<string>;
}
