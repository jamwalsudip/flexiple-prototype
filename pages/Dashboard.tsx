import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getJobs, getApplicantsForJob, getTalentPool } from '../services/mockBackend';
import { JobPosting, Applicant, TalentProfile } from '../types';
import { Users, Briefcase, Eye, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [talentPool] = useState<TalentProfile[]>(getTalentPool());

  useEffect(() => {
    setJobs(getJobs());
  }, []);

  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  useEffect(() => {
    if (selectedJob) {
      setApplicants(getApplicantsForJob(selectedJob.id));
    }
  }, [selectedJob]);

  const getTalentForApplicant = (talentId: string) => {
    return talentPool.find(t => t.id === talentId);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Recruiter Dashboard</h1>

        {jobs.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
             <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-slate-900">No jobs posted yet</h3>
             <p className="text-slate-500 mb-6">Create your first job posting to see applicants.</p>
             <a href="/#/post-job" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Post a Job</a>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Jobs List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Your Jobs</h2>
              <div className="space-y-3">
                {jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedJob?.id === job.id
                        ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                        : 'bg-white border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-semibold ${selectedJob?.id === job.id ? 'text-indigo-900' : 'text-slate-800'}`}>{job.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{job.location} • {job.availabilityType}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {job.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Applicants Panel */}
            <div className="lg:col-span-2">
               {selectedJob && (
                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                   <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                     <div>
                       <h2 className="text-xl font-bold text-slate-900">{selectedJob.title}</h2>
                       <p className="text-sm text-slate-500">{selectedJob.companyName}</p>
                     </div>
                     <div className="flex items-center gap-2 text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                       <Users className="w-4 h-4" />
                       <span className="font-medium">{applicants.length} Applicants</span>
                     </div>
                   </div>

                   <div className="flex-grow overflow-y-auto">
                      {applicants.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-100">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Candidate</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-100">
                            {applicants.map(app => {
                              const talent = getTalentForApplicant(app.talentId);
                              if (!talent) return null;
                              return (
                                <tr key={app.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                                        {talent.fullName.split(' ').map(n=>n[0]).join('')}
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-slate-900">{talent.fullName}</div>
                                        <div className="text-xs text-slate-500">{talent.role}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.source === 'SEEDED' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                      {app.source === 'SEEDED' ? 'Recommended' : 'Applied'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {app.status}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 justify-end ml-auto">
                                      View <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
                          <Users className="w-12 h-12 mb-2 opacity-50" />
                          <p>No applicants yet.</p>
                        </div>
                      )}
                   </div>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;