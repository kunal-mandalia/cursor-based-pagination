CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE app_user (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(40) NOT NULL,
  age integer NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_user(name,age)
VALUES
  ('Alice', 20),
  ('Bob', 35),
  ('Carl', 22),
  ('Dough', 30);
