import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { AuditAction, AuditLogPort } from '../ports/audit-log.port';
import { DomainEvent } from 'src/common/messaging/ports/event-publisher.port';

@Injectable()
export class RabbitMqAuditConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqAuditConsumer.name);
  private connection: amqp.AmqpConnectionManager;
  private channel: amqp.ChannelWrapper;
  private readonly queue: string;

  constructor(
    private readonly config: ConfigService,
    private readonly auditLog: AuditLogPort,
  ) {
    this.queue =
      this.config.get<string>('RABBITMQ_QUEUE_AUDIT') ?? 'audit_logs';
  }

  async onModuleInit(): Promise<void> {
    const url = this.config.get<string>('RABBITMQ_URL') ?? 'amqp://localhost';
    this.connection = amqp.connect([url]);

    this.channel = this.connection.createChannel({
      setup: async (ch: amqp.Channel) => {
        await ch.assertQueue(this.queue, { durable: true });
        await ch.prefetch(1);
        await ch.consume(this.queue, async (msg) => {
          if (!msg) return;

          try {
            const event = JSON.parse(msg.content.toString()) as DomainEvent;

            await this.auditLog.log({
              userId: event.userId,
              action: this.resolveAction(event.eventType),
              resource: event.resource,
              resourceId: event.resourceId,
              payload: event.payload,
              createdAt: new Date(event.createdAt),
            });

            ch.ack(msg);
            this.logger.log(
              `Log salvo: ${event.eventType} — ${event.resourceId}`,
            );
          } catch (error) {
            ch.nack(msg, false, true);
            this.logger.error('Erro ao processar mensagem', error);
          }
        });
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }

  private resolveAction(eventType: string): AuditAction {
    const map: Record<string, AuditAction> = {
      VEHICLE_CREATED: AuditAction.CREATE,
      VEHICLE_UPDATED: AuditAction.UPDATE,
      VEHICLE_DELETED: AuditAction.DELETE,
      MODEL_CREATED: AuditAction.CREATE,
      MODEL_UPDATED: AuditAction.UPDATE,
      MODEL_DELETED: AuditAction.DELETE,
      BRAND_CREATED: AuditAction.CREATE,
      BRAND_UPDATED: AuditAction.UPDATE,
      BRAND_DELETED: AuditAction.DELETE,
    };
    return map[eventType] ?? AuditAction.READ;
  }
}
