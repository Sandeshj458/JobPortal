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
import { showSuccessToast, showErrorToast } from "@/utils/toast";

const AdminJobsTable = () => {
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const message = localStorage.getItem('JobDeleteSuccess');
    if (message) {
      showSuccessToast(message);
      localStorage.removeItem('JobDeleteSuccess');
    }
  }, []);

  const handleDeleteJob = async () => {
    try {
      const response = await fetch(`${JOB_API_END_POINT}/delete/${deleteJobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setIsDialogOpen(false);
        localStorage.setItem('JobDeleteSuccess', data?.message || 'Job deleted successfully');
        window.location.reload();
      } else {
        showErrorToast(data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Something went wrong while deleting the job.');
    }
  };

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

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
              <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                You haven't posted any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (
              <TableRow key={job._id} className="hover:bg-gray-50 transition-colors duration-200">
                <TableCell className="py-3">{job?.company?.name}</TableCell>
                <TableCell className="py-3">{job?.title}</TableCell>
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
                    <PopoverContent className="w-36">

                      {/* Screening Type Options */}
                      {job.screeningType === 'Manual' ? (
                        <div
                          onClick={() =>
                            navigate(`/admin/jobs/${job._id}/applicants?screeningType=Manual`)
                          }
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">Manual Screening</span>
                        </div>
                      ) : job.screeningType === 'ATS' ? (
                        <div
                          onClick={() =>
                            navigate(`/admin/jobs/${job._id}/applicants?screeningType=ATS`)
                          }
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">ATS Screening</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2 rounded text-red-500 cursor-not-allowed">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">No Screening Type</span>
                        </div>
                      )}

                      {/* Edit Option */}
                      <div
                        onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">Edit</span>
                      </div>

                      {/* Delete Option */}
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
                            <Button variant="destructive" onClick={handleDeleteJob}>
                              Delete
                            </Button>
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
