'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Filter options - easy to add more later
const EXPERIENCE_OPTIONS = [
  '1-3 years',
  '3-5 years',
  '5-8 years',
  '8-12 years',
  '12-15 years',
  '15-18 years',
  '20-25 years',
  '25+ years'
]

const VISA_OPTIONS = [
  'CPT',
  'OPT',
  'H1B',
  'H4EAD',
  'H1 Transfer',
  'GC',
  'GCEAD',
  'TN',
  'USC'
]

const LOCATION_OPTIONS = [
  'Richmond, VA',
  'Lansing, MI',
  'Sterling, VA',
  'New York, NY',
  'San Francisco, CA',
  'Austin, TX',
  'Seattle, WA',
  'Chicago, IL',
  'Boston, MA',
  'Atlanta, GA',
  'Dallas, TX',
  'Denver, CO',
  'Phoenix, AZ',
  'Miami, FL',
  'Philadelphia, PA',
  'San Diego, CA',
  'Portland, OR',
  'Nashville, TN',
  'Charlotte, NC',
  'Columbus, OH',
  'Kansas City, MO',
  'Minneapolis, MN',
  'Indianapolis, IN',
  'Salt Lake City, UT',
  'Raleigh, NC',
  'Tampa, FL',
  'Pittsburgh, PA',
  'Cincinnati, OH',
  'Milwaukee, WI',
  'Sacramento, CA',
  'St. Louis, MO',
  'Orlando, FL',
  'Cleveland, OH',
  'Virginia Beach, VA',
  'Providence, RI',
  'Jacksonville, FL',
  'Hartford, CT',
  'Birmingham, AL',
  'Rochester, NY',
  'Tucson, AZ',
  'Honolulu, HI',
  'Omaha, NE',
  'Boise, ID',
  'Des Moines, IA',
  'Little Rock, AR',
  'Madison, WI',
  'Boulder, CO',
  'Fort Worth, TX',
  'San Jose, CA',
  'Oakland, CA',
  'Arlington, VA',
  'Fremont, CA',
  'Irvine, CA',
  'Durham, NC',
  'Plano, TX',
  'Jersey City, NJ',
  'Chandler, AZ',
  'Lubbock, TX',
  'Laredo, TX',
  'Chesapeake, VA',
  'Garland, TX',
  'Scottsdale, AZ',
  'Norfolk, VA',
  'Fayetteville, NC',
  'McKinney, TX',
  'Frisco, TX',
  'Amarillo, TX',
  'Grand Prairie, TX',
  'Brownsville, TX',
  'Killeen, TX',
  'Pasadena, TX',
  'Mesquite, TX',
  'McAllen, TX',
  'Carrollton, TX',
  'Waco, TX',
  'Denton, TX',
  'Midland, TX',
  'Abilene, TX',
  'Beaumont, TX',
  'Odessa, TX',
  'Round Rock, TX',
  'Wichita Falls, TX',
  'Richardson, TX',
  'Lewisville, TX',
  'Tyler, TX',
  'College Station, TX',
  'Pearland, TX',
  'San Angelo, TX',
  'Allen, TX',
  'League City, TX',
  'Sugar Land, TX',
  'Longview, TX',
  'Edinburg, TX',
  'Mission, TX',
  'Bryan, TX',
  'Baytown, TX',
  'Pharr, TX',
  'Temple, TX',
  'Flower Mound, TX',
  'Missouri City, TX',
  'Harlingen, TX',
  'North Richland Hills, TX',
  'Victoria, TX',
  'Conroe, TX',
  'New Braunfels, TX',
  'Mansfield, TX',
  'Cedar Park, TX',
  'Rowlett, TX',
  'Port Arthur, TX',
  'Euless, TX',
  'DeSoto, TX',
  'Galveston, TX',
  'Bedford, TX',
  'Grapevine, TX',
  'Wylie, TX',
  'Haltom City, TX',
  'Rosenberg, TX',
  'Burleson, TX',
  'Huntsville, TX',
  'Keller, TX',
  'The Colony, TX',
  'Coppell, TX',
  'Hurst, TX',
  'Lancaster, TX',
  'Duncanville, TX',
  'Friendswood, TX',
  'La Porte, TX',
  'Texarkana, TX',
  'San Marcos, TX',
  'Kingsville, TX',
  'Channelview, TX',
  'Harker Heights, TX',
  'Alvin, TX',
  'Pflugerville, TX',
  'Del Rio, TX',
  'Lufkin, TX',
  'Katy, TX',
  'Saginaw, TX',
  'Cedar Hill, TX',
  'Fort Hood, TX',
  'Hitchcock, TX',
  'Dickinson, TX',
  'Bellaire, TX',
  'Webster, TX',
  'West University Place, TX',
  'Jacinto City, TX',
  'South Houston, TX',
  'Galena Park, TX',
  'Bunker Hill Village, TX',
  'Hunters Creek Village, TX',
  'Spring Valley Village, TX',
  'Piney Point Village, TX',
  'Hilshire Village, TX',
  'Hedwig Village, TX',
  'Bellaire, TX',
  'West University Place, TX',
  'Southside Place, TX',
  'Jersey Village, TX',
  'Spring Valley, TX',
  'Humble, TX',
  'Atascocita, TX',
  'Kingwood, TX',
  'The Woodlands, TX',
  'Sugar Land, TX',
  'Missouri City, TX',
  'Stafford, TX',
  'Meadows Place, TX',
  'Arcola, TX',
  'Pecan Grove, TX',
  'Four Corners, TX',
  'Fresno, TX',
  'Greatwood, TX',
  'New Territory, TX',
  'Sienna Plantation, TX',
  'Eldorado, TX',
  'First Colony, TX',
  'Sugar Creek, TX',
  'Telfair, TX',
  'Riverstone, TX',
  'Sienna, TX',
  'Aliana, TX',
  'Cross Creek Ranch, TX',
  'Fulbrook, TX',
  'Fulshear, TX',
  'Pine Mill Ranch, TX',
  'Seven Meadows, TX',
  'Westheimer Lakes, TX',
  'Grand Mission, TX',
  'Elyson, TX',
  'Jordan Ranch, TX',
  'Cinco Ranch, TX',
  'Katy, TX',
  'Woodcreek Reserve, TX',
  'Firethorne, TX',
  'Cane Island, TX',
  'Young Ranch, TX',
  'Grayson Lakes, TX',
  'Pine Creek Ranch, TX',
  'Tamarron, TX',
  'West Ranch, TX',
  'Sunterra, TX',
  'Polo Ranch, TX',
  'Falcon Point, TX',
  'Cinco Ranch Southwest, TX',
  'Cinco Ranch Greenway Village, TX',
  'Cinco Ranch Parkview, TX',
  'Cinco Ranch Southfork, TX',
  'Cinco Ranch West, TX',
  'Cinco Ranch Northwest, TX',
  'Cinco Ranch Northeast, TX',
  'Cinco Ranch Central, TX',
  'Cinco Ranch Southeast, TX',
  'Cinco Ranch East, TX',
  'Cinco Ranch North, TX',
  'Cinco Ranch South, TX',
  'Cinco Ranch Westpark, TX',
  'Cinco Ranch Lakeview, TX',
  'Cinco Ranch Parkview, TX',
  'Cinco Ranch Greenway, TX',
  'Cinco Ranch Southfork, TX',
  'Cinco Ranch Southwest, TX',
  'Cinco Ranch Northwest, TX',
  'Cinco Ranch Southeast, TX',
  'Cinco Ranch Northeast, TX',
  'Cinco Ranch Central, TX',
  'Cinco Ranch East, TX',
  'Cinco Ranch West, TX',
  'Cinco Ranch North, TX',
  'Cinco Ranch South, TX'
]

