'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function JobDetailClient({ job }: { job: any }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data } = await supabase
          .from('applications')
          .select('*')
          .eq('job_id', job.id)
          .eq('applicant_id', user.id)
          .single()
        
        setHasApplied(!!data)
      }
      
      setLoading(false)
    }
    
    checkUser()
  }, [job.id])

  async function handleApply() {
    if (!user) {
      router.push('/login')
      return
    }
    
    const { error } = await supabase
      .from('applications')
      .insert({ 
        job_id: job.id, 
        applicant_id: user.id 
      })
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setHasApplied(true)
      alert('Application submitted successfully!')
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to jobs
      </Link>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{job.company} • {job.location}</p>
        
        <div className="flex gap-2 mb-6">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded capitalize">
            {job.type?.replace('_', ' ')}
          </span>
          {job.salary_range && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
              {job.salary_range}
            </span>
          )}
        </div>

        <div className="prose max-w-none mb-8">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          
          {job.requirements && (
            <>
              <h3 className="text-lg font-semibold mb-2 mt-6">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </>
          )}
        </div>

        {hasApplied ? (
          <div className="bg-green-50 text-green-800 px-6 py-3 rounded-lg text-center font-medium">
            ✓ You have applied for this position
          </div>
        ) : (
          <button 
            onClick={handleApply}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 font-medium"
          >
            {user ? 'Apply Now' : 'Login to Apply'}
          </button>
        )}
      </div>
    </div>
  )
}
