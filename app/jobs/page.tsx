'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchJobs()
  }, [filter])

  async function fetchJobs() {
    let query = supabase.from('jobs').select('*').eq('status', 'active').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('type', filter)
    const { data } = await query
    setJobs(data || [])
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>

      <div className="mb-6 flex gap-2">
        {['all', 'full_time', 'part_time', 'remote', 'contract'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded capitalize ${filter === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <p className="text-gray-600">{job.company} • {job.location}</p>
                <div className="mt-2 flex gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm capitalize">{job.type.replace('_', ' ')}</span>
                  {job.salary_range && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{job.salary_range}</span>}
                </div>
              </div>
              <Link href={`/jobs/${job.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View & Apply
              </Link>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-gray-500 text-center py-8">No jobs available yet.</p>}
      </div>
    </div>
  )
}
