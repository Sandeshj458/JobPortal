import React from 'react';
import LatestJobsCards from './LatestJobsCards';
import { useSelector } from 'react-redux';

// Utility function to convert salary to annual
const parseAnnualSalary = (salaryStr) => {
  if (!salaryStr) return 0;
  salaryStr = salaryStr.toLowerCase().replace(/\s/g, '');
  let value = parseFloat(salaryStr);
  if (isNaN(value)) return 0;

  const isMonthly = salaryStr.includes('/month');
  const isYearly = salaryStr.includes('/year');

  if (salaryStr.includes('k')) value *= 1000;
  else if (salaryStr.includes('lakh')) value *= 100000;
  else if (salaryStr.includes('cr')) value *= 10000000;

  if (isMonthly) value *= 12;

  return value;
};

const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.job);

  const topJobs = [...allJobs]
    .filter(job => job.salary && new Date(job.expiredDate) >= new Date())
    .sort((a, b) => parseAnnualSalary(b.salary) - parseAnnualSalary(a.salary))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold mb-4">
        <span className="text-[#6A38C2]">Top Salary </span> Job Openings
      </h1>

      <div className="marquee-container">
        <div className="marquee-content">
          {[...topJobs, ...topJobs].map((job, idx) => (
            <div
              key={job._id + idx}
              style={{ display: 'inline-block', minWidth: '300px', marginRight: '16px' }}
            >
              <LatestJobsCards job={job} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};

export default LatestJobs;
