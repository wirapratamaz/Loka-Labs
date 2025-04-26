-- Create the request_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS request_logs (
    id SERIAL PRIMARY KEY,
    principal TEXT NOT NULL,
    called_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on principal for faster lookups
CREATE INDEX IF NOT EXISTS idx_request_logs_principal ON request_logs(principal);

-- Add some example data
INSERT INTO request_logs (principal, called_at) 
VALUES ('bx77d-5qpr6-p3fkb-kcipj-iqpre-bqges-v443n-fwcaf-lbpvg-cn4xk-cae', NOW())
ON CONFLICT DO NOTHING; 