'use client'

import { useState } from 'react'

export default function TestEnvironmentPage() {
  const [testResults, setTestResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/news/test-connection')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({
        success: false,
        error: 'Failed to run tests: ' + error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Environment Setup Validation
          </h1>
          
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {loading ? 'Running Tests...' : 'Test Environment Setup'}
            </button>
          </div>

          {testResults && (
            <div className="space-y-4">
              <div className={`p-4 rounded-md ${
                testResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-medium ${
                  testResults.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResults.success ? '✅ All Tests Passed' : '❌ Some Tests Failed'}
                </h3>
                <p className={`mt-1 text-sm ${
                  testResults.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {testResults.message || testResults.error}
                </p>
              </div>

              {testResults.results && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-3">Test Results:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Configuration Valid:</span>
                      <span className={testResults.results.configValid ? 'text-green-600' : 'text-red-600'}>
                        {testResults.results.configValid ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exa API Key:</span>
                      <span className={testResults.results.apiKeys?.exa ? 'text-green-600' : 'text-red-600'}>
                        {testResults.results.apiKeys?.exa ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Google AI API Key:</span>
                      <span className={testResults.results.apiKeys?.googleAI ? 'text-green-600' : 'text-red-600'}>
                        {testResults.results.apiKeys?.googleAI ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Admin User Exists:</span>
                      <span className={testResults.results.adminUser ? 'text-green-600' : 'text-red-600'}>
                        {testResults.results.adminUser ? '✅' : '❌'}
                      </span>
                    </div>
                    {testResults.results.timestamp && (
                      <div className="flex justify-between text-gray-500">
                        <span>Tested at:</span>
                        <span>{new Date(testResults.results.timestamp).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Environment Variables Check:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>✓ EXA_API_KEY: {process.env.EXA_API_KEY ? 'Set' : 'Not set'}</div>
              <div>✓ GOOGLE_AI_API_KEY: {process.env.GOOGLE_AI_API_KEY ? 'Set' : 'Not set'}</div>
              <div>✓ NEWS_SCRAPING_ENABLED: {process.env.NEWS_SCRAPING_ENABLED || 'Not set'}</div>
              <div>✓ ADMIN_USER_ID: {process.env.ADMIN_USER_ID ? 'Set' : 'Not set'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
