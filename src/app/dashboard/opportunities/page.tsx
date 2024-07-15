'use client'
import { useState } from 'react';
import MultiSelect, { Option } from '@/ui/reusableComponents/MultiSelect';
import JobCards from './components/JobCards';
import BuildOpportunities from './components/BuildOpportunities';

const options = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'React', value: 'react' },
  { label: 'Node.js', value: 'nodejs' },
];

const Opportunities = () => {
  const [selectedKeywords, setSelectedKeywords]: any = useState([]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Opportunities</h1>
      <div className="mb-6">
        <h2 className="text-xl mb-2">Select Your Skills/Keywords</h2>
        <MultiSelect
          options={options}
          selectedOptions={selectedKeywords}
          setSelectedOptions={setSelectedKeywords}
          placeholder="Select your skills"
        />
      </div>
      <JobCards keywords={selectedKeywords} />
      <BuildOpportunities keywords={selectedKeywords} />
    </div>
  );
};

export default Opportunities;
