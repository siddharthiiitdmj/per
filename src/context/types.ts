export type UserDataType = {
  id: string
  role: string
  email: string
  name: string
  image?: string | null
}

export type AuthValuesType = {
  logout: () => void
  login: () => void
  loading: boolean
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
}
