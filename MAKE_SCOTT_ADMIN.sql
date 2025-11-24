-- Run this SQL command to make Scott Marquis an admin
-- This should be run AFTER you've registered on the website with samarquis4@gmail.com

UPDATE users 
SET role = 'admin' 
WHERE email = 'samarquis4@gmail.com';

-- Verify it worked:
SELECT email, first_name, last_name, role, is_active 
FROM users 
WHERE email = 'samarquis4@gmail.com';
