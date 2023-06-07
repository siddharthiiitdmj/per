// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Types
import { AuthValuesType, UserDataType } from './types'

import { getSession, signIn, signOut, useSession } from 'next-auth/react'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  logout: () => Promise.resolve(),
  login: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setLoading(true)
      await getSession()
        .then(Session => {
          setLoading(false)
          if (Session?.user.role === 'admin') {
            setUser({
              id: 1,
              role: 'admin',
              password: 'admin',
              fullName: 'John Doe',
              username: 'johndoe',
              email: 'admin@materio.com'
            })
            window.localStorage.setItem('userData', JSON.stringify(Session?.user))
            if (router.pathname.includes('login')) {
              router.replace('/home')
            }
            setLoading(false)
          }
        })
        .catch(() => {
          setUser(null)
          setLoading(false)
          if (!router.pathname.includes('login')) {
            router.replace('/login')
          }
        })

      setLoading(false)
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async () => {
    await signIn('google').then(async res => {
      if (res && res.ok) {
        console.log(res)
        const session = await getSession()
        window.localStorage.setItem('userData', JSON.stringify(session?.user) || 'present')

        // const returnUrl = router.query.returnUrl
        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.push('/overview')
        window.location.reload()
      }
    })
    console.log('shreyash')
  }

  const handleLogout = async () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    await signOut({ redirect: false }).then(()=>{
      router.push('/login')
    })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    logout: handleLogout,
    login: handleLogin
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
