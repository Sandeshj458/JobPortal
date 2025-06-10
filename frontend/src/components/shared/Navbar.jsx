// // import React from 'react'
// // import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
// // import { Button } from '../ui/button'
// // import { Avatar, AvatarImage } from '../ui/avatar'
// // import { LogOut, User2 } from 'lucide-react'
// // import { Link, useNavigate } from 'react-router-dom'
// // import { useDispatch, useSelector } from 'react-redux'
// // import { toast } from 'sonner'
// // import { USER_API_END_POINT } from '@/utils/constant'
// // import axios from 'axios'
// // import { setUser } from '@/redux/authSlice'
// // import { showSuccessToast, showErrorToast } from "@/utils/toast";
// // import logo from '@/utils/Logo.jpg';


// // const Navbar = () => {
// //     const { user } = useSelector(store => store.auth);
// //     const dispatch = useDispatch();
// //     const navigate = useNavigate();

// //     const logoutHandler = async () => {
// //         try {
// //             const res = await axios.get(`${USER_API_END_POINT}/logout`,
// //                 {
// //                     withCredentials: true
// //                 }
// //             );

// //             if (res.data.success) {
// //                 dispatch(setUser(null));
// //                 navigate("/");
// //                 // toast.success(res.data.message);
// //                 showSuccessToast(res.data.message);
// //             }
// //         } catch (error) {
// //             console.log(error);
// //             // toast.error(error.response.data.message);
// //             showErrorToast(error.response.data.message);
// //         }
// //     }
// //     return (
// //         <div className='bg-white'>
// //             <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
// //                 <div className='flex items-center gap-3'>
// //                      <img src={logo} alt="JobPortal Logo" className='h-10 w-auto' />
// //                     <h1 className='text-2xl font-bold'> Job<span className='text-[#F83002]'>Portal</span> </h1>
// //                 </div>

// //                 <div className='flex items-center gap-12'>
// //                     <ul className='flex font-medium items-center gap-5'>
// //                         {
// //                             user && user.role == 'recruiter' ? (
// //                                 <>
// //                                     <li> <Link to='/admin/companies'>Companies</Link> </li>
// //                                     <li> <Link to='/admin/jobs'>Jobs</Link> </li>
// //                                 </>
// //                             ) : (
// //                                 <>
// //                                     <li> <Link to='/'>Home</Link> </li>
// //                                     <li> <Link to='/jobs'>Jobs</Link> </li>
// //                                     <li> <Link to='/browse'>Browse</Link> </li>
// //                                 </>
// //                             )
// //                         }
// //                     </ul>
// //                     {
// //                         !user ? (
// //                             <div className='flex items-center gap-2'>
// //                                 <Link to='/login'> <Button variant='outline'>Login</Button> </Link>
// //                                 <Link to='/signup'> <Button className='bg-[#6A38C2] hover:bg-[#5b30a6]'>Signup</Button> </Link>
// //                             </div>
// //                         ) : (
// //                             <Popover>
// //                                 <PopoverTrigger asChild>
// //                                     <Avatar className='cursor-pointer'>
// //                                         <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
// //                                     </Avatar>
// //                                 </PopoverTrigger>
// //                                 <PopoverContent className='w-80'>
// //                                     <div className=''>
// //                                         <div className='flex gap-4 space-y-2'>
// //                                             <Avatar className='cursor-pointer'>
// //                                                 <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
// //                                             </Avatar>
// //                                             <div>
// //                                                 <h4 className='font-medium'>{user?.fullname}</h4>
// //                                                 <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
// //                                             </div>
// //                                         </div>

// //                                         <div className='flex flex-col my-2 text-gray-600'>
// //                                             {
// //                                                 user && user.role == 'jobseeker' && (
// //                                                     <div className='flex w-fit items-center gap-2 cursor-pointer'>
// //                                                         <User2 />
// //                                                         <Button variant='link'> <Link to='/profile'>View Profile</Link> </Button>
// //                                                     </div>
// //                                                 )
// //                                             }
// //                                             <div className='flex w-fit items-center gap-2 cursor-pointer'>
// //                                                 <LogOut />
// //                                                 <Button onClick={logoutHandler} variant='link'>Logout</Button>
// //                                             </div>
// //                                         </div>

// //                                     </div>

// //                                 </PopoverContent >
// //                             </Popover>
// //                         )
// //                     }


// //                 </div>
// //             </div>

// //         </div >
// //     )
// // }

// // export default Navbar

// import React from 'react'
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover' // you can remove these if not needed anymore
// import { Button } from '../ui/button'
// import { Avatar, AvatarImage } from '../ui/avatar'
// import { LogOut, User2 } from 'lucide-react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { toast } from 'sonner'
// import { USER_API_END_POINT } from '@/utils/constant'
// import axios from 'axios'
// import { setUser } from '@/redux/authSlice'
// import { showSuccessToast, showErrorToast } from "@/utils/toast";
// import logo from '@/utils/Logo.jpg';

// const Navbar = () => {
//     const { user } = useSelector(store => store.auth);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const logoutHandler = async () => {
//         try {
//             const res = await axios.get(`${USER_API_END_POINT}/logout`,
//                 {
//                     withCredentials: true
//                 }
//             );

