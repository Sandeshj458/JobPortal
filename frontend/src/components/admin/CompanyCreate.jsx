import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { showSuccessToast, showErrorToast } from "@/utils/toast";


const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                showSuccessToast(res.data.message);

                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message) {
                showErrorToast(error.response.data.message);
            } else {
                showErrorToast("Something went wrong while registering the company.");
            }
        }
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='max-w-2xl mx-auto p-4 sm:p-6'>
                <div className='my-6 sm:my-10'>
                    <h1 className='font-bold text-2xl sm:text-3xl text-gray-800'>Your Company Name</h1>
                    <p className='text-gray-500 text-sm sm:text-base'>What would you like to give your company name? you can change this later.</p>
                </div>

                <div className="mb-4">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                        id="companyName"
                        type="text"
                         className="my-2 bg-white w-full"
                        placeholder="Enter the Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-6'>
                    <Button variant="outline" className='bg-white w-full sm:w-auto' onClick={() => navigate("/admin/companies")}>Cancel</Button>
                    <Button  className="w-full sm:w-auto" onClick={registerNewCompany}>Continue</Button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate