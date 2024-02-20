import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/jobs')
      .then(response => {
        setJobs(response.data);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
      });
  }, []);

  const handleCreateJob = () => {
    axios.post('http://localhost:5000/jobs', { title, description })
      .then(response => {
        console.log('Job created successfully');
        // Refresh jobs list after creating a new job
        axios.get('http://localhost:5000/jobs')
          .then(response => {
            setJobs(response.data);
          })
          .catch(error => {
            console.error('Error fetching jobs:', error);
          });
      })
      .catch(error => {
        console.error('Error creating job:', error);
      });
  };

  return (
    <div>
      <h1>Job Application App</h1>
      <h2>Create Job</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleCreateJob}>Create Job</button>
      <h2>Jobs</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <strong>{job.title}</strong>: {job.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
