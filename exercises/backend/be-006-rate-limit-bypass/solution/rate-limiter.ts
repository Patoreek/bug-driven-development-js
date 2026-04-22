export interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
  trustedProxies: string[];
}

export interface RequestInfo {
  remoteAddress: string;
  headers: Record<string, string | undefined>;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  clientIp: string;
}

export class RateLimiter {
  private hits: Map<string, { count: number; resetAt: number }> = new Map();
  private config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
  }

  /**
   * Extracts the client IP from the request.
   * Only trusts X-Forwarded-For when the direct connection comes from a trusted proxy.
   */
  getClientIp(req: RequestInfo): string {
    // Only trust X-Forwarded-For if the request comes from a trusted proxy
    if (this.config.trustedProxies.includes(req.remoteAddress)) {
      const forwarded = req.headers["x-forwarded-for"];
      if (forwarded) {
        return forwarded.split(",")[0].trim();
      }
    }
    return req.remoteAddress;
  }

  check(req: RequestInfo): RateLimitResult {
    const clientIp = this.getClientIp(req);
    const now = Date.now();

    const record = this.hits.get(clientIp);

    if (!record || now > record.resetAt) {
      this.hits.set(clientIp, {
        count: 1,
        resetAt: now + this.config.windowMs,
      });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        clientIp,
      };
    }

    record.count++;

    if (record.count > this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        clientIp,
      };
    }

    return {
      allowed: true,
      remaining: this.config.maxRequests - record.count,
      clientIp,
    };
  }

  reset(): void {
    this.hits.clear();
  }
}
