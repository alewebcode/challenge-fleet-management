export class Model {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly brandId: string | null,
    public readonly createdBy: string,
  ) {}
}
