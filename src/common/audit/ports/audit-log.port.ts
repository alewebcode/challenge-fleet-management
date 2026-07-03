export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  LOGIN = 'LOGIN',
}

export interface AuditLogEntry {
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  payload?: unknown;
  metadata?: unknown;
  createdAt: Date;
}

export abstract class AuditLogPort {
  abstract log(entry: AuditLogEntry): Promise<void>;
}
