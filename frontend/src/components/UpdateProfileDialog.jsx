import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '@/redux/authSlice'
import { USER_API_END_POINT } from '@/utils/constant'
import { showSuccessToast, showErrorToast } from '@/utils/toast'

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(store => store.auth)

  const isRecruiter = user?.role === 'recruiter'

  const [input, setInput] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills?.join(', ') || '',
    experience: user?.profile?.experience || '',
    education: user?.profile?.education?.join(', ') || '',
    file: null
  })

  const dispatch = useDispatch()

  const changeEventHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const fileChangeHandler = e => {
    const file = e.target.files?.[0]
    setInput({ ...input, file })
  }

  const submitHandler = async e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('fullname', input.fullname)
    formData.append('email', input.email)
    formData.append('phoneNumber', input.phoneNumber)
    formData.append('bio', input.bio)
    formData.append('education', input.education)

    if (!isRecruiter) {
      formData.append('skills', input.skills)
      formData.append('experience', input.experience)
      if (input.file) {
        formData.append('file', input.file)
      }
    }

    try {
      setLoading(true)
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })

      if (res.data.success) {
        dispatch(setUser(res.data.user))
        showSuccessToast(res.data.message)
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
      showErrorToast(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className='grid gap-4 py-4'>

            {/* Name */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>Name</Label>
              <Input
                id='name'
                name='fullname'
                type='text'
                value={input.fullname}
                onChange={changeEventHandler}
                className='col-span-3'
                required
              />
            </div>

            {/* Email */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={input.email}
                disabled
                className='col-span-3'
              />
            </div>

            {/* Phone */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='phoneNumber' className='text-right'>Phone</Label>
              <Input
                id='phoneNumber'
                name='phoneNumber'
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className='col-span-3'
                required
              />
            </div>

            {/* Bio */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='bio' className='text-right'>Bio</Label>
              <Input
                id='bio'
                name='bio'
                value={input.bio}
                onChange={changeEventHandler}
                className='col-span-3'
                required
              />
            </div>

            {/* Education */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='education' className='text-right'>Education</Label>
              <Input
                id='education'
                name='education'
                value={input.education}
                onChange={changeEventHandler}
                className='col-span-3'
                required
              />
            </div>

            {/* Jobseeker Only Fields */}
            {!isRecruiter && (
              <>
                {/* Experience */}
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='experience' className='text-right'>Experience</Label>
                  <Input
                    id='experience'
                    name='experience'
                    type='number'
                    value={input.experience}
                    onChange={changeEventHandler}
                    className='col-span-3'
                  />
                </div>

                {/* Skills */}
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='skills' className='text-right'>Skills</Label>
                  <Input
                    id='skills'
                    name='skills'
                    value={input.skills}
                    onChange={changeEventHandler}
                    className='col-span-3'
                  />
                </div>

                {/* Resume */}
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='file' className='text-right'>Resume</Label>
                  <Input
                    id='file'
                    name='file'
                    type='file'
                    accept='application/pdf'
                    onChange={fileChangeHandler}
                    className='col-span-3'
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type='submit' className='w-full my-4' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                </>
              ) : (
                'Update'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfileDialog

