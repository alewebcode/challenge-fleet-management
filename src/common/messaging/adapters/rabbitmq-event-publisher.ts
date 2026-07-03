import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { DomainEvent, EventPublisherPort } from '../ports/event-publisher.port';

@Injectable()
export class RabbitMqEventPublisher
  implements EventPublisherPort, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RabbitMqEventPublisher.name);
  private connection: amqp.AmqpConnectionManager;
  private channel: amqp.ChannelWrapper;
  private readonly queue: string;

  constructor(private readonly config: ConfigService) {
    this.queue =
      this.config.get<string>('RABBITMQ_QUEUE_AUDIT') ?? 'audit_logs';
  }

  async onModuleInit(): Promise<void> {
    const url = this.config.get<string>('RABBITMQ_URL') ?? 'amqp://localhost';
    this.connection = amqp.connect([url]);

    this.channel = this.connection.createChannel({
      setup: (ch: amqp.Channel) =>
        ch.assertQueue(this.queue, { durable: true }),
    });

    this.logger.log(`Conectado ao RabbitMQ — fila: ${this.queue}`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }

  async publish(event: DomainEvent): Promise<void> {
    await this.channel.sendToQueue(
      this.queue,
      Buffer.from(JSON.stringify(event)),
      { persistent: true },
    );
    this.logger.log(
      `Evento publicado: ${event.eventType} — ${event.resourceId}`,
    );
  }
}
