import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

export const fetchAllJobs = () => async (dispatch) => {
  try {
    const res = await axios.get(`${JOB_API_END_POINT}/get`, {
      withCredentials: true,
    });
    if (res.data.success) {
      dispatch(setAllJobs(res.data.jobs));
    }
  } catch (error) {
    console.error("Failed to fetch jobs", error);
  }
};