//             if (res.data.success) {
//                 dispatch(setUser(null));
//                 navigate("/");
//                 showSuccessToast(res.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             showErrorToast(error.response.data.message);
//         }
//     }

//     return (
//         <div className='bg-white'>
//             <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
//                 <div className='flex items-center gap-3'>
//                     <img src={logo} alt="JobPortal Logo" className='h-10 w-auto' />
//                     <h1 className='text-2xl font-bold'> Job<span className='text-[#F83002]'>Portal</span> </h1>
//                 </div>

//                 <div className='flex items-center gap-12'>
//                     <ul className='flex font-medium items-center gap-5'>
//                         {
//                             user && user.role === 'recruiter' ? (
//                                 <>
//                                     <li><Link to='/admin/companies'>Companies</Link></li>
//                                     <li><Link to='/admin/jobs'>Jobs</Link></li>
//                                 </>
//                             ) : (
//                                 <>
//                                     <li><Link to='/'>Home</Link></li>
//                                     <li><Link to='/jobs'>Jobs</Link></li>
//                                     <li><Link to='/browse'>Browse</Link></li>
//                                 </>
//                             )
//                         }

//                         {/* New Help Link - visible for all users, logged in or not */}
//                         <li>
//                             <Link to="/help" className="text-blue-600 hover:underline font-semibold">
//                                 Help
//                             </Link>
//                         </li>
//                     </ul>

//                     {
//                         !user ? (
//                             <div className='flex items-center gap-2'>
//                                 <Link to='/login'> <Button variant='outline'>Login</Button> </Link>
//                                 <Link to='/signup'> <Button className='bg-[#6A38C2] hover:bg-[#5b30a6]'>Signup</Button> </Link>
//                             </div>
//                         ) : (
//                             // Keep your existing user avatar & popover or customize here
//                             <Popover>
//                                 <PopoverTrigger asChild>
//                                     <Avatar className='cursor-pointer'>
//                                         <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
//                                     </Avatar>
//                                 </PopoverTrigger>
//                                 <PopoverContent className='w-80'>
//                                     <div>
//                                         <div className='flex gap-4 space-y-2'>
//                                             <Avatar className='cursor-pointer'>
//                                                 <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
//                                             </Avatar>
//                                             <div>
//                                                 <h4 className='font-medium'>{user?.fullname}</h4>
//                                                 <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
//                                             </div>
//                                         </div>

//                                         <div className='flex flex-col my-2 text-gray-600'>
//                                             {
//                                                 user && user.role === 'jobseeker' && (
//                                                     <div className='flex w-fit items-center gap-2 cursor-pointer'>
//                                                         <User2 />
//                                                         <Button variant='link'> <Link to='/profile'>View Profile</Link> </Button>
//                                                     </div>
//                                                 )
//                                             }
//                                             <div className='flex w-fit items-center gap-2 cursor-pointer'>
//                                                 <LogOut />
//                                                 <Button onClick={logoutHandler} variant='link'>Logout</Button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </PopoverContent >
//                             </Popover>
//                         )
//                     }
//                 </div>
//             </div>
//         </div >
//     )
// }

// export default Navbar


// import React from 'react'
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
// import { Button } from '../ui/button'
// import { Avatar, AvatarImage } from '../ui/avatar'
// import { LogOut, User2, HelpCircle } from 'lucide-react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios'
// import { setUser } from '@/redux/authSlice'
// import { showSuccessToast, showErrorToast } from '@/utils/toast'
// import { USER_API_END_POINT } from '@/utils/constant'
// import logo from '@/utils/Logo.jpg'

// const Navbar = () => {
//   const { user } = useSelector(store => store.auth)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const logoutHandler = async () => {
//     try {
//       const res = await axios.get(`${USER_API_END_POINT}/logout`, {
//         withCredentials: true,
//       })

//       if (res.data.success) {
//         dispatch(setUser(null))
//         navigate('/')
//         showSuccessToast(res.data.message)
//       }
//     } catch (error) {
//       console.log(error)
//       showErrorToast(error.response?.data?.message || 'Logout failed')
//     }
//   }

//   return (
//     <div className="bg-white shadow-sm">
//       <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center gap-3">
//           <img src={logo} alt="JobPortal Logo" className="h-10 w-auto" />
//           <h1 className="text-2xl font-bold">
//             Job<span className="text-[#F83002]">Portal</span>
//           </h1>
//         </div>

