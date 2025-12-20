-- Elevate audit user to trainer
UPDATE users SET roles = ARRAY['trainer'], role = 'trainer' WHERE email = 'audittrainer@example.com';

-- Ensure John Smith has the correct role and password (if we can)
-- Since we can't easily hash in SQL without pgcrypto, we'll focus on the audittrainer we just registered.
