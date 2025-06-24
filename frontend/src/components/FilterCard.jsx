import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
  {
    filterType: 'Location',
    array: ['Bengaluru', 'Delhi', 'Hyderabad', 'Mumbai', 'Noida', 'Pune'].sort(),
  },
  {
    filterType: 'Industry',
    array: [
      'Frontend Developer',
      'Backend Engineer',
      'FullStack Developer',
      'Data Scientist',
      'Cloud Engineer',
      'Business Analyst',
      'UX Designer',
      'Software Developer',
    ].sort(),
  },
];

const salaryUnits = ['K', 'Lakhs', 'Cr'];
const salaryDurations = ['/month', '/year'];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [salaryUnit, setSalaryUnit] = useState('Lakhs');
  const [salaryDuration, setSalaryDuration] = useState('/year');

  const dispatch = useDispatch();

  const handleRadioChange = (value) => setSelectedValue(value);

  const handleSalaryFilter = () => {
    if (salaryAmount) {
      const finalSalary = `${salaryAmount}${salaryUnit}${salaryDuration}`;
      setSelectedValue(finalSalary);
    }
  };

  useEffect(() => {
    if (selectedValue) dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={handleRadioChange}>
        {filterData.map((data, index) => (
          <div key={index}>
            <h1 className="font-bold text-lg mt-4">{data.filterType}</h1>
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div className="flex items-center space-x-2 my-2" key={itemId}>
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </div>
        ))}

        {/* SALARY FILTER */}
        <div className="mt-4">
          <h1 className="font-bold text-lg">Salary</h1>
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="number"
              placeholder="Amount"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <select
              value={salaryUnit}
              onChange={(e) => setSalaryUnit(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              {salaryUnits.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <select
              value={salaryDuration}
              onChange={(e) => setSalaryDuration(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              {salaryDurations.map((duration) => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
            <button
              onClick={handleSalaryFilter}
              className="bg-[#6A38C2] text-white px-3 py-1 rounded hover:bg-[#5b30a6]"
            >
              Apply Salary Filter
            </button>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
