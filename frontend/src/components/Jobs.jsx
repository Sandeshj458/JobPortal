import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        const currentDate = new Date();

        if (searchedQuery) {
            const query = searchedQuery.toLowerCase();

            const filteredJobs = allJobs.filter((job) => {
                const isActive = !job.expiredDate || new Date(job.expiredDate) >= currentDate;
                if (!isActive) return false;

                return (
                    job.title.toLowerCase().includes(query) ||
                    job.description.toLowerCase().includes(query) ||
                    job.location.toLowerCase().includes(query) ||
                    job.salary.toString().toLowerCase() === query
                );
            });

            setFilterJobs(filteredJobs);
        } else {
            // If no search query, return all ACTIVE jobs
            const activeJobs = allJobs.filter((job) => {
                return !job.expiredDate || new Date(job.expiredDate) >= currentDate;
            });

            setFilterJobs(activeJobs);
        }
    }, [allJobs, searchedQuery]);


    return (
        <div>
            <Navbar />

            <div className='max-w-7xl mx-auto mt-4'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        {/* Filter page */}
                        <FilterCard />
                    </div>
                    {/* Job Card */}
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Jobs;

