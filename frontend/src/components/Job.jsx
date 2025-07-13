import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {

  const navigate = useNavigate();

  const daysAgoFunction = (mongoTime) => {
    const createdAt = new Date(mongoTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60))
  }
  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 min-h-[350px] flex flex-col justify-between'>

      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) == 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
      </div>

      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 my-2'>
        <Button className='p-6' variant='outline' size='icon'>
          <Avatar className="rounded-none w-9 h-8 overflow-hidden">
            <AvatarImage
              src={job?.company?.logo}
              className="object-contain w-full h-full rounded-none"
            />
          </Avatar>
        </Button>
        <div>
          <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
          <p className='text-sm text-gray-500'>{job?.location}</p>
        </div>
      </div>

      <div>
        <p className='font-bold text-lg my-2'>{job?.title}</p>
        <p className='text-sm text-gray-600'>{job?.description}</p>
      </div>

      <div className='flex flex-wrap items-center gap-2 mt-4'>
        <Badge className='text-blue-700 font-bold' variant='ghost'>{job?.position} Positions</Badge>
        <Badge className='text-[#F83002] font-bold' variant='ghost'>{job?.jobType}</Badge>
        <Badge className='text-[#7209b7] font-bold' variant='ghost'>{job?.salary}</Badge>
      </div>

      <div className='flex items-center gap-2 mt-4'>
        <Button className='bg-[#7209b7] w-full' onClick={() => navigate(`/description/${job?._id}`)}>Details</Button>
      </div>

    </div >
  )
}

export default Job

