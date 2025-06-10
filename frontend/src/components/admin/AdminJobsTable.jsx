import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { JOB_API_END_POINT } from '@/utils/constant';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

import { showSuccessToast, showErrorToast } from "@/utils/toast";


const AdminJobsTable = () => {

  const [deleteJobId, setDeleteJobId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

    useEffect(() => {
      const message = localStorage.getItem('JobDeleteSuccess');
      if (message) {
        showSuccessToast(message);
        localStorage.removeItem('JobDeleteSuccess');
      }
    }, []);

  // const handleDelete = async (jobId) => {
  //   if (window.confirm("Are you sure you want to delete this job?")) {
  //     try {
  //       const response = await fetch(`${JOB_API_END_POINT}/delete/${jobId}`, {
  //         method: 'DELETE',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/json',
  //         }, 
  //         credentials: 'include', // ✅ Include cookies
  //       });

  //       console.log(jobId);

  //       const data = await response.json();

  //       if (response.ok) {
  //         alert(data.message || 'Job deleted successfully');
  //         window.location.reload(); // You could also remove from state for better UX
  //       } else {
  //         alert(data.message || 'Failed to delete job');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       alert('Something went wrong while deleting the job.');
  //     }
  //   }
  // };


  const handleDeleteJob = async () => {
    try {
      const response = await fetch(`${JOB_API_END_POINT}/delete/${deleteJobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // ✅ Include cookies
      });

      const data = await response.json();

      if (response.ok) {
        setIsDialogOpen(false);

        localStorage.setItem('JobDeleteSuccess', data?.message || 'Job deleted successfully');

        window.location.reload(); // Or update state to remove the job from the list
        // showSuccessToast(data.message || 'Job deleted successfully');
      } else {
        showErrorToast(data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Something went wrong while deleting the job.');
    }
  };


  useEffect(() => {
    const filteredJobs = allAdminJobs.length >= 0 && allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true
      };
      return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
    });

    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText])
  // return (
  //     <div>
  //         <Table>
  //             <TableCaption>A list of your recently posted jobs</TableCaption>
  //             <TableHeader>
  //                 <TableRow>
  //                     <TableHead>Company Name</TableHead>
  //                     <TableHead>Role</TableHead>
  //                     <TableHead>Date</TableHead>
  //                     <TableHead className="text-right">Action</TableHead>
  //                 </TableRow>
  //             </TableHeader>

  //             <TableBody>
  //                 {
  //                     filterJobs.length === 0 ? (
  //                         <TableRow>
  //                             <TableCell colSpan={4} className="text-center">
  //                                 You haven't posted any jobs yet.
  //                             </TableCell>
  //                         </TableRow>
  //                     ) : (

  //                         filterJobs?.map((job) => (
  //                             <TableRow key={job._id}>
  //                                 {/*  <TableRow> */}
  //                                 <TableCell>{job?.company?.name}</TableCell>
  //                                 <TableCell>{job?.title}</TableCell>
  //                                 <TableCell>{job?.company?.createdAt?.split('T')[0]}</TableCell>
  //                                 <TableCell className="text-right">
  //                                     <Popover>
  //                                         <PopoverTrigger className="cursor-pointer">
  //                                             <MoreHorizontal />
  //                                         </PopoverTrigger>
  //                                         <PopoverContent className="w-32">
  //                                             <div
  //                                                 onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
  //                                                 className='flex items-center w-fit gap-2 cursor-pointer mt-2'>

  //                                                 <Eye className='w-4' />
  //                                                 <span>Applicants</span>
  //                                             </div>
  //                                         </PopoverContent>
  //                                     </Popover>
  //                                 </TableCell>
  //                             </TableRow>
  //                         ))
  //                     )
  //                 }
  //             </TableBody>

  //         </Table>
  //     </div>
  // );
  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-white shadow-lg rounded-xl border">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Posted Jobs</h2>
      <Table>
        <TableCaption className="text-sm text-gray-500 mb-2">
          A list of your recently posted jobs
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-gray-700 font-semibold">Company Name</TableHead>
            <TableHead className="text-gray-700 font-semibold">Role</TableHead>
            <TableHead className="text-gray-700 font-semibold">Posted Date</TableHead>
            <TableHead className="text-gray-700 font-semibold">Expired Date</TableHead>
            <TableHead className="text-gray-700 font-semibold">Status</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">More</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                You haven't posted any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (
              <TableRow
                key={job._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <TableCell className="py-3">{job?.company?.name}</TableCell>
                <TableCell className="py-3">{job?.title}</TableCell>
                {/* <TableCell className="py-3">{job?.createdAt?.split('T')[0]}</TableCell>
                <TableCell className="py-3">{job?.expiredDate?.split('T')[0]}</TableCell> */}
                <TableCell className="py-3">{formatDate(job?.createdAt)}</TableCell>
                <TableCell className="py-3">{formatDate(job?.expiredDate)}</TableCell>

                <TableCell className="py-3">
                  {new Date(job.expiredDate) >= new Date() ? (
                    <span className="px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
                      Expired
                    </span>
                  )}
                </TableCell>


                <TableCell className="text-right py-3">
                  <Popover>
                    <PopoverTrigger className="cursor-pointer text-gray-600 hover:text-black">
                      <MoreHorizontal />
                    </PopoverTrigger>
                    {/* <PopoverContent className="w-36">
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Applicants</span>
                      </div>
                    </PopoverContent> */}
                    <PopoverContent className="w-36">
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Applicants</span>
                      </div>

                      <div
                        onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">Edit</span>
                      </div>

                      {/* <div
                        onClick={() => handleDelete(job._id)}
                        className="flex items-center gap-2 p-2 rounded hover:bg-red-50 cursor-pointer transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600">Delete</span>
                      </div> */}

                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <div
                            onClick={() => {
                              setDeleteJobId(job._id);
                              setIsDialogOpen(true);
                            }}
                            className="flex items-center gap-2 p-2 rounded hover:bg-red-50 cursor-pointer transition"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-600">Delete</span>
                          </div>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            Are you sure you want to delete this job? This action cannot be undone.
                          </p>
                          <DialogFooter className="flex justify-end gap-2 mt-4">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={handleDeleteJob}>Delete</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>


                    </PopoverContent>

                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

};

export default AdminJobsTable;
