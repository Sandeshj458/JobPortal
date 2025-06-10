// JobList.jsx
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect, useState } from 'react';

const JobList = () => {
  const { searchedQuery } = useSelector(state => state.job);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (searchedQuery) {
      axios
        .get(`/api/jobs/filter?searchedQuery=${encodeURIComponent(searchedQuery)}`)
        // .then(res => setJobs(res.data.data))
        .then(res => {
          const currentDate = new Date();
          const activeJobs = res.data.data.filter(job => new Date(job.expiredDate) >= currentDate);
          setJobs(activeJobs);
        })
        .catch(err => console.error(err));
    }
  }, [searchedQuery]);

  return (
    <div>
      {jobs.map((job, index) => (
        <div key={index} className="border p-3 my-2 rounded bg-white">
          <h2 className="font-bold text-lg">{job.title}</h2>
          <p>{job.location} | {job.industry} | {job.salary}</p>
        </div>
      ))}
    </div>
  );
};

export default JobList;
