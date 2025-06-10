// import React from 'react'
// import LatestJobsCards from './LatestJobsCards';
// import { useSelector } from 'react-redux';

// // const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];
// const LatestJobs = () => {
//     const {allJobs} = useSelector(store => store.job);

//     return (
//         <div className='max-w-7xl mx-auto my-20'>
//             <h1 className='text-4xl font-bold'><span className='text-[#6A38C2]'>Latest & Top </span> Job Opening</h1>
//             <div className='grid grid-cols-3 gap-4 my-5'>
//                 {
//                     allJobs.length <= 0 ? <span>No Job Available</span> : allJobs.slice(0,6).map((job) => <LatestJobsCards key={job._id} job={job}/>)
//                 }
//             </div>
//         </div>
//     )
// }

// export default LatestJobs


// import React from 'react';
// import LatestJobsCards from './LatestJobsCards';
// import { useSelector } from 'react-redux';

// // Convert salary string to annual salary number for sorting
// const parseAnnualSalary = (salaryStr) => {
//     if (!salaryStr) return 0;

//     salaryStr = salaryStr.toLowerCase().replace(/\s/g, ''); // remove spaces
//     let value = parseFloat(salaryStr);
//     if (isNaN(value)) return 0;

//     // Determine unit and period
//     const isMonthly = salaryStr.includes('/month');
//     const isYearly = salaryStr.includes('/year');

//     if (salaryStr.includes('k')) {
//         value *= 1000;
//     } else if (salaryStr.includes('lakh')) {
//         value *= 100000;
//     } else if (salaryStr.includes('cr')) {
//         value *= 10000000;
//     }

//     // Convert monthly to annual
//     if (isMonthly) {
//         value *= 12;
//     }

//     return value; // already annualized
// };

// const LatestJobs = () => {
//     const { allJobs } = useSelector(store => store.job);

//     // Sort by annualized salary and take top 5
//     const topJobs = [...allJobs]
//         .filter(job => job.salary)
//         .sort((a, b) => parseAnnualSalary(b.salary) - parseAnnualSalary(a.salary))
//         .slice(0, 5);

//     return (
//         <div className='max-w-7xl mx-auto my-20'>
//             <h1 className='text-4xl font-bold'>
//                 <span className='text-[#6A38C2]'>Latest & Top </span> Job Opening
//             </h1>
//             <div className='grid grid-cols-3 gap-4 my-5'>
//                 {
//                     topJobs.length === 0 
//                         ? <span>No Job Available</span> 
//                         : topJobs.map(job => <LatestJobsCards key={job._id} job={job} />)
//                 }
//             </div>
//         </div>
//     );
// };

// export default LatestJobs;

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

  // const topJobs = [...allJobs]
  //   .filter(job => job.salary)
  //   .sort((a, b) => parseAnnualSalary(b.salary) - parseAnnualSalary(a.salary))
  //   .slice(0, 5);

  const topJobs = [...allJobs]
    .filter(job => job.salary && new Date(job.expiredDate) >= new Date())
    .sort((a, b) => parseAnnualSalary(b.salary) - parseAnnualSalary(a.salary))
    .slice(0, 5);


  // return (
  //     <div className='max-w-7xl mx-auto my-20 overflow-hidden'>
  //         <h1 className='text-4xl font-bold mb-4'>
  //             <span className='text-[#6A38C2]'>Top Salary </span> Job Openings
  //         </h1>

  //         <div className='relative w-full overflow-hidden whitespace-nowrap'>
  //             <div className="flex w-max animate-marquee space-x-4">
  //                 {[...topJobs, ...topJobs].map((job, idx) => (
  //                     <div key={job._id + idx} className="min-w-[300px] inline-block">
  //                         <LatestJobsCards job={job} />
  //                     </div>
  //                 ))}
  //             </div>
  //         </div>
  //     </div>
  // );


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
