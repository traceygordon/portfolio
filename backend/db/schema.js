require('dotenv').config();
const pg = require('pg');

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const init = async () => {
  await client.connect();

  const SQL = `
  DROP TABLE IF EXISTS contacts CASCADE;
  DROP TABLE IF EXISTS links CASCADE;
  DROP TABLE IF EXISTS pictures CASCADE;
  DROP TABLE IF EXISTS roles CASCADE;

  CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL
  );

  CREATE TABLE pictures (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE
  );

  CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100),
    url TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE
  );

  CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;

  await client.query(SQL);
  console.log("Portfolio schema created successfully.");
};

init();