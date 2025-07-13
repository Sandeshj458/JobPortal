import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';


const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    useEffect(() => {
        const currentDate = new Date();

        if (searchedQuery) {
            const query = searchedQuery.toLowerCase();
            const filteredJobs = allJobs.filter(job => {
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
            const activeJobs = allJobs.filter(job => {
                return !job.expiredDate || new Date(job.expiredDate) >= currentDate;
            });
            setFilterJobs(activeJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto mt-4 px-2">
                {/* Mobile Filter Button */}
                <div className="block lg:hidden mb-4">
                    <button
                        className="flex items-center gap-2 bg-[#6A38C2] hover:bg-[#5b30a6] text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
                        onClick={() => setShowMobileFilter(true)}
                    >
                        <Filter className="w-5 h-5" />
                        <span className="font-medium text-sm">Filter Jobs</span>
                    </button>
                </div>


                {/* Mobile Filter Modal */}
                {showMobileFilter && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10">
                        <div className="bg-white w-[90%] rounded-md p-4 shadow-md max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Filter Jobs</h2>
                                <button
                                    className="text-sm text-red-600"
                                    onClick={() => setShowMobileFilter(false)}
                                >
                                    Close
                                </button>
                            </div>
                            <FilterCard onApply={() => setShowMobileFilter(false)} />
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Desktop Filter */}
                    <div className="hidden lg:block w-[20%]">
                        <FilterCard />
                    </div>

                    {filterJobs.length <= 0 ? (
                        <div className="flex-1 h-[88vh] flex flex-col items-center justify-center text-center">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                No jobs found
                            </h2>
                        </div>
                    ) : (
                        <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filterJobs.map(job => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                        key={job?._id}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
};

export default Jobs;