const SECURITY_CLEARANCE_OPTIONS = [
  'None',
  'Secret',
  'Top Secret (TS)',
  'TS/SCI',
  'TS/SCI with CI Polygraph',
  'TS/SCI with Full Scope Polygraph',
  'Public Trust',
  'DOE Q',
  'DOE L',
  'SAP (Special Access Programs)',
  'NATO Secret',
  'NATO Confidential'
]

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
    salary_range: '', description: '', requirements: '',
    experience: '',
    visa_status: [] as string[],
    locations: [] as string[],
    security_clearance: [] as string[]
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
    if (!user?.id) {
      setApplications([])
      return
    }
    const { data: userJobs } = await supabase
      .from('jobs')
      .select('id')
      .eq('posted_by', user.id)

    if (!userJobs || userJobs.length === 0) {
      setApplications([])
      return
    }

    const jobIds = userJobs.map(job => job.id)

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
      posted_by: user.id,
      experience: newJob.experience,
      visa_status: newJob.visa_status,
      locations: newJob.locations,
      security_clearance: newJob.security_clearance
    }

    const { error } = await supabase.from('jobs').insert(jobData)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setShowForm(false)
      setNewJob({
        title: '', company: '', location: '', type: 'full_time',
        salary_range: '', description: '', requirements: '',
        experience: '',
        visa_status: [],
        locations: [],
        security_clearance: []
      })
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

  // Helper for multi-select
  function handleMultiSelect(field: string, value: string, selected: string[]) {
    if (selected.includes(value)) {
      setNewJob({...newJob, [field]: selected.filter(v => v !== value)})
    } else {
      setNewJob({...newJob, [field]: [...selected, value]})
    }
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

            {/* Basic Info */}
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

            {/* FILTER SECTION - Experience */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Job Requirements / Filters</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Experience Required *</label>
                  <select 
                    required
                    value={newJob.experience} 
                    onChange={(e) => setNewJob({...newJob, experience: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select experience...</option>
                    {EXPERIENCE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Security Clearance</label>
                  <select 
                    multiple
                    value={newJob.security_clearance}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, opt => opt.value)
                      setNewJob({...newJob, security_clearance: selected})
                    }}
                    className="w-full px-3 py-2 border rounded h-24"
                  >
                    {SECURITY_CLEARANCE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>
              </div>

              {/* Visa Status - Multi Select */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Visa Status Accepted (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {VISA_OPTIONS.map(visa => (
                    <button
                      key={visa}
                      type="button"
                      onClick={() => handleMultiSelect('visa_status', visa, newJob.visa_status)}
                      className={`px-3 py-1 rounded text-sm border transition ${
                        newJob.visa_status.includes(visa)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {visa}
                    </button>
                  ))}
                </div>
                {newJob.visa_status.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">Selected: {newJob.visa_status.join(', ')}</p>
                )}
              </div>

              {/* Locations - Multi Select */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Work Locations (Select all acceptable)</label>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto border rounded p-2">
                  {LOCATION_OPTIONS.map(loc => (
                    <label key={loc} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={newJob.locations.includes(loc)}
                        onChange={() => handleMultiSelect('locations', loc, newJob.locations)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{loc}</span>
                    </label>
                  ))}
                </div>
                {newJob.locations.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">Selected: {newJob.locations.join(', ')}</p>
                )}
              </div>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full">
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
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.experience && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">{job.experience}</span>
                      )}
                      {job.visa_status?.map((v: string) => (
                        <span key={v} className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">{v}</span>
                      ))}
                      {job.locations?.slice(0, 2).map((l: string) => (
                        <span key={l} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{l}</span>
                      ))}
                      {job.locations?.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">+{job.locations.length - 2} more</span>
                      )}
                    </div>
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
