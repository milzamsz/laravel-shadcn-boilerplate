-- docker/db/init.sql
-- Dijalankan otomatis saat container pertama kali dibuat.

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Verifikasi
DO $$
BEGIN
    RAISE NOTICE 'pgvector version: %', (
        SELECT extversion FROM pg_extension WHERE extname = 'vector'
    );
END $$;
