import pkg from '../../package.json';

export default () => ({
  appName: process.env.npm_package_name || pkg.name,
  version: process.env.npm_package_version || pkg.version,
  requestLogger: {
    enabled: true,
  },
  logger: {
    enabled: true,
    level: parseInt(process.env.LOG_LEVEL, 10) || 2,
  },
  cors: {
    whitelist: ['http://localhost:5000', '*', '191.168.1.7:3000'],
  },
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  database: {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'my_user',
    password: process.env.DB_PASSWORD || 'my_password',
    dbName: process.env.DB_DATABASE || 'my_database',
  },
  jwtToken: {
    jwtSecretKey: process.env.JWT_SECRET || 'my_secret_key',
    accessKeyExpiresIn: process.env.JWT_ACCESS_KEY_EXP || '1h',
    refreshKeyExpiresIn: process.env.JWT_REFRESH_KEY_EXP || '7d',
  },
  argon: {
    argonSecretKey: process.env.ARGON_SECRET || 'my_secret_key',
    characterSet:
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+><',
  },
  cookieConfig: {
    accessTokenCookieExpiry: parseFloat(
      process.env.ACCESS_TOKEN_COOKIE_EXPIRY || '3.154e11',
    ),
    refreshTokenCookieExpiry: parseFloat(
      process.env.REFRESH_TOKEN_COOKIE_EXPIRY || '3.154e11',
    ),
    defaultCookieExpiry: parseFloat(
      process.env.DEFAULT_COOKIE_EXPIRY || '3.154e11',
    ),
  },
});
