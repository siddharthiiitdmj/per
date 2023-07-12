export type EventsType = {
  id: number
  userId: number
  deviceId: number
  nodename: string
  IPaddress: string
  isVPNSpoofed: boolean
  isVirtualOS: boolean
  isEmulator: boolean
  isAppSpoofed: boolean
  isAppPatched: boolean
  isAppCloned: boolean
  Latitude: string
  Longitude: string
  Cellular_network: string
  Wifi_network: string
  createdAt: string
  updatedAt: string
  OS: string
  username: string
  email: string
  device: object
  user: object
}
