// import React, { useEffect } from 'react'
// import Navbar from './shared/Navbar'
// import Job from './Job';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSearchedQuery } from '@/redux/jobSlice';
// import useGetAllJobs from '@/hooks/useGetAllJobs';

// // const randomJobs = [1, 2, 3];

// const Browse = () => {

//     useGetAllJobs();

//     const { allJobs } = useSelector(store => store.job);
//     const dispatch = useDispatch();

//     useEffect(() => {
//         return () => {
//             dispatch(setSearchedQuery(""));
//         }
//     },[])

//     return (
//         <div>
//             <Navbar />
//             <div className='max-w-7xl mx-auto my-10'>
//                 <h1 className='font-bold text-xl my-10'>Search Results ({allJobs.length})</h1>
//                 <div className='grid grid-cols-3 gap-4'>
//                     {
//                         allJobs.map((job) => {
//                             return (
//                                 <Job key={job._id} job={job} />
//                             )
//                         })
//                     }
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Browse

// import React, { useEffect, useState } from 'react'
// import Navbar from './shared/Navbar'
// import Job from './Job'
// import { useDispatch, useSelector } from 'react-redux'
// import { setSearchedQuery } from '@/redux/jobSlice'
// import useGetAllJobs from '@/hooks/useGetAllJobs'
// import { Input } from './ui/input'
// import { useLocation } from 'react-router-dom'  // <--- import useLocation

// const Browse = () => {
//     useGetAllJobs();
//     const location = useLocation();   // <--- get location object
//     const dispatch = useDispatch();
//     const { allJobs } = useSelector(store => store.job);

//     // Read the 'query' param from URL
//     const searchParams = new URLSearchParams(location.search);
//     const queryFromUrl = searchParams.get("query") || "";

//     // Set Redux searchedQuery state when URL param changes
//     useEffect(() => {
//         dispatch(setSearchedQuery(queryFromUrl));
//     }, [queryFromUrl, dispatch]);

//     // Local input state to show in input box, optional but recommended
//     const [input, setInput] = useState(queryFromUrl);

//     // Filter jobs based on queryFromUrl (not from Redux state to avoid race conditions)
//     const filteredJobs = allJobs.filter((job) =>
//         job.title?.toLowerCase().includes(queryFromUrl.toLowerCase())
//     );

//     return (
//         <div>
//             <Navbar />
//             <div className='max-w-7xl mx-auto my-10'>
//                 <div className='flex justify-between items-center mb-6'>
//                     <Input
//                         className="w-1/3"
//                         placeholder="Search by job title"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         // Optional: update URL & Redux on input change (advanced)
//                     />
//                 </div>

//                 <h1 className='font-bold text-xl mb-10'>
//                     Search Results ({filteredJobs.length})
//                 </h1>

//                 <div className='grid grid-cols-3 gap-4'>
//                     {filteredJobs.map((job) => (
//                         <Job key={job._id} job={job} />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Browse;


// import React, { useEffect } from 'react'
// import Navbar from './shared/Navbar'
// import Job from './Job'
// import { useDispatch, useSelector } from 'react-redux'
// import { setSearchedQuery } from '@/redux/jobSlice'
// import useGetAllJobs from '@/hooks/useGetAllJobs'
// import { useLocation } from 'react-router-dom'

// const Browse = () => {
//     useGetAllJobs();
    
//     const location = useLocation();
//     const dispatch = useDispatch();
//     const { allJobs } = useSelector(store => store.job);

//     // Read the 'query' param from URL
//     const searchParams = new URLSearchParams(location.search);
//     const queryFromUrl = searchParams.get("query") || "";

//     // Set Redux searchedQuery state when URL param changes
//     useEffect(() => {
//         dispatch(setSearchedQuery(queryFromUrl));
//     }, [queryFromUrl, dispatch]);

//     // Filter jobs based on queryFromUrl
//     // const filteredJobs = allJobs.filter((job) =>
//     //     job.title?.toLowerCase().includes(queryFromUrl.toLowerCase())
//     // );
//     const filteredJobs = allJobs.filter((job) => {
//         const isActive = new Date(job.expiredDate) >= new Date();
//         return isActive && job.title?.toLowerCase().includes(queryFromUrl.toLowerCase());
//     });


//     return (
//         <div>
//             <Navbar />
//             <div className='max-w-7xl mx-auto my-10'>
//                 <h1 className='font-bold text-xl mb-10'>
//                     Search Results ({filteredJobs.length})
//                 </h1>
//                 <div className='grid grid-cols-3 gap-4'>
//                     {filteredJobs.map((job) => (
//                         <Job key={job._id} job={job} />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Browse;

import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useLocation } from 'react-router-dom'

const Browse = () => {
  useGetAllJobs()

  const location = useLocation()
  const dispatch = useDispatch()
  const { allJobs } = useSelector(store => store.job)

  // Get 'query' param from URL
  const searchParams = new URLSearchParams(location.search)
  const queryFromUrl = searchParams.get('query') || ''

  // Update Redux state when query changes
  useEffect(() => {
    dispatch(setSearchedQuery(queryFromUrl))
  }, [queryFromUrl, dispatch])

  // Filter jobs that are active and match search query
  const filteredJobs = allJobs.filter(job => {
    const isActive = new Date(job.expiredDate) >= new Date()
    return isActive && job.title?.toLowerCase().includes(queryFromUrl.toLowerCase())
  })

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <h1 className="font-bold text-xl mb-10">
          Search Results ({filteredJobs.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <Job key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Browse
