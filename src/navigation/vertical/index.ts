// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Overview',
      path: '/overview',
      icon: 'mdi:home-outline'
    },
    {
      title: 'Devices',
      path: '/devices',
      icon: 'ph:devices-duotone'
    },
    {
      title: 'Users',
      path: '/users',
      icon: 'ph:devices-duotone'
    },
    {
      path: '/events',
      action: 'read',
      subject: 'acl-page',
      title: 'Events',
      icon: 'mdi:events-check'
    },
    {
      title: 'Integrations',
      path: '/integrations',
      icon: 'grommet-icons:connect'
    },
    {
      title: 'Payments',
      path: '/payments',
      icon: 'fluent-mdl2:money'
    },
    {
      title: 'Configurations',
      path: '/configurations',
      icon: 'icon-park-outline:config'
    }
  ]
}

export default navigation
