import 'dotenv/config';
import * as env from 'env-var';

export const envConfig = {
  // Database
  databaseUrl: env.get('DATABASE_URL').required().asString(),

  // JWT
  jwtAccessSecret: env.get('JWT_ACCESS_SECRET').required().asString(),
  jwtRefreshSecret: env.get('JWT_REFRESH_SECRET').required().asString(),
  jwtAccessExpiration: env.get('JWT_ACCESS_EXPIRATION').default(900000).asIntPositive(), // 15 minutes
  jwtRefreshExpiration: env.get('JWT_REFRESH_EXPIRATION').default(604800000).asIntPositive(), // 7 days

  // Application
  port: env.get('PORT').default(3001).asPortNumber(),
  nodeEnv: env.get('NODE_ENV').default('development').asString(),

  // URLs
  frontendUrl: env.get('FRONTEND_URL').default('http://localhost:3000').asString(),
  backendUrl: env.get('BACKEND_URL').default('http://localhost:3001').asString(),
};

export type EnvConfig = typeof envConfig;
