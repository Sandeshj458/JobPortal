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
