import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

const Signup = () => {
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
    file: '',
    education: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullname', input.fullname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('password', input.password);
    formData.append('role', input.role);
    formData.append('education', input.education);
    if (input.file) {
      formData.append('file', input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate('/login');
        showSuccessToast(res.data.message);
      }
    } catch (error) {
      console.log(error);
      showErrorToast(error.response?.data?.message || 'Something went wrong.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-xl mt-12 bg-white p-8 rounded-xl shadow-md"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h1>

          {/* Full Name */}
          <div className="mb-4">
            <Label className="mb-1 block text-gray-700">Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Enter your full name"
              required
              className="w-full"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label className="mb-1 block text-gray-700">Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              required
              className="w-full"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <Label className="mb-1 block text-gray-700">Phone Number</Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="Enter your phone number"
              required
              className="w-full"
            />
          </div>

          {/* Password with Toggle */}
          <div className="mb-4 relative">
            <Label className="mb-1 block text-gray-700">Password</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
              required
              className="pr-10 w-full"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>


          {/* Education */}
          <div className="mb-4">
            <Label className="mb-1 block text-gray-700">Education</Label>
            <Input
              type="text"
              value={input.education}
              name="education"
              onChange={changeEventHandler}
              placeholder="Enter your qualification"
              required
              className="w-full"
            />
          </div>


          {/* Role Selection */}
          <div className="mb-4">
            <Label className="mb-2 block text-gray-700">Register As</Label>
            <RadioGroup className="flex gap-6">
              <label className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="jobseeker"
                  checked={input.role === 'jobseeker'}
                  onChange={changeEventHandler}
                  className="cursor-pointer w-4 h-4"
                />
                <span className="text-gray-700 text-sm">Job Seeker</span>
              </label>
              <label className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === 'recruiter'}
                  onChange={changeEventHandler}
                  className="cursor-pointer w-4 h-4"
                />
                <span className="text-gray-700 text-sm">Recruiter</span>
              </label>
            </RadioGroup>
          </div>

          {/* Profile Upload (separate line) */}
          <div className="mb-6">
            <Label className="text-gray-700 mb-1 block">Profile</Label>
            <Input
              accept="image/*"
              type="file"
              onChange={changeFileHandler}
              className="cursor-pointer"
              required
            />
          </div>

          {/* Submit Button */}
          {loading ? (
            <Button className="w-full flex justify-center items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Signup
            </Button>
          )}

          {/* Login Link */}
          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