//         <div className="flex items-center gap-12">
//           <ul className="flex font-medium items-center gap-5">
//             {user && user.role === 'recruiter' ? (
//               <>
//                 <li>
//                   <Link to="/admin/companies" className="hover:text-[#F83002] transition">
//                     Companies
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/admin/jobs" className="hover:text-[#F83002] transition">
//                     Jobs
//                   </Link>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li>
//                   <Link to="/" className="hover:text-[#F83002] transition">
//                     Home
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/jobs" className="hover:text-[#F83002] transition">
//                     Jobs
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/browse" className="hover:text-[#F83002] transition">
//                     Browse
//                   </Link>
//                 </li>
//               </>
//             )}

//             {/* Simple Help Button */}
//             <li>
//               <Link
//                 to="/help"
//                 className="
//                   inline-flex items-center gap-1
//                   bg-violet-300 text-white font-semibold
//                   rounded-full px-4 py-1.5
//                   shadow-md
//                   hover:bg-violet-400
//                   transition
//                   select-none
//                   text-sm sm:text-base
               
//                 "
//               >
//                 <HelpCircle className="w-5 h-5" />
//                 Help
//               </Link>
//             </li>
//           </ul>

//           {!user ? (
//             <div className="flex items-center gap-2">
//               <Link to="/login">
//                 <Button variant="outline">Login</Button>
//               </Link>
//               <Link to="/signup">
//                 <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
//               </Link>
//             </div>
//           ) : (
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Avatar className="cursor-pointer">
//                   <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
//                 </Avatar>
//               </PopoverTrigger>
//               <PopoverContent className="w-80">
//                 <div>
//                   <div className="flex gap-4 space-y-2">
//                     <Avatar className="cursor-pointer">
//                       <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
//                     </Avatar>
//                     <div>
//                       <h4 className="font-medium">{user?.fullname}</h4>
//                       <p className="text-sm text-muted-foreground">{user?.profile?.bio}</p>
//                     </div>
//                   </div>

//                   <div className="flex flex-col my-2 text-gray-600">
//                     {user && user.role === 'jobseeker' && (
//                       <div className="flex w-fit items-center gap-2 cursor-pointer">
//                         <User2 />
//                         <Button variant="link">
//                           <Link to="/profile">View Profile</Link>
//                         </Button>
//                       </div>
//                     )}
//                     <div className="flex w-fit items-center gap-2 cursor-pointer">
//                       <LogOut />
//                       <Button onClick={logoutHandler} variant="link">
//                         Logout
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </PopoverContent>
//             </Popover>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Navbar


import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, HelpCircle, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '@/redux/authSlice'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import { USER_API_END_POINT } from '@/utils/constant'
import logo from '@/utils/Logo.jpg'

const Navbar = () => {
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      })

      if (res.data.success) {
        dispatch(setUser(null))
        navigate('/')
        showSuccessToast(res.data.message)
      }
    } catch (error) {
      console.log(error)
      showErrorToast(error.response?.data?.message || 'Logout failed')
    }
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="JobPortal Logo" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold select-none">
              Job<span className="text-[#F83002]">Portal</span>
            </h1>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="text-gray-700 hover:focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Nav Links & Buttons */}
          <div className="hidden sm:flex sm:items-center sm:gap-12">
            <ul className="flex font-medium items-center gap-5 select-none">
              {user && user.role === 'recruiter' ? (
                <>
                  <li>
                    <Link
                      to="/admin/companies"
                    //   className="hover:text-[#F83002] transition"
                    >
                      Companies
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/jobs"
                    //   className="hover:text-[#F83002] transition"
                    >
                      Jobs
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/jobs">
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to="/browse">
                      Browse
                    </Link>
                  </li>
                </>
              )}

              {/* Help Button */}
              <li>
                <Link
                  to="/help"
                //   className="
                //     inline-flex items-center gap-1
                //     bg-violet-300 text-white font-semibold
                //     rounded-full px-4 py-1.5
                //     shadow-md
                //     hover:bg-violet-400
                //     transition
                //     select-none
                //     text-sm sm:text-base
                //   "
                >
                  {/* <HelpCircle className="w-5 h-5" /> */}
                  Help
                </Link>
              </li>
            </ul>

            {/* Auth buttons or avatar */}
            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="@shadcn"
                    />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div>
                    <div className="flex gap-4 space-y-2">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt="@shadcn"
                        />
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user?.fullname}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user?.profile?.bio}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col my-2 text-gray-600">
                      {user && user.role === 'jobseeker' && (
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <User2 />
                          <Button variant="link">
                            <Link to="/profile">View Profile</Link>
                          </Button>
                        </div>
                      )}
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <LogOut />
                        <Button onClick={logoutHandler} variant="link">
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 shadow-md">
          <ul className="flex flex-col px-4 pt-4 pb-6 gap-4 font-medium select-none">
            {user && user.role === 'recruiter' ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    Browse
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                to="/help"
                onClick={() => setMobileMenuOpen(false)}
                // className="inline-flex items-center gap-1 bg-violet-300 text-white font-semibold rounded-full px-4 py-1.5 shadow-md hover:bg-violet-400 transition text-sm"
              >
                {/* <HelpCircle className="w-5 h-5" /> */}
                Help
              </Link>
            </li>

            {!user ? (
              <>
                <li>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] w-full">
                      Signup
                    </Button>
                  </Link>
                </li>
              </>
            ) : (
              <li className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="@shadcn"
                    />
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.fullname}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>

                {user && user.role === 'jobseeker' && (
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sky-400"
                  >
                    <User2 />
                    View Profile
                  </Link>
                )}

                <button
                  onClick={() => {
                    logoutHandler()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
                >
                  <LogOut />
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar
