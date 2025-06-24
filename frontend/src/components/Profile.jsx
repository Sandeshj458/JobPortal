import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedobs';
import PostedJobTable from './PostedJobTable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { logout } from '@/redux/authSlice'; // adjust path if needed
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { USER_API_END_POINT } from '@/utils/constant';
import { showErrorToast, showSuccessToast } from '@/utils/toast';


// OTP Countdown Ring Component
const CircularCountdown = ({ duration, timeLeft }) => {
  const radius = 24;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (timeLeft / duration) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="absolute top-0 left-0"
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={timeLeft <= 10 ? '#f87171' : '#3b82f6'}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute text-xs font-medium text-gray-700">
        {timeLeft}s
      </span>
    </div>
  );
};


const Profile = () => {
  useGetAppliedJobs();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  
  // 🔒 OTP-based Delete States
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  
  const isJobSeeker = user?.role === 'jobseeker';
  const isRecruiter = user?.role === 'recruiter';
  
  // ⏱️ Countdown Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 📩 Send OTP to Email
  const sendOtpToEmail = async () => {
    try {
      setSendingOtp(true);
      const res = await axios.post(`${USER_API_END_POINT}/send-otp`, {
        email: user.email,
        purpose: "delete-account",
      });
    
      showSuccessToast(res.data.message);
      setOtpSent(true);
      setTimer(60);
      setMessage(""); // reset message
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Error sending OTP.");
    } finally {
      setSendingOtp(false);
    }
  };


  const confirmDeleteAccount = async () => {
  if (!otp) {
    setMessage("❗ Please enter OTP");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(`${USER_API_END_POINT}/delete-account`, {
      email: user.email,
      otp,
    });

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Account deletion failed.");
    }

    showSuccessToast(res.data.message || "Account deleted successfully");
    localStorage.removeItem("token");
    document.cookie = "token=; max-age=0";
    dispatch(logout());
    navigate("/", { replace: true });

  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Error deleting account.";
    showErrorToast(errorMessage);
    console.error("Delete error:", errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <Navbar />
      <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
        {/* Profile Header */}
        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-24 w-24'>
              <AvatarImage src={user?.profile?.profilePhoto} alt='profile' />
            </Avatar>
            <div>
              <h1 className='font-medium text-xl'>{user?.fullname}</h1>
              <p>{user?.profile?.bio}</p>
              {isRecruiter && user?.profile?.title && (
                <p className='text-gray-600 text-sm'>Title: {user.profile.title}</p>
              )}
            </div>
          </div>
          {(isJobSeeker || isRecruiter) && (
            <Button onClick={() => setOpen(true)} className='text-right' variant='outline'>
              <Pen />
            </Button>
          )}
        </div>

        {/* Email & Phone */}
        <div className='my-5'>
          <div className='flex items-center gap-3 my-2'>
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className='flex items-center gap-3 my-2'>
            <Contact />
            <span>{user?.phoneNumber || 'N/A'}</span>
          </div>
        </div>

        {/* Experience */}
        {isJobSeeker && (
          <div className='my-5'>
            <h1 className='font-bold text-md'>Experience</h1>
            <p>{user?.profile?.experience ? `${user.profile.experience} years` : 'None'}</p>
          </div>
        )}

        {/* Skills */}
        {isJobSeeker && (
          <div className='my-5'>
            <h1 className='font-bold text-md'>Skills</h1>
            <div className='flex items-center gap-2 flex-wrap'>
              {user?.profile?.skills?.length > 0
                ? user.profile.skills.map((item, index) => (
                  <span key={index} className='px-3 py-1.5 bg-purple-100 text-purple-800 text-sm rounded-full shadow-sm hover:shadow-md transition'>
                    {item}
                  </span>
                ))
                : <span>NA</span>}
            </div>
          </div>
        )}

        {/* Education */}
        <div className='my-5'>
          <h1 className='font-bold text-md'>Education</h1>
          <div className='flex items-center gap-2 flex-wrap'>
            {Array.isArray(user?.profile?.education) && user.profile.education.length > 0
              ? user.profile.education.map((item, index) => (
                <span key={index} className='px-3 py-1.5 bg-purple-100 text-purple-800 text-sm rounded-full shadow-sm hover:shadow-md transition'>
                  {item}
                </span>
              ))
              : <span>NA</span>}
          </div>
        </div>

        {/* Resume */}
        {isJobSeeker && (
          <div className='grid w-full max-w-sm items-center gap-1.5'>
            <Label className='text-md font-bold'>Resume</Label>
            {user?.profile?.resume ? (
              <a target='_blank' rel='noopener noreferrer' href={user?.profile?.resume} className='text-blue-500 hover:underline'>
                {user?.profile?.resumeOriginalName}
              </a>
            ) : (
              <span>NA</span>
            )}
          </div>
        )}
      </div>

      {/* Applied Jobs */}
      {isJobSeeker && (
        <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
          <h1 className='font-bold text-lg my-5 pl-3 pt-4'>Applied Jobs</h1>
          <AppliedJobTable />
        </div>
      )}

      {/* Posted Jobs */}
      {isRecruiter && (
        <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
          <h1 className='font-bold text-lg my-5 pl-3 pt-4'>Your Posted Jobs</h1>
          <PostedJobTable />
        </div>
      )}

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={(val) => {
        setShowDeleteDialog(val);
        if (!val) {
          setOtpSent(false);
          setOtp("");
          setMessage("");
          setTimer(0);
        }
      }}>
        <div className="max-w-4xl mx-auto mt-10 p-6 border-t border-red-200 text-center">
          <h2 className="text-red-600 font-semibold mb-2 text-lg">
            ⚠️ Danger Zone
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Deleting your account is permanent and cannot be undone.
          </p>
          <DialogTrigger asChild>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account Permanently
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Account Deletion</DialogTitle>
          </DialogHeader>

          {!otpSent && (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Are you absolutely sure? This will permanently remove your account and all data.
              </p>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={sendOtpToEmail} disabled={sendingOtp}>
                  {sendingOtp ? "Sending OTP..." : "Send OTP"}
                </Button>
              </DialogFooter>
            </>
          )}

          {otpSent && (
            <>
              <p className="text-sm text-gray-600 mb-2">
                OTP sent to your email. Enter it below to confirm:
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-2 border rounded mt-2"
                placeholder="Enter OTP"
              />
             
              {timer > 0 ? (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-sm text-gray-600">Expires in</span>
                  <CircularCountdown duration={60} timeLeft={timer} />
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={sendOtpToEmail} className="mt-2">
                  Resend OTP
                </Button>
              )}

              <DialogFooter className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteAccount}
                  disabled={loading || otp.length !== 6}
                >
                  {/* Confirm & Delete */}
                  {loading ? "Deleting..." : "Confirm Delete"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
