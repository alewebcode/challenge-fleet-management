import { Module } from '@nestjs/common';
import { EventPublisherPort } from './ports/event-publisher.port';
import { RabbitMqEventPublisher } from './adapters/rabbitmq-event-publisher';

@Module({
  providers: [
    { provide: EventPublisherPort, useClass: RabbitMqEventPublisher },
  ],
  exports: [EventPublisherPort],
})
export class MessagingModule {}
