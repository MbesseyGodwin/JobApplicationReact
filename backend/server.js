const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Maria@123',
  database: 'job_application_db'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
  // Initialize database schema and seed data
  initializeDatabase();
});

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Initialize database schema and seed data
function initializeDatabase() {
  const createCompaniesTableQuery = `
    CREATE TABLE IF NOT EXISTS companies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      location VARCHAR(255)
    )
  `;
  
  const createJobsTableQuery = `
    CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      company_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    )
  `;

  const seedCompaniesQuery = `
    INSERT INTO companies (name, description, location) VALUES
    ('Company A', 'Description of Company A', 'Location A'),
    ('Company B', 'Description of Company B', 'Location B'),
    ('Company C', 'Description of Company C', 'Location C')
  `;

  const seedJobsQuery = `
    INSERT INTO jobs (title, description, company_id) VALUES
    ('Software Engineer', 'Developing web applications', 1),
    ('Data Analyst', 'Analyzing data trends', 2),
    ('Marketing Manager', 'Creating marketing campaigns', 3)
  `;

  db.query(createCompaniesTableQuery, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Companies table created or already exists');
    // Seed companies data after creating the table
    db.query(seedCompaniesQuery, (err, result) => {
      if (err) {
        throw err;
      }
      console.log('Seed data inserted into companies table');
    });
  });

  db.query(createJobsTableQuery, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Jobs table created or already exists');
    // Seed jobs data after creating the table
    db.query(seedJobsQuery, (err, result) => {
      if (err) {
        throw err;
      }
      console.log('Seed data inserted into jobs table');
    });
  });
}

// Route to create a job
app.post('/jobs', (req, res) => {
  const { title, description, company_id } = req.body;
  const query = 'INSERT INTO jobs (title, description, company_id) VALUES (?, ?, ?)';
  db.query(query, [title, description, company_id], (err, result) => {
    if (err) {
      res.status(500).send('Error creating job');
    } else {
      res.status(201).send('Job created successfully');
    }
  });
});

// Route to list all jobs
app.get('/jobs', (req, res) => {
  const query = 'SELECT * FROM jobs';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching jobs');
    } else {
      res.status(200).json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
