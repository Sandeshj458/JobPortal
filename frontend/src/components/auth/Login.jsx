// import React, { useEffect, useState } from 'react'
// import Navbar from '../shared/Navbar'
// import { Label } from '../ui/label'
// import { Input } from '../ui/input'
// import { RadioGroup } from '../ui/radio-group'
// import { Button } from '../ui/button'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { USER_API_END_POINT } from '@/utils/constant'
// // import { toast } from 'sonner'
// import { useDispatch, useSelector } from 'react-redux'
// import { setLoading, setUser } from '@/redux/authSlice'
// import { Loader2 } from 'lucide-react'
// import { showSuccessToast, showErrorToast } from "@/utils/toast";

// const Login = () => {

//     const [input, setInput] = useState({
//         email: "",
//         password: "",
//         role: "",
//     });

//     const { loading, user } = useSelector(store => store.auth);
//     const dispatch = useDispatch();  // used for loading after click on login button

//     const navigate = useNavigate();

//     const changeEventHandler = (e) => {
//         setInput({ ...input, [e.target.name]: e.target.value });
//     }

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         // console.log(input);

//         try {
//             dispatch(setLoading(true));  // loading start from here
//             const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 withCredentials: true
//             });
//             if (res.data.success) {
//                 dispatch(setUser(res.data.user)); // for see the user icon after login insted of login button again
//                 navigate("/");
//                 // toast.success(res.data.message);
//                 showSuccessToast(res.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             // toast.error(error.response.data.message);
//             showErrorToast(error.response.data.message);
//         } finally {
//             dispatch(setLoading(false));  // loading will stop here
//         }
//     }

//     useEffect(() => {
//         if (user) {
//             navigate("/");
//         }
//     }, [])

//     return (
//         <div>
//             <Navbar />
//             <div className='flex items-center justify-center max-w-7xl mx-auto'>
//                 <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 bg-white rounded-md p-4 my-10'>
//                     <h1 className='font-bold text-xl mb-5'>Login</h1>

//                     <div className='my-2'>
//                         <Label>Email</Label>
//                         <Input
//                             type='email'
//                             value={input.email}
//                             name='email'
//                             onChange={changeEventHandler}
//                             placeholder='please enter the email'
//                             required
//                         />
//                     </div>

//                     <div className='my-2'>
//                         <Label>Password</Label>
//                         <Input
//                             type='password'
//                             value={input.password}
//                             name='password'
//                             onChange={changeEventHandler}
//                             placeholder='please enter the password'
//                             required
//                         />
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <RadioGroup className='flex items-center gap-4 my-5'>
//                             <div className="flex items-center space-x-2">
//                                 <Input
//                                     type='radio'
//                                     name='role'
//                                     value='jobseeker'
//                                     checked={input.role == 'jobseeker'}
//                                     onChange={changeEventHandler}
//                                     className='cursor-pointer'
//                                 />
//                                 <Label htmlFor="r1">JobSeeker</Label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <Input
//                                     type='radio'
//                                     name='role'
//                                     value='recruiter'
//                                     checked={input.role == 'recruiter'}
//                                     onChange={changeEventHandler}
//                                     className='cursor-pointer'
//                                 />
//                                 <Label htmlFor="r2">Recruiter</Label>
//                             </div>

//                         </RadioGroup>

//                     </div>

//                     {
//                         loading ? <Button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type='submit' className='w-full my-4'>Login</Button>
//                     }

//                     <span className='text-sm'>Don't have an account? <Link to='/signup' className='text-blue-600'>Signup</Link></span>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Login

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
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    role: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate('/');
        showSuccessToast(res.data.message);
      }
    } catch (error) {
      console.log(error);
      showErrorToast(error.response?.data?.message || 'Login failed');
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
    <div className="min-h-screen bg-gray-100"> {/* ✅ Updated: Background */}
      <Navbar />
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg mt-12 bg-white p-8 rounded-xl shadow-md" // ✅ Updated: Responsive card
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h1> {/* ✅ Updated */}

          {/* Email Field */}
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

          {/* Password Field with Toggle */}
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

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="mb-2 block text-gray-700">Login As</Label>
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

          {/* Login Button */}
          {loading ? (
            <Button className="w-full flex justify-center items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Login
            </Button>
          )}

          {/* Signup Link */}
          <p className="text-sm text-center mt-4 text-gray-600">
            Don't have an account?{' '}
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
