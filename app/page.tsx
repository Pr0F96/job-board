import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Find Your Next Opportunity
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Browse curated job postings from top companies. Create an account to apply in minutes.
      </p>
      <div className="space-x-4">
        <Link href="/jobs" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 inline-block">
          Browse Jobs
        </Link>
        <Link href="/signup" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 inline-block">
          Create Account
        </Link>
      </div>
    </div>
  )
}