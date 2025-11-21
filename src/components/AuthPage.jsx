import React, { useState } from "react";
// import { useAuth } from '../contexts/AuthProvider'

const API = import.meta.env.VITE_API_URL || "";

// export default function AuthPage() {
//   const auth = useAuth()
//   const [mode, setMode] = useState('login')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [name, setName] = useState('')
//   const [userName, setUserName] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   async function handleAuth(e) {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
//     try {
//       if (mode === 'register') {
//         const res = await fetch(`${API}/auth/register`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email_address: email, password, name, user_name: userName })
//         })
//         // parse safely
//         let text = ''
//         try { text = await res.text() } catch (e) { text = '' }
//         let data = null
//         try { data = text ? JSON.parse(text) : null } catch (e) { data = null }
//         if (!res.ok) {
//           const msg = (data && (data.error || data.message)) || text || `${res.status} ${res.statusText}`
//           throw new Error(`Register failed: ${msg}`)
//         }
//         // after register, prompt user to login
//         setMode('login')
//       } else {
//         const res = await fetch(`${API}/auth/login`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email_address: email, password })
//         })
//         let text = ''
//         try { text = await res.text() } catch (e) { text = '' }
//         let data = null
//         try { data = text ? JSON.parse(text) : null } catch (e) { data = null }
//         if (!res.ok) {
//           const msg = (data && (data.error || data.message)) || text || `${res.status} ${res.statusText}`
//           throw new Error(`Login failed: ${msg}`)
//         }
//         const token = data?.token || null
//         if (!token) throw new Error('Login succeeded but no token returned')
//         // delegate to auth provider to store token and fetch user
//         const ok = await auth.login(token)
//         if (!ok) throw new Error('Failed to retrieve user after login')
//       }
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 dark:text-white rounded shadow">
//       <h2 className="text-xl font-semibold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
//       <form onSubmit={handleAuth} className="space-y-3">
//         <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-700" />
//         <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-700" />
//         {mode === 'register' && (
//           <>
//             <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-700" />
//             <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Username" className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-700" />
//           </>
//         )}
//         <button type="submit" disabled={loading} className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded">{loading ? 'Working…' : (mode === 'login' ? 'Login' : 'Register')}</button>
//       </form>
//       <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full mt-2 text-sm text-blue-600 dark:text-blue-400">{mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}</button>
//       {error && <div className="text-red-600 mt-3">{error}</div>}
//     </div>
//   )
// }

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 dark:text-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Authentication Disabled</h2>
      <p className="mb-4">
        Authentication features are currently disabled. Please contact the
        administrator for access.
      </p>
    </div>
  );
}
