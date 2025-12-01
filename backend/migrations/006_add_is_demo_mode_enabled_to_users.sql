-- 006_add_is_demo_mode_enabled_to_users.sql

ALTER TABLE users
ADD COLUMN is_demo_mode_enabled BOOLEAN NOT NULL DEFAULT FALSE;
