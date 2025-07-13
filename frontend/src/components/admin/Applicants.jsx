import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // ✅
  const searchParams = new URLSearchParams(location.search); // ✅
  const screeningType = searchParams.get('screeningType'); // ✅

  const { applicants } = useSelector(store => store.application)

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          {
            withCredentials: true
          });

        dispatch(setAllApplicants(res.data.job));

      } catch (error) {
        console.log(error);
      }
    }
    fetchAllApplicants();
  }, [params.id]);

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 mt-7'>
        <button
          onClick={() => navigate('/admin/jobs')} // or '/jobs' as you want
          className="mb-4 bg-white text-gray-800 hover:bg-gray-400 flex items-center gap-2 px-3 py-1 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
       
        <div className="max-w-5xl mx-auto my-10 p-6 bg-white shadow-lg rounded-xl border">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Applicants ({applicants?.applications?.length || 0}) - {screeningType} Screening
          </h2>
          <ApplicantsTable screeningType={screeningType} />
        </div>
      </div>
    </div>
  )
}

export default Applicants