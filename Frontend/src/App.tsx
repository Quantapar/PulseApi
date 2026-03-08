import { useState } from 'react'
import { signUp, signIn, signOut, useSession, authClient } from './lib/auth'
import './App.css'

function App() {
  const { data: session, isPending } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [apiData, setApiData] = useState<any>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Signing up...')
    const { error } = await signUp.email({
      email,
      password,
      name,
    })
    if (error) setMessage(`Error: ${error.message}`)
    else setMessage('Signed up successfully!')
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Signing in...')
    const { error } = await signIn.email({
      email,
      password,
    })
    if (error) setMessage(`Error: ${error.message}`)
    else setMessage('Signed in successfully!')
  }

  const handleSignOut = async () => {
    setMessage('Signing out...')
    await signOut()
    setApiData(null)
    setMessage('Signed out')
  }

  const handleGetMe = async () => {
    setMessage('Fetching /api/me...')
    try {
      // The Better Auth fetch wrapper automatically handles sending credentials
      const res = await authClient.$fetch('/api/me')
      setApiData(res.data)
      setMessage('Fetched user profile successfully')
    } catch (err: any) {
      setMessage(`Error fetching /me: ${err.message || 'Unauthorized'}`)
    }
  }

  if (isPending) return <div>Loading session...</div>

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Better Auth Test Client</h1>

      {message && (
        <div style={{ padding: '1rem', background: '#ffebee', color: '#c62828', marginBottom: '1rem', borderRadius: '4px' }}>
          {message}
        </div>
      )}

      {session ? (
        <div style={{ padding: '1.5rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h2>Welcome, {session.user.name}!</h2>
          <p>Email: {session.user.email}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={handleGetMe} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Test GET /api/me
            </button>
            <button onClick={handleSignOut} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#ef5350', color: 'white', border: 'none' }}>
              Sign Out
            </button>
          </div>

          {apiData && (
            <div style={{ marginTop: '2rem', background: '#fff', padding: '1rem', borderRadius: '4px' }}>
              <h3>/api/me Response:</h3>
              <pre style={{ background: '#f5f5f5', padding: '1rem', overflowX: 'auto' }}>
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* SIGN IN FORM */}
          <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px' }}>
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                style={{ padding: '0.5rem' }}
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ padding: '0.5rem' }}
              />
              <button type="submit" style={{ padding: '0.5rem', background: '#2196f3', color: 'white', border: 'none', cursor: 'pointer' }}>
                Sign In
              </button>
            </form>
          </div>

          {/* SIGN UP FORM */}
          <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px' }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                style={{ padding: '0.5rem' }}
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                style={{ padding: '0.5rem' }}
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ padding: '0.5rem' }}
              />
              <button type="submit" style={{ padding: '0.5rem', background: '#4caf50', color: 'white', border: 'none', cursor: 'pointer' }}>
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
