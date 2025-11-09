// Global test setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/test_db';
process.env.REDIS_URL = 'redis://localhost:6379/1';
process.env.STORAGE_PROVIDER = 'local';
process.env.STORAGE_LOCAL_DIR = './test-uploads';
