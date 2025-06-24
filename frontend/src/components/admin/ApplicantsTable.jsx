import React from 'react';
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
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

// 📅 Format date & time
const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedTime = `${hours}:${minutes} ${ampm}`;
  return { formattedDate, formattedTime };
};

// ✅ Options for shortlisting
const shortlistingStatus = ['Accepted', 'Rejected'];

const ApplicantsTable = ({ screeningType }) => {
  const { applicants } = useSelector((store) => store.application);

  // ✅ Status update API call
  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
      if (res.data.success) {
        showSuccessToast(res.data.message);
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to update status');
    }
  };

  // ✅ Filter + Sort top 20 ATS applicants or default list
  let filteredApplications = applicants?.applications || [];

  if (screeningType === 'ATS') {
    filteredApplications = [...filteredApplications]
      .filter((item) => item.atsScore !== undefined)
      .sort((a, b) => {
        if (b.atsScore === a.atsScore) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return b.atsScore - a.atsScore;
      })
      .slice(0, 20);
  } else if (screeningType) {
    filteredApplications = filteredApplications.filter(
      (item) => applicants?.screeningType === screeningType
    );
  }

  // 🔵 ATS Score Ring UI (Inline Function)
  const renderATSRing = (score) => {
    const radius = 20;
    const stroke = 4;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const ringColor = score < 40 ? '#ef4444' : score < 70 ? '#facc15' : '#10b981'; // red, yellow, green

    return (
      <div className="relative w-10 h-10 flex items-center justify-center mx-auto">
        <svg height={radius * 2} width={radius * 2} className="absolute top-0 left-0">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={ringColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.3s linear',
            }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className="absolute text-[11px] font-semibold text-gray-800">{score}</span>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <Table>
        <TableCaption className="text-sm text-gray-500 mb-2">A list of your recent applicants</TableCaption>
        
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-gray-700 font-semibold">Full Name</TableHead>
            <TableHead className="text-gray-700 font-semibold">Email</TableHead>
            <TableHead className="text-gray-700 font-semibold">Contact</TableHead>
            <TableHead className="text-gray-700 font-semibold">Resume</TableHead>
            {screeningType === 'ATS' && (
              <TableHead className="text-gray-700 font-semibold">ATS Score</TableHead>
            )}
            <TableHead className="text-gray-700 font-semibold">Date</TableHead>
            <TableHead className="text-gray-700 font-semibold">Time</TableHead>
            <TableHead className="text-gray-700 font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredApplications?.length > 0 ? (
            filteredApplications.map((item) => {
              const { formattedDate, formattedTime } = formatDateTime(item?.createdAt);
              return (
                <TableRow key={item._id}>
                  <TableCell>{item?.applicant?.fullname}</TableCell>
                  <TableCell>{item?.applicant?.email}</TableCell>
                  <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                  <TableCell>
                    {item.applicant?.profile?.resume ? (
                      <a
                        className="text-blue-600"
                        href={item.applicant?.profile?.resume}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.applicant?.profile?.resumeOriginalName}
                      </a>
                    ) : (
                      'NA'
                    )}
                  </TableCell>

                  {/* ✅ ATS Score Ring */}
                  {screeningType === 'ATS' && (
                    <TableCell className="text-center">
                      {renderATSRing(item.atsScore || 0)}
                    </TableCell>
                  )}

                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>{formattedTime}</TableCell>
                  <TableCell className="float-right cursor-pointer">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal />
                      </PopoverTrigger>
                      <PopoverContent className="w-32">
                        {shortlistingStatus.map((status, index) => (
                          <div
                            key={index}
                            onClick={() => statusHandler(status, item._id)}
                            className="my-2 cursor-pointer"
                          >
                            {status}
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-6">
                No applicants for this screening type.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
