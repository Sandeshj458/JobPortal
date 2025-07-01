import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { Eye, EyeOff } from 'lucide-react';
import CircularCountdown from '../shared/CircularCountdown';

const Login = () => {
  const [input, setInput] = useState({ email: '', password: '', role: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showPassword, setShowPassword] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!input.email || !input.password || !input.role) {
      return showErrorToast('Please fill all fields');
    }

    try {
      dispatch(setLoading(true));
      // console.log("Sending OTP to:", `${USER_API_END_POINT}/send-otp`);

      await axios.post(
        `${USER_API_END_POINT}/send-otp`,
        {
          email: input.email,
          // password: input.password,
          password: encryptData(input.password),   // ✅ Encrypt Password
          role: input.role,
          purpose: "login",
        },
        { withCredentials: true }
      );

      setOtpSent(true);
      setTimerExpired(false);
      setTimeLeft(60);
      showSuccessToast('OTP sent to your email');
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      return showErrorToast('Please enter a valid 6-digit OTP');
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/verify-otp`,
        {
          email: input.email,
          // password: input.password,
          password: encryptData(input.password),   // ✅ Encrypt Password
          role: input.role,
          // otp,
          otp: encryptData(otp),                   // ✅ Encrypt OTP
        },
        { withCredentials: true }
      );

      dispatch(setUser(res.data.user));
      localStorage.setItem('token', res.data.token);
      showSuccessToast(res.data.message);
      navigate('/');
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Login failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (otpSent && !timerExpired) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerExpired(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpSent, timerExpired]);

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center px-4">
        <form className="w-full max-w-lg mt-12 bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h1>

          {/* Email */}
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeHandler}
              placeholder="Enter your email"
              required
              disabled={otpSent}
            />
          </div>

          <div className="mb-4 relative">
            <Label>Password</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={input.password}
              onChange={changeHandler}
              placeholder="Enter your password"
              required
              disabled={otpSent}
              className="pr-10"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>


          {/* 👇 Forgot Password link BELOW Login Button and RIGHT aligned */}
          {!otpSent && (
            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          {/* Role */}
          <div className="mb-4">
            <Label>Login As</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="role"
                  value="jobseeker"
                  checked={input.role === 'jobseeker'}
                  onChange={changeHandler}
                  disabled={otpSent}
                  className="w-4 h-4"
                />
                Job Seeker
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === 'recruiter'}
                  onChange={changeHandler}
                  disabled={otpSent}
                  className="w-4 h-4"
                />
                Recruiter
              </label>
            </div>
          </div>

          {/* OTP Section */}
          {otpSent && (
            <div className="mb-6">
              <Label>OTP</Label>
              <div className="flex items-center gap-4 mt-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  disabled={timerExpired || loading}
                  className="w-32 text-center text-lg font-semibold"
                  value={otp}
                  // onChange={(e) => setOtp(e.target.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) setOtp(value); // allow only digits
                  }}
                  placeholder="Enter OTP"
                />
                <CircularCountdown duration={60} timeLeft={timeLeft} />
              </div>
              {timerExpired && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  className="mt-4 w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </span>
                  ) : (
                    'Resend OTP'
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Buttons */}
          {!otpSent ? (
            <Button
              type="button"
              className="w-full mt-4"
              disabled={loading}
              onClick={handleSendOtp}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </span>
              ) : (
                'Send OTP'
              )}
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full mt-4"
              disabled={otp.length !== 6 || loading || timerExpired}
              onClick={handleVerifyOtp}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          )}

          {/* Signup Link */}
          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

