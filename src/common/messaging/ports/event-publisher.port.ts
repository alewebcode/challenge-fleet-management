export type EventResource = 'vehicles' | 'models' | 'brands';

export type EventType =
  | 'VEHICLE_CREATED'
  | 'VEHICLE_UPDATED'
  | 'VEHICLE_DELETED'
  | 'VEHICLE_FETCHED'
  | 'VEHICLE_ALL_FETCHED'
  | 'MODEL_CREATED'
  | 'MODEL_UPDATED'
  | 'MODEL_DELETED'
  | 'MODEL_FETCHED'
  | 'MODEL_ALL_FETCHED'
  | 'BRAND_CREATED'
  | 'BRAND_UPDATED'
  | 'BRAND_DELETED'
  | 'BRAND_FETCHED'
  | 'BRAND_ALL_FETCHED';

export interface DomainEvent {
  eventType: EventType;
  userId: string;
  resource: EventResource;
  resourceId: string;
  payload?: unknown;
  createdAt: Date;
}

export abstract class EventPublisherPort {
  abstract publish(event: DomainEvent): Promise<void>;
}
