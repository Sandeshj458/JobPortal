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
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { COMPANY_API_END_POINT } from '@/utils/constant';

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
// import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const CompaniesTable = () => {
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  // Track which companyId's dialog is open
  const [deleteCompanyId, setDeleteCompanyId] = useState(null);

  useEffect(() => {
    const message = localStorage.getItem('company&JobDeleteSuccess');
    if (message) {
      showSuccessToast(message);
      localStorage.removeItem('company&JobDeleteSuccess');
    }
  }, []);

  useEffect(() => {
    const filteredCompany = companies.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  // Delete API call and UI update
  const handleDeleteCompany = async () => {
    try {
      const response = await fetch(`${COMPANY_API_END_POINT}/delete/${deleteCompanyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Refetch or update company list in store here
        setDeleteCompanyId(null); // close dialog

        // ✅ Save success message to localStorage
        localStorage.setItem('company&JobDeleteSuccess', data?.message || 'Company and releated Jobs deleted successfully');

        window.location.reload();
        
      } else {
        showErrorToast(data.message || 'Failed to delete company');
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Something went wrong while deleting the company.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-white shadow-lg rounded-xl border">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Registered Companies</h2>
      <Table>
        <TableCaption className="text-sm text-gray-500 mb-2">
          A list of your recently registered companies
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-gray-700 font-semibold">Logo</TableHead>
            <TableHead className="text-gray-700 font-semibold">Name</TableHead>
            <TableHead className="text-gray-700 font-semibold">Date</TableHead>
            <TableHead className="text-right text-gray-700 font-semibold">More</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!Array.isArray(companies) || companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                You haven't registered any company yet.
              </TableCell>
            </TableRow>
          ) : (
            filterCompany.map((company) => (
              <TableRow
                key={company._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <TableCell className="py-3">
                  <Avatar className="rounded-none w-9 h-8 overflow-hidden">
                    <AvatarImage
                      src={
                        company.logo ||
                        'https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg'
                      }
                      className="object-contain w-full h-full rounded-none"
                    />
                  </Avatar>
                </TableCell>
                <TableCell className="py-3">{company.name}</TableCell>
                <TableCell className="py-3">{formatDate(company.createdAt)}</TableCell>
                <TableCell className="text-right py-3">
                  <Popover>
                    <PopoverTrigger className="cursor-pointer text-gray-600 hover:text-black">
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-36">
                      <div
                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Edit</span>
                      </div>

                      {/* Delete button opens dialog */}
                      <Dialog
                        open={deleteCompanyId === company._id}
                        onOpenChange={(open) => {
                          if (!open) setDeleteCompanyId(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <div
                            className="flex items-center gap-2 p-2 rounded hover:bg-red-50 cursor-pointer transition"
                            onClick={() => setDeleteCompanyId(company._id)}
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
                            Are you sure you want to delete this company? This action cannot be
                            undone.
                          </p>
                          <DialogFooter className="flex justify-end gap-2 mt-4">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={handleDeleteCompany}>
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

export default CompaniesTable;
