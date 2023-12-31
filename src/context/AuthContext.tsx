// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import { AuthValuesType, UserDataType } from './types'

import { getSession, signIn, signOut } from 'next-auth/react'

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
          if (Session == null) {
            window.localStorage.removeItem('userData')
            if (!router.pathname.includes('login')) {
              router.replace('/login')
            }
          }

          // console.log('Session -- ', Session)
          if (Session?.user.role === 'admin') {
            // console.log('Session -- inside ', Session)
            setUser({
              id: Session?.user.id,
              role: Session?.user?.role,
              name: Session?.user.name ?? 'Name not Defined',
              image: Session?.user.image,
              email: Session?.user.email ?? 'Email Not Defined'
            })
            window.localStorage.setItem('userData', JSON.stringify(Session?.user))
            if (router.pathname.includes('login') || router.pathname.includes('register')) {
              router.replace('/overview')
            }
            setLoading(false)
          }
        })
        .then(() => {
          setUser(user => {
            // console.log('user --- ', user)

            return user
          })
        })
        .catch(() => {
          setUser(null)
          window.localStorage.removeItem('userData')
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
    await signIn('google')

    // console.log('res ---> ', res)

    // .then(async res => {
    //   if (res && res.ok) {
    //     console.log('hello', res)
    //     const session = await getSession()
    //     window.localStorage.setItem('userData', JSON.stringify(session?.user) || 'present')

    //     // const returnUrl = router.query.returnUrl
    //     // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
    //     router.push('/overview')
    //     window.location.reload()
    //   }
    // })
    // .catch(err => {
    //   console.log('err - ', err)
    // })
  }

  const handleLogout = async () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    await signOut({ redirect: false }).then(() => {
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
