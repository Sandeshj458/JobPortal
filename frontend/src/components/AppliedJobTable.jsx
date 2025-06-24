import React from 'react';
import { useSelector } from 'react-redux';
import { Badge } from './ui/badge';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return (
      <div className="text-center text-gray-500 p-6">
        <p className="text-lg font-medium">You haven't applied to any job yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto px-4 pb-6">
      <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden shadow-md">
        <thead className="bg-purple-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
              Job Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-purple-800 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {allAppliedJobs.map((appliedJob) => (
            <tr
              key={appliedJob._id}
              className="hover:bg-gray-50 transition duration-200 ease-in-out border-b"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(appliedJob?.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                {appliedJob.job?.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {appliedJob.job?.company?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full text-white ${
                    appliedJob.status === 'rejected'
                      ? 'bg-red-500'
                      : appliedJob.status === 'pending'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                >
                  {appliedJob.status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedJobTable;
