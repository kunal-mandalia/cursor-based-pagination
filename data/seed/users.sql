ALTER DATABASE local
SET log_statement = 'all';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE app_user (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(40) NOT NULL,
  age integer NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_user(name,age,created_at)
VALUES
  ('Alice',20, '2019-01-01'),
  ('Carl', 22, '2018-02-01'),
  ('Ed',   22, '2018-06-01'),
  ('Doug', 30, '2019-08-01'),
  ('Bob',  35, '2019-03-01'),
  ('Zen',  90, '2020-03-01');
  