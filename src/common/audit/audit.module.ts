import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './adapters/schemas/audit-log.schema';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { MongoAuditLog } from './adapters/mongo-audit-log';
import { AuditLogPort } from './ports/audit-log.port';
import { RabbitMqAuditConsumer } from './adapters/rabbitmq-audit.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  providers: [
    RabbitMqAuditConsumer,
    AuditInterceptor,
    { provide: AuditLogPort, useClass: MongoAuditLog },
  ],
  exports: [AuditLogPort, AuditInterceptor],
})
export class AuditModule {}
