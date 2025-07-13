import React, { useState, useEffect } from 'react';
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
import { useDispatch } from 'react-redux'; // ✅ (Line 7) Added useDispatch
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import useGetCompanyById from "@/hooks/useGetAllCompanies"; // or use relative path
import { fetchAllJobs } from '@/hooks/jobActins';
import { setAllJobs } from '@/redux/jobSlice';



const UpdateJobForm = () => {

    useGetCompanyById(); // ✅ fetches and sets companies in Redux

    const dispatch = useDispatch(); // ✅ (Line 27) Initialized useDispatch

    const params = useParams();
    const jobId = params.id;


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
        expiredDate: "",
        education: "",
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);

    useEffect(() => {

        // Fetch job details to prefill the form for update
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true  // required to send cookies
                });
                if (res.data.success) {
                    const job = res.data.job;

                    const salaryRegex = /^(\d+\.?\d*)(K|Lakhs|Cr)(\/month|\/year)$/;
                    const salaryMatch = job.salary.match(salaryRegex);

                    setInput({
                        title: job.title || "",
                        description: job.description || "",
                        requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : (job.requirements || ""),
                        salary: salaryMatch ? salaryMatch[1] : "",
                        salaryUnit: salaryMatch ? salaryMatch[2] : "",
                        salaryDuration: salaryMatch ? salaryMatch[3] : "",
                        location: job.location || "",
                        jobType: job.jobType || "",
                        experience: job.experienceLevel?.toString() || "",
                        position: job.position || 0,
                        companyId: job.company || "",
                        expiredDate: job.expiredDate ? job.expiredDate.split('T')[0] : "",
                        education: Array.isArray(job.education) ? job.education.join(", ") : (job.education || ""),

                    });
                } else {
                    showErrorToast("Failed to fetch job data");

                }
            } catch (error) {
                showErrorToast(error.response?.data?.message || "Failed to fetch job data");
            } finally {
                setFetching(false);
            }
        };

        fetchJob();
    }, [jobId]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find(c => c._id === value);
        if (selectedCompany) {
            setInput(prev => ({ ...prev, companyId: selectedCompany._id }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Trim input fields before validation
        const trimmedInput = {
            ...input,
            title: input.title.trim(),
            description: input.description.trim(),
            requirements: typeof input.requirements === 'string'
                ? input.requirements.split(',').map(item => item.trim()).filter(item => item)
                : [],

            salary: input.salary.trim(),
            location: input.location.trim(),
            jobType: input.jobType.trim(),
            experience: input.experience.trim(),
            expiredDate: input.expiredDate.trim(),
            education: typeof input.education === 'string'
                ? input.education
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item) // remove empty strings
                : [],

        };

        if (!trimmedInput.title || !trimmedInput.description || !trimmedInput.requirements ||
            !trimmedInput.salary || !trimmedInput.location || !trimmedInput.jobType ||
            !trimmedInput.experience || !trimmedInput.position || !trimmedInput.companyId || !trimmedInput.expiredDate || !trimmedInput.education) {
            showErrorToast("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        const salaryValue = parseFloat(trimmedInput.salary);
        if (isNaN(salaryValue) || salaryValue <= 0) {
            showErrorToast("Salary must be a valid number greater than 0.");
            setLoading(false);
            return;
        }

        const experienceValue = parseFloat(trimmedInput.experience);
        if (isNaN(experienceValue) || experienceValue < 0) {
            showErrorToast("Experience must be a valid non-negative number.");
            setLoading(false);
            return;
        }

        if (trimmedInput.position <= 0) {
            showErrorToast("Number of positions must be greater than 0.");
            setLoading(false);
            return;
        }

        if (!input.salaryUnit || !input.salaryDuration) {
            showErrorToast("Please select both salary unit and duration.");
            setLoading(false);
            return;
        }

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

            const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (res.data.success) {
                showSuccessToast(res.data.message);

                // ✅ (Line ~175) Replace fetchAllJobs with manual dispatch using setAllJobs
                const allJobsRes = await axios.get(`${JOB_API_END_POINT}/get`, {
                    withCredentials: true,
                });
                dispatch(setAllJobs(allJobsRes.data.jobs)); // ✅ Update Redux store

                navigate("/admin/jobs");
            }
        } catch (error) {
            showErrorToast(error.response?.data?.message || 'Failed to update job');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            
            <div className='flex items-center justify-center w-full overflow-x-hidden'>
                <form onSubmit={submitHandler} className='p-4 sm:p-6 md:p-8 w-full max-w-4xl border border-gray-200 shadow-lg rounded-md mt-6 bg-white'>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

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
                            <Label>Education</Label>
                            <Input type="text" name="education" value={input.education} onChange={changeEventHandler} required />
                        </div>
                        <div className="mb-4">
                            <Label>Salary</Label>
                            <Input type="number" name="salary" value={input.salary} onChange={changeEventHandler} required />
                        </div>
                        <div className="flex gap-2 mb-4">
                            <div>
                                <Label>Unit</Label>
                                <Select value={input.salaryUnit} onValueChange={(value) => setInput(prev => ({ ...prev, salaryUnit: value }))}>
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
                                <Select value={input.salaryDuration} onValueChange={(value) => setInput(prev => ({ ...prev, salaryDuration: value }))}>
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
                            <Select value={input.jobType} onValueChange={(value) => setInput(prev => ({ ...prev, jobType: value }))}>
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
                                    <Select value={input.companyId} onValueChange={selectChangeHandler} disabled>
                                        <SelectTrigger className="w-full disabled">
                                            <SelectValue placeholder="Select a Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    companies.map((company) => (
                                                        <SelectItem key={company._id} value={company._id}>
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
                            : <Button type='submit' className='w-full my-4'>Update Job</Button>
                    }
                    {
                        companies.length === 0 &&
                        <p className='text-xs text-red-600 font-bold text-center my-3'>
                            Please register a company first before updating a job
                        </p>
                    }
                </form>
            </div>
        </div>
    );
};

export default UpdateJobForm;
