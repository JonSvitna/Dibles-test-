import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [countyTests, setCountyTests] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check backend health
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(err => {
        setBackendStatus('Backend unavailable')
        setError(err.message)
      })

    // Fetch county tests data
    fetch(`${API_URL}/api/county-tests`)
      .then(res => res.json())
      .then(data => setCountyTests(data.data))
      .catch(err => setError(err.message))
  }, [])

  return (
    <>
      <div>
        <h1>Dibles Test Application</h1>
        <p>Frontend hosted on Vercel • Backend hosted on Railway</p>
      </div>
      
      <div className="card">
        <h2>Backend Status</h2>
        <p>{backendStatus}</p>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>

      <div className="card">
        <h2>County Tests</h2>
        {countyTests.length > 0 ? (
          <ul style={{ textAlign: 'left' }}>
            {countyTests.map(test => (
              <li key={test.id}>
                {test.county}: {test.testCount} tests
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading county tests...</p>
        )}
      </div>

      <p className="read-the-docs">
        Built with Vite (modern alternative to deprecated webpack)
      </p>
    </>
  )
}

export default App
