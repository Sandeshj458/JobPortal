import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { showSuccessToast, showErrorToast } from "@/utils/toast";


const companySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null
  });

  const { singleCompany } = useSelector(store => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      !input.name.trim() ||
      !input.description.trim() ||
      !input.website.trim() ||
      !input.location.trim() ||
      !input.file
    ) {
      toast.error("Please fill out all fields and upload a logo.");
      return;
    }
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        showSuccessToast(res.data.message);
        navigate("/admin/companies")
      }
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: singleCompany.file || null
    })
  }, [singleCompany]);

  return (
    <div>
      <Navbar />
      <div className='max-w-xl mx-auto my-10'>
            <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold bg-white">
              <ArrowLeft />
              <span>Back</span>
            </Button>
        <form onSubmit={submitHandler}>
          <div className='flex items-center gap-5 p-8'>
            <h1 className='font-bold text-xl'>Company Setup</h1>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="name"
                className="bg-white"
                value={input.name}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                className="bg-white"
                value={input.description}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div>
              <Label>Website</Label>
              <Input
                type="text"
                name="website"
                className="bg-white"
                value={input.website}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                className="bg-white"
                value={input.location}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div>
              <Label>Logo</Label>
              <Input
                type="file"
                accept="image/*"
                className="bg-white"
                onChange={changeFileHandler}
                required
              />
            </div>
          </div>
          {
            loading ? <Button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type='submit' className='w-full my-4'>Update</Button>
          }
        </form>
      </div>
    </div>
  )
}

export default companySetup