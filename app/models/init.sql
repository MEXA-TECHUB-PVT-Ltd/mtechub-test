
CREATE SEQUENCE IF NOT EXISTS my_sequence START 100000;


CREATE TABLE IF NOT EXISTS programs(
  program_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  image TEXT,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS packages(
  package_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  package_name TEXT,
  program_id TEXT,
  package_price TEXT,
  type TEXT,
  stripe_payment_link TEXT,
  feature jsonb[],
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS product_videos(
  product_videos_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  thumbnail TEXT,
  program_id TEXT,
  video_url TEXT,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
-- CREATE TABLE IF NOT EXISTS featured_companies(
--   featured_companies_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
--   company_name TEXT,
--   image TEXT,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS users(
--   user_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
--   user_name TEXT,
--   stripe_customer_id TEXT,
--   signup_google TEXT,
--   access_token TEXT,
--   email  TEXT UNIQUE NOT NULL,
--   type TEXT,
--   password TEXT,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW()
 
-- );
-- CREATE TABLE IF NOT EXISTS company(
--   company_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
--   company_name TEXT,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW()
 
-- );
-- CREATE TABLE IF NOT EXISTS subscriptions(
--   subscription_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
--   product_id TEXT,
--   stripe_product_id TEXT,
--   stripe_price_id TEXT,
--   price_id TEXT,
--   payment_method_id TEXT,
--   stripe_subscription_id TEXT,
--   subscription_detail_product jsonb[],
--   user_id  TEXT,
--   type TEXT,
--   status TEXT,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW()
 
-- );


-- CREATE TABLE IF NOT EXISTS subscription_prod_detail(
--   subscription_prod_detail_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
--   subscription_id TEXT,
--   subscription_detail_product TEXT,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW()
 
-- );
-- CREATE TABLE IF NOT EXISTS logs(
--   log_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
--   bodyData jsonb[],
--   api_endpoint TEXT,
--   stripe_api_called TEXT UNIQUE NOT NULL,
--   status TEXT,
--   responseStripe jsonb[],
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW()
 
-- );
-- CREATE TABLE IF NOT EXISTS help_and_support(
--   help_and_support_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
--   user_id TEXT,
--   email TEXT,
--   name TEXT,
--   message TEXT,
--    subscription_id TEXT,
--   reason TEXT,
--   type TEXT,
--   status TEXT,
--   subject TEXT,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW()
 
-- );
-- CREATE TABLE IF NOT EXISTS contact_us(
--   contact_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
--   name TEXT,
--   email TEXT,
--   message TEXT,
--   status TEXT,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW()
 
-- );
-- CREATE TABLE IF NOT EXISTS stripe_logs (
--     log_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
--     timestamp TIMESTAMP,
--     action VARCHAR(255),
--     request_data jsonb[],
--     response_data jsonb[],
--     error_message TEXT,
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS cancel_subscription_req(
--   cancel_subscription_req_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
--   subscription_id TEXT,
--   reason TEXT,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NOW()
 
-- );

-- -- Check if a user with type 'admin' exists
-- SELECT COUNT(*) FROM users WHERE type = 'admin';

-- -- If no user with type 'admin' exists, insert a new user
-- INSERT INTO users (user_id,user_name, type, email,password)
-- SELECT nextval('my_sequence'), 'admin', 'Admin', 'admin@gmail.com','mtechub123'
-- WHERE NOT EXISTS (SELECT 1 FROM users WHERE type = 'Admin');

