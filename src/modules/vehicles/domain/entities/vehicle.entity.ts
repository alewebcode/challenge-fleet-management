export class Vehicle {
  constructor(
    public readonly id: string,
    public readonly licensePlate: string,
    public readonly chassis: string,
    public readonly renavam: string,
    public readonly year: number,
    public readonly modelId: string,
    public readonly createdBy: string,
  ) {}
}
