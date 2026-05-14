'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function JobDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeFile, setResumeFile] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    async function loadData() {
      const jobData = await fetchJob()
      await checkUser(jobData)
    }
    loadData()
  }, [id])

  async function fetchJob() {
    const { data } = await supabase.from('jobs').select('*').eq('id', id).single()
    setJob(data)
    return data
  }

  async function checkUser(jobData: any = null) {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    setUser(authUser)
    
    const currentJob = jobData || job
    if (authUser && currentJob) {
      setIsOwner(currentJob.posted_by === authUser.id)
    }
    
    if (authUser) {
      const { data } = await supabase.from('applications').select('*').eq('job_id', id).eq('applicant_id', authUser.id).single()
      setHasApplied(!!data)
    }
  }

  async function handleApply(e: any) {
    e.preventDefault()
    
    if (!user) {
      router.push('/login')
      return
    }

    setUploading(true)
    let resumeUrl = null

    // Upload resume if selected
    if (resumeFile) {
      const fileExt = resumeFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('resumes')
        .upload(fileName, resumeFile)

      if (uploadError) {
        alert('Error uploading resume: ' + uploadError.message)
        setUploading(false)
        return
      }

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('resumes')
        .getPublicUrl(fileName)
      
      resumeUrl = urlData.publicUrl
    }

    // Submit application
    const { error } = await supabase.from('applications').insert({
      job_id: id,
      applicant_id: user.id,
      cover_letter: coverLetter,
      resume_url: resumeUrl
    })

    setUploading(false)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setHasApplied(true)
      alert('Application submitted successfully!')
    }
  }

  if (!job) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">← Back to jobs</Link>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{job.company} • {job.location}</p>
        
        <div className="flex gap-2 mb-6">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded capitalize">{job.type.replace('_', ' ')}</span>
          {job.salary_range && <span className="bg-green-100 text-green-800 px-3 py-1 rounded">{job.salary_range}</span>}
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

        {/* Show apply form to non-owners who haven't applied */}
        {!isOwner && (hasApplied ? (
          <div className="bg-green-50 text-green-800 px-6 py-3 rounded-lg text-center font-medium">
            ✓ You have applied for this position
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Tell us why you're a good fit..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF, DOC, DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {resumeFile && (
                <p className="text-sm text-green-600 mt-1">✓ {resumeFile.name} selected</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {uploading ? 'Submitting...' : 'Apply Now'}
            </button>
          </form>
        ))}

        {/* Show applicants section only to job owner */}
        {isOwner && (
          <div className="mt-8 border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Applicants</h2>
            <p className="text-gray-500 mb-4">You can manage applications from your Dashboard.</p>
            <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block">
              Go to Dashboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
