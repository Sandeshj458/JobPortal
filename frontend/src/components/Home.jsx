import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
// import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role == 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);

  return (
    <div className="w-full overflow-x-hidden"> 
      <Navbar />

      <div className="px-4 sm:px-6 md:px-10 space-y-8 mt-4">
        <HeroSection />
        <CategoryCarousel />
        <LatestJobs />
      </div>
      {/* <Footer/> */}
      
    </div>
  )
}

export default Home