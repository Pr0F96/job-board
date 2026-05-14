'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const router = useRouter()

  const [newJob, setNewJob] = useState({
    title: '', company: '', location: '', type: 'full_time',
    salary_range: '', description: '', requirements: ''
  })

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    await fetchJobs()
    await fetchApplications()
    setLoading(false)
  }

  async function fetchJobs() {
  if (!user?.id) {
    setJobs([])
    return
  }
  const { data } = await supabase.from('jobs').select('*').eq('posted_by', user.id).order('created_at', { ascending: false })
  setJobs(data || [])
}

  async function fetchApplications() {
  // First get all job IDs posted by current user
  const { data: userJobs } = await supabase
    .from('jobs')
    .select('id')
    .eq('posted_by', user.id)

  if (!userJobs || userJobs.length === 0) {
    setApplications([])
    return
  }

  const jobIds = userJobs.map(job => job.id)

  // Then get applications only for those jobs
  const { data: apps, error } = await supabase
    .from('applications')
    .select('*')
    .in('job_id', jobIds)
    .order('created_at', { ascending: false })

  if (error || !apps) {
    setApplications([])
    return
  }

  const enrichedApps = await Promise.all(
    apps.map(async (app) => {
      const { data: jobData } = await supabase.from('jobs').select('title').eq('id', app.job_id).single()
      const { data: profileData } = await supabase.from('profiles').select('full_name').eq('id', app.applicant_id).single()
      return {
        ...app,
        job_title: jobData?.title || 'Unknown Job',
        applicant_name: profileData?.full_name || 'Unknown Applicant'
      }
    })
  )

  setApplications(enrichedApps)
}

  async function handlePostJob(e: React.FormEvent) {
    e.preventDefault()
    
    const jobData = { 
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      type: newJob.type,
      salary_range: newJob.salary_range,
      description: newJob.description,
      requirements: newJob.requirements,
      status: 'active',
      posted_by: user.id
    }

    const { error } = await supabase.from('jobs').insert(jobData)
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setShowForm(false)
      setNewJob({ title: '', company: '', location: '', type: 'full_time', salary_range: '', description: '', requirements: '' })
      await fetchJobs()
      alert('Job posted successfully!')
    }
  }

  async function updateApplicationStatus(appId: any, newStatus: any) {
    const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', appId)
    if (!error) {
      await fetchApplications()
      setSelectedApp(null)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="text-red-600 hover:text-red-700">Logout</button>
      </div>

      <div className="mb-8">
        <button onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
          {showForm ? 'Cancel' : '+ Post New Job'}
        </button>

        {showForm && (
          <form onSubmit={handlePostJob} className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title *</label>
                <input required value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company *</label>
                <input required value={newJob.company} onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                  className="w-full px-3 py-2 border rounded" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  className="w-full px-3 py-2 border rounded" placeholder="e.g. New York, Remote" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={newJob.type} onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded">
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary Range</label>
                <input value={newJob.salary_range} onChange={(e) => setNewJob({...newJob, salary_range: e.target.value})}
                  className="w-full px-3 py-2 border rounded" placeholder="e.g. $50k - $70k" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea required rows={4} value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Requirements</label>
              <textarea rows={3} value={newJob.requirements} onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                className="w-full px-3 py-2 border rounded" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Publish Job
            </button>
          </form>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Job Postings ({jobs.length})</h2>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-4 rounded border">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-gray-500">No jobs posted yet.</p>}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Applications ({applications.length})</h2>
          <div className="space-y-3">
            {applications.map((app) => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className="bg-white p-4 rounded border cursor-pointer hover:shadow-md transition"
              >
                <p className="font-medium">{app.job_title || 'Unknown Job'}</p>
                <p className="text-sm text-gray-600">
                  by {app.applicant_name || 'Anonymous'}
                </p>
                <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                  app.status === 'hired' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
            {applications.length === 0 && <p className="text-gray-500">No applications yet.</p>}
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Application Details</h2>
            
            <div className="space-y-3 mb-6">
              <p><span className="font-medium">Job:</span> {selectedApp.job_title}</p>
              <p><span className="font-medium">Applicant:</span> {selectedApp.applicant_name}</p>
              <p><span className="font-medium">Status:</span> {selectedApp.status}</p>
              <p><span className="font-medium">Applied:</span> {new Date(selectedApp.created_at).toLocaleDateString()}</p>
              
              {selectedApp.cover_letter && (
                <div>
                  <p className="font-medium">Cover Letter:</p>
                  <p className="text-gray-600 text-sm">{selectedApp.cover_letter}</p>
                </div>
              )}

              {selectedApp.resume_url && (
                <div>
                  <p className="font-medium">Resume:</p>
                  <a 
                    href={selectedApp.resume_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    📄 View Resume
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => updateApplicationStatus(selectedApp.id, 'reviewed')}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Mark Reviewed
              </button>
              <button 
                onClick={() => updateApplicationStatus(selectedApp.id, 'hired')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Hire
              </button>
              <button 
                onClick={() => updateApplicationStatus(selectedApp.id, 'rejected')}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Reject
              </button>
            </div>

            <button 
              onClick={() => setSelectedApp(null)}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
