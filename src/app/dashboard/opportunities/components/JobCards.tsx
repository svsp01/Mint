'use client'
import { useEffect, useState } from 'react';

interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
}

interface JobCardsProps {
  keywords: { label: string; value: string }[];
}

const JobCards: React.FC<JobCardsProps> = ({ keywords }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (keywords.length > 0) {
      setLoading(true);
      fetch(`/api/jobs?keywords=${keywords.map(k => k.value).join(',')}`)
        .then(res => res.json())
        .then(data => {
          setJobs(data?.data);
          setLoading(false);
        });
    }
  }, [keywords]);

  return (
    <div className="mb-6">
      <h2 className="text-xl mb-4">Job Listings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, index) => (
            <div key={index} className="p-4 border rounded shadow">
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <a href={job.url} target="_blank" className="text-blue-500">
                Apply
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobCards;
