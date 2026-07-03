import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditAction, AuditLogPort } from '../ports/audit-log.port';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLog: AuditLogPort) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      body: unknown;
      user?: { userId: string };
      headers: Record<string, string>;
      ip: string;
    }>();

    const { method, url, body, user, ip, headers } = request;
    const resource = url.split('/')[1];
    const action = this.resolveAction(method);

    return next.handle().pipe(
      tap(() => {
        void this.auditLog.log({
          userId: user?.userId ?? 'anonymous',
          action,
          resource,
          payload: this.sanitizeBody(body),
          metadata: {
            ip,
            userAgent: headers['user-agent'],
            method,
            url,
          },
          createdAt: new Date(),
        });
      }),
    );
  }

  private sanitizeBody(body: unknown): unknown {
    if (typeof body !== 'object' || body === null) return body;

    const { password, ...safeBody } = body as Record<string, unknown>;
    void password;

    return safeBody;
  }

  private resolveAction(method: string): AuditAction {
    const map: Record<string, AuditAction> = {
      GET: AuditAction.READ,
      POST: AuditAction.CREATE,
      PUT: AuditAction.UPDATE,
      PATCH: AuditAction.UPDATE,
      DELETE: AuditAction.DELETE,
    };
    return map[method] ?? AuditAction.READ;
  }
}
