// import React, { useState } from 'react'
// import { Button } from './ui/button'
// import { Search } from 'lucide-react'
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setSearchedQuery } from '@/redux/jobSlice';

// const HeroSection = () => {
//     const [query, setQuery] = useState("");
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const searchJobHandler = () => {
//         dispatch(setSearchedQuery(query));
//         // navigate("/browse");
//         navigate(`/browse?query=${encodeURIComponent(query)}`);
//     }

//     return (
//         <div className='text-center'>
//             <div className='flex flex-col gap-5 my-10'>
//                 <span className='mx-auto px-4 py-2 rounded-full bg-white text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>
//                 <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
//                 <p>Discover your dream job, connect with top employers, and take the next bold step in your career - all in one place.</p>
//                 <div className='flex w-[40%] shadow-lg border border-gray-200 bg-white pl-3 rounded-full items-center gap-4 mx-auto'>
//                     <input
//                         type='text'
//                         placeholder='Find your dream jobs'
//                         onChange={(e) => setQuery(e.target.value)}
//                         className='outline-none border-none w-full'
//                     />
//                     <Button onClick={searchJobHandler} className='rounded-r-full bg-[#6A38C2]'>
//                         <Search className='h-5 w-5'/>
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default HeroSection

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    if (query.trim()) {
      dispatch(setSearchedQuery(query));
      navigate(`/browse?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="text-center px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-5 my-10"
      >
        <span className="mx-auto px-4 py-2 rounded-full bg-white text-[#F83002] font-medium shadow">
          No. 1 Job Hunt Website
        </span>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Search, Apply & <br />
          Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Discover your dream job, connect with top employers, and take the next bold step in your career - all in one place.
        </p>

        <div className="flex w-full sm:w-[90%] md:w-[60%] lg:w-[40%] mx-auto items-center gap-2 px-2 py-2 bg-white border border-gray-200 rounded-full shadow-md focus-within:ring-2 focus-within:ring-[#6A38C2] transition-all duration-200">
          <input
            type="text"
            placeholder="Find your dream job"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchJobHandler()}
            className="flex-1 bg-transparent outline-none text-sm md:text-base px-3"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-full bg-[#6A38C2] hover:bg-[#582cad] transition-all"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
