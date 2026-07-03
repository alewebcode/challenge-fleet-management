import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { AuditLogEntry, AuditLogPort } from '../ports/audit-log.port';

@Injectable()
export class MongoAuditLog implements AuditLogPort {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async log(entry: AuditLogEntry): Promise<void> {
    await this.auditLogModel.create(entry);
  }
}
