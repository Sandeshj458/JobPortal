import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import UpdateProfileDialog from './UpdateProfileDialog'; // ✅ NEW: Import profile dialog


const JobDescription = () => {

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  
  const isInitiallyApplied =
  singleJob?.applications?.some(application => application.applicant === user?._id) || false;
  
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [openProfileDialog, setOpenProfileDialog] = useState(false); // ✅ NEW: State to open dialog

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // ✅ NEW: Check if profile is complete
  const isProfileComplete = (user) => {
    const profile = user?.profile;
    return (
      user?.fullname &&
      user?.email &&
      user?.phoneNumber &&
      profile?.bio &&
      profile?.skills?.length > 0 &&
      profile?.resume
    );
  };

  const applyJobHandler = async () => {

    if (!user?._id) {
    showErrorToast("You must be logged in to apply for the job.");
    return;
  }

    // ✅ NEW: Prevent applying if profile is incomplete
    if (!isProfileComplete(user)) {
      showErrorToast("Please complete your profile before applying for the job.");
      setOpenProfileDialog(true); // ✅ NEW: Open profile update dialog
      return;
    }

    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsApplied(true);
        const updateSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updateSingleJob));
        showSuccessToast(res.data.message);

      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'User need to register first to apply the job');
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(application => application.applicant === user?._id)
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-xl shadow-lg">
      {/* Back Button */}
      <Button
        onClick={() => navigate('/jobs')}
        className="mb-8 bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-2 px-4 py-2 rounded-md shadow-sm transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Jobs
      </Button>

      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-purple-900 tracking-tight">{singleJob?.title}</h1>

          <div className="flex flex-wrap gap-3 mt-4">
            <Badge className="text-blue-700 font-semibold px-4 py-1" variant="ghost">
              {singleJob?.position} Position{singleJob?.position > 1 ? 's' : ''}
            </Badge>
            <Badge className="text-red-600 font-semibold px-4 py-1" variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className="text-purple-700 font-semibold px-4 py-1" variant="ghost">
              {singleJob?.salary}
            </Badge>
          </div>
        </div>

        <Button
          onClick={isApplied ? undefined : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg px-8 py-3 text-white font-semibold transition-colors shadow-md ${isApplied
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-purple-700 hover:bg-purple-900 cursor-pointer'
            }`}
        >
          {isApplied ? 'Already Applied' : 'Apply Now'}
        </Button>
      </header>

      {/* Job Details Section */}
      <section className="border-t border-gray-300 pt-8 space-y-10">
        {/* Each field nicely formatted */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8 text-gray-800">
      
          <Field label="Role" value={singleJob?.title} />
          <Field label="Job Type" value={singleJob?.jobType || 'Not specified'} />
          <Field label="Location" value={singleJob?.location} />
          <Field label="Experience" value={`${singleJob?.experienceLevel} years`} />
          <Field label="Salary" value={singleJob?.salary} />
          <Field label="Education" value={
            singleJob?.education?.length
              ? singleJob.education.join(', ')
              : 'Not specified'
          } />
          <Field label="No. of Positions" value={singleJob?.position || 'Not specified'} />
          <Field label="Total Applicants" value={singleJob?.applications?.length || 0} />
          <Field label="Posted Date" value={formatDate(singleJob?.createdAt?.split('T')[0])} />
          <Field label="Expiry Date" value={formatDate(singleJob?.expiredDate?.split('T')[0])} />


          <Field
            label="Skills"
            value={singleJob?.requirements?.length
              ? singleJob.requirements.join(', ')
              : 'Not specified'}
            colSpan={2}
          />
          <Field
            label="Description"
            value={singleJob?.description || 'No description provided'}
            colSpan={2}
            multiline
          />
        </div>
      </section>

      {/* ✅ NEW: Include update profile dialog */}
      <UpdateProfileDialog open={openProfileDialog} setOpen={setOpenProfileDialog} />

    </div>
  );
};

// Helper component for displaying label-value pairs cleanly
const Field = ({ label, value, colSpan = 1, multiline = false }) => (
  <div className={`flex flex-col ${colSpan === 2 ? 'md:col-span-2' : ''}`}>
    <h3 className="text-lg font-semibold text-purple-800 mb-1">{label}</h3>
    {multiline ? (
      <p className="pl-4 whitespace-pre-line text-gray-700 leading-relaxed">{value}</p>
    ) : (
      <p className="pl-4 text-gray-700">{value}</p>
    )}
  </div>
);

export default JobDescription;

