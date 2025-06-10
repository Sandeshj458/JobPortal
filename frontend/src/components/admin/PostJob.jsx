// import React, { useState } from 'react';
// import Navbar from '../shared/Navbar';
// import { Label } from '../ui/label';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { useSelector } from 'react-redux';
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectValue
// } from '../ui/select';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { JOB_API_END_POINT } from '@/utils/constant';
// import { toast } from 'sonner';
// import { Loader2 } from 'lucide-react';

// const PostJob = () => {
//     const [input, setInput] = useState({
//         title: "",
//         description: "",
//         requirements: "",
//         salary: "",
//         salaryUnit: "",
//         salaryDuration: "",
//         location: "",
//         jobType: "",
//         experience: "",
//         position: 0,
//         companyId: ""
//     });

//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const { companies } = useSelector(store => store.company);

//     const changeEventHandler = (e) => {
//         const { name, value } = e.target;
//         setInput(prev => ({ ...prev, [name]: value }));
//     };

//     const selectChangeHandler = (value) => {
//         const selectedCompany = companies.find(c => c.name.toLowerCase() === value);
//         if (selectedCompany) {
//             setInput(prev => ({ ...prev, companyId: selectedCompany._id }));
//         }
//     };

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const salaryValue = parseFloat(input.salary);
//             if (isNaN(salaryValue)) {
//                 toast.error("Please enter a valid numeric salary.");
//                 setLoading(false);
//                 return;
//             }

//             if (!input.salaryUnit || !input.salaryDuration) {
//                 toast.error("Please select both salary unit and duration.");
//                 setLoading(false);
//                 return;
//             }

//             if (!input.companyId) {
//                 toast.error("Please select a company.");
//                 setLoading(false);
//                 return;
//             }

//             const finalSalary = `${salaryValue}${input.salaryUnit}${input.salaryDuration}`;
//             const payload = { ...input, salary: finalSalary };

//             const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
//                 headers: { 'Content-Type': 'application/json' },
//                 withCredentials: true
//             });

//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 navigate("/admin/jobs");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Failed to post job');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <Navbar />
//             <div className='flex items-center justify-center w-screen my-5s'>
//                 <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md mt-6 bg-white'>
//                     <div className='grid grid-cols-2 gap-4'>
//                         <div className="mb-4">
//                             <Label>Title</Label>
//                             <Input type="text" name="title" value={input.title} onChange={changeEventHandler} required />
//                         </div>
//                         <div className="mb-4">
//                             <Label>Description</Label>
//                             <Input type="text" name="description" value={input.description} onChange={changeEventHandler} required />
//                         </div>
//                         <div className="mb-4">
//                             <Label>Requirements</Label>
//                             <Input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} required />
//                         </div>
//                         <div className="mb-4">
//                             <Label>Salary</Label>
//                             <Input type="number" name="salary" value={input.salary} onChange={changeEventHandler} required />
//                         </div>
//                         <div className="flex gap-2 mb-4">
//                             <div>
//                                 <Label>Unit</Label>
//                                 <Select onValueChange={(value) => setInput(prev => ({ ...prev, salaryUnit: value }))}>
//                                     <SelectTrigger className="w-[100px]">
//                                         <SelectValue placeholder="Unit" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="K">K</SelectItem>
//                                         <SelectItem value="Lakhs">Lakhs</SelectItem>
//                                         <SelectItem value="Cr">Cr</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div>
//                                 <Label>Duration</Label>
//                                 <Select onValueChange={(value) => setInput(prev => ({ ...prev, salaryDuration: value }))}>
//                                     <SelectTrigger className="w-[100px]">
//                                         <SelectValue placeholder="Duration" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="/month">/month</SelectItem>
//                                         <SelectItem value="/year">/year</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>
//                         <div className="mb-4">
//                             <Label>Location</Label>
//                             <Input type="text" name="location" value={input.location} onChange={changeEventHandler} required />
//                         </div>
//                         <div className="mb-4">
//                             <Label>Job Type</Label>
//                             <Select onValueChange={(value) => setInput(prev => ({ ...prev, jobType: value }))}>
//                                 <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Select job type" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="Full-time">Full-time</SelectItem>
//                                     <SelectItem value="Part-time">Part-time</SelectItem>
//                                     <SelectItem value="Temporary">Temporary</SelectItem>
//                                     <SelectItem value="Contract">Contract</SelectItem>
//                                     <SelectItem value="Remote">Remote</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div className="mb-4">
//                             <Label>Experience Level</Label>
//                             <Input type="text" name="experience" value={input.experience} onChange={changeEventHandler} required />
//                         </div>
//                         <div className="mb-4">
//                             <Label>No of Positions</Label>
//                             <Input type="number" name="position" value={input.position} onChange={changeEventHandler} required />
//                         </div>
//                         {
//                             companies.length > 0 && (
//                                 <div className="mb-4">
//                                     <Label>Select Company</Label>
//                                     <Select onValueChange={selectChangeHandler}>
//                                         <SelectTrigger className="w-[180px]">
//                                             <SelectValue placeholder="Select a Company" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectGroup>
//                                                 {
//                                                     companies.map((company) => (
//                                                         <SelectItem key={company._id} value={company.name.toLowerCase()}>
//                                                             {company.name}
//                                                         </SelectItem>
//                                                     ))
//                                                 }
//                                             </SelectGroup>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                             )
//                         }
//                     </div>
//                     {
//                         loading
//                             ? <Button className='w-full my-4' disabled>
//                                 <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
//                             </Button>
//                             : <Button type='submit' className='w-full my-4'>Post New Job</Button>
//                     }
//                     {
//                         companies.length === 0 &&
//                         <p className='text-xs text-red-600 font-bold text-center my-3'>
//                             Please register a company first before posting a job
//                         </p>
//                     }
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default PostJob;

