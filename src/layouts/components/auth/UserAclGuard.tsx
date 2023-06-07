// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import type { ACLObj, AppAbility } from 'src/configs/acl'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSession } from 'next-auth/react'

// ** Util Import
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props

  // ** Hooks
  const session = useSession()
  const router = useRouter()

  // ** Vars
  let ability: AppAbility

  // Uncomment this code only if you need to use roles in application and use this documentation for help : https://demos.themeselection.com/materio-mui-react-nextjs-admin-template/documentation/articles/nextauth-with-credentials-provider.html#src-pages-login-index-tsx-file
    useEffect(() => {
      if (session?.data?.user && session?.data?.user.role && !guestGuard && router.route === '/') {
        const homeRoute = getHomeRoute(session?.data?.user.role)
        router.replace(homeRoute)
      }
    }, [session?.data?.user, guestGuard, router])

    // User is logged in, build ability for the user based on his role
    if (session?.data?.user && !ability) {
      ability = buildAbilityFor(session?.data?.user.role, aclAbilities.subject)
      if (router.route === '/') {
        return <Spinner />
      }
    }

  // If guest guard or no guard is true or any error page
  if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard) {
    // If user is logged in and his ability is built
    if (session?.data?.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      // If user is not logged in (render pages like login, register etc..)
      return <>{children}</>
    }
  }

  // Check the access of current user and render pages
  if (ability && session?.data?.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    if (router.route === '/') {
      return <Spinner />
    }

    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
