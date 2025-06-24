import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';

// ✅ Format date as dd/mm/yyyy
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const PostedJobTable = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
        withCredentials: true,
      });
      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (jobs.length === 0)
    return <p className='text-center text-gray-500 pb-4'>No jobs posted yet.</p>;

  return (
    <div className='overflow-x-auto px-4 pb-6'>
      <table className='min-w-full border border-gray-200 rounded-xl overflow-hidden shadow-md'>
        <thead className='bg-purple-100'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider'>
              Title
            </th>
            <th className='px-6 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider'>
              Location
            </th>
            <th className='px-6 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider'>
              Salary
            </th>
            <th className='px-6 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider'>
              Posted On
            </th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {jobs.map((job) => (
            <tr
              key={job._id}
              className='hover:bg-gray-50 transition duration-200 ease-in-out border-b'
            >
              <td className='px-6 py-4 whitespace-nowrap font-medium text-gray-800 max-w-xs truncate'>
                {job.title}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-gray-600'>
                {job.location}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <span className='inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'>
                  {job.salary || 'N/A'}
                </span>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {formatDate(job.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostedJobTable;