import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../ui/select';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { showSuccessToast, showErrorToast } from "@/utils/toast";


const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        salaryUnit: "",
        salaryDuration: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: "",
        expiredDate: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find(c => c.name.toLowerCase() === value);
        if (selectedCompany) {
            setInput(prev => ({ ...prev, companyId: selectedCompany._id }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        // ✅ Trim input fields before validation
        const trimmedInput = {
            ...input,
            title: input.title.trim(),
            description: input.description.trim(),
            requirements: input.requirements.trim(),
            salary: input.salary.trim(),
            location: input.location.trim(),
            jobType: input.jobType.trim(),
            experience: input.experience.trim(),
            expiredDate: input.expiredDate.trim(),
        };

        // ✅ Validate all required fields
        if (!trimmedInput.title || !trimmedInput.description || !trimmedInput.requirements ||
            !trimmedInput.salary || !trimmedInput.location || !trimmedInput.jobType ||
            !trimmedInput.experience || !trimmedInput.position || !trimmedInput.companyId || !trimmedInput.expiredDate) {
            toast.error("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        // ✅ Salary validation
        const salaryValue = parseFloat(trimmedInput.salary);
        if (isNaN(salaryValue) || salaryValue <= 0) {
            // toast.error("Salary must be a valid number greater than 0.");
            showErrorToast("Salary must be a valid number greater than 0.");
            setLoading(false);
            return;
        }

        // ✅ Experience validation
        const experienceValue = parseFloat(trimmedInput.experience);
        if (isNaN(experienceValue) || experienceValue < 0) {
            // toast.error("Experience must be a valid non-negative number.");
            showErrorToast("Experience must be a valid non-negative number.");
            setLoading(false);
            return;
        }

        // ✅ Position validation
        if (trimmedInput.position <= 0) {
            // toast.error("Number of positions must be greater than 0.");
            showErrorToast("Number of positions must be greater than 0.");
            setLoading(false);
            return;
        }

        // ✅ Salary unit and duration validation
        if (!input.salaryUnit || !input.salaryDuration) {
            // toast.error("Please select both salary unit and duration.");
            showErrorToast("Please select both salary unit and duration.");
            setLoading(false);
            return;
        }

        // ✅ Expire date validation (must be a future date)
        const today = new Date();
        const expireDate = new Date(trimmedInput.expiredDate);
        if (expireDate <= today) {
            showErrorToast("Expire date must be a future date.");
            setLoading(false);
            return;
        }

        try {
            const finalSalary = `${salaryValue}${input.salaryUnit}${input.salaryDuration}`;
            const payload = {
                ...trimmedInput,
                salary: finalSalary,
                experience: experienceValue
            };

            const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (res.data.success) {
                // toast.success(res.data.message);
                showSuccessToast(res.data.message)
                navigate("/admin/jobs");
            }
        } catch (error) {
            // toast.error(error.response?.data?.message || 'Failed to post job');
            showErrorToast(error.response?.data?.message || 'Failed to post job')
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5s'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md mt-6 bg-white'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="mb-4">
                            <Label>Title</Label>
                            <Input type="text" name="title" value={input.title} onChange={changeEventHandler} required />
                        </div>
                        <div className="mb-4">
                            <Label>Description</Label>
                            <Input type="text" name="description" value={input.description} onChange={changeEventHandler} required />
                        </div>
                        <div className="mb-4">
                            <Label>Requirements</Label>
                            <Input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} required />
                        </div>
                        <div className="mb-4">
                            <Label>Salary</Label>
                            <Input type="number" name="salary" value={input.salary} onChange={changeEventHandler} required />
                        </div>
                        <div className="flex gap-2 mb-4">
                            <div>
                                <Label>Unit</Label>
                                <Select onValueChange={(value) => setInput(prev => ({ ...prev, salaryUnit: value }))}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="K">K</SelectItem>
                                        <SelectItem value="Lakhs">Lakhs</SelectItem>
                                        <SelectItem value="Cr">Cr</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Duration</Label>
                                <Select onValueChange={(value) => setInput(prev => ({ ...prev, salaryDuration: value }))}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="/month">/month</SelectItem>
                                        <SelectItem value="/year">/year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mb-4">
                            <Label>Location</Label>
                            <Input type="text" name="location" value={input.location} onChange={changeEventHandler} required />
                        </div>
                        <div className="mb-4">
                            <Label>Job Type</Label>
                            <Select onValueChange={(value) => setInput(prev => ({ ...prev, jobType: value }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Temporary">Temporary</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-4">
                            <Label>Experience Level</Label>
                            <Input type="text" name="experience" value={input.experience} onChange={changeEventHandler} required />
                        </div>
                        <div className="mb-4">
                            <Label>No of Positions</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler} required />
                        </div>

                        <div className="mb-4">
                            <Label>Expire Date</Label>
                            <Input type="date" name="expiredDate" value={input.expiredDate} onChange={changeEventHandler} required />
                        </div>

                        {
                            companies.length > 0 && (
                                <div className="mb-4 col-span-2">
                                    <Label>Select Company</Label>
                                    <Select onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    companies.map((company) => (
                                                        <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                            {company.name}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div>
                    {
                        loading
                            ? <Button className='w-full my-4' disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                            : <Button type='submit' className='w-full my-4'>Post New Job</Button>
                    }
                    {
                        companies.length === 0 &&
                        <p className='text-xs text-red-600 font-bold text-center my-3'>
                            Please register a company first before posting a job
                        </p>
                    }
                </form>
            </div>
        </div>
    );
};

export default PostJob;
