// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// ** Types
import { DeviceType } from 'src/types/apps/deviceTypes'

// ** Demo Components Imports
import { useRouter } from 'next/router'
import PreviewCard from 'src/views/apps/info/device/preview/PreviewCard'

const DeviceInfoPreview = () => {
  const router = useRouter()
  const { id } = router.query

  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | DeviceType>(null)

  useEffect(() => {
    axios
      .get('/api/devices/single', { params: { id } })
      .then(res => {
        setData(res.data)
        setError(false)
      })
      .catch(() => {
        setData(null)
        setError(true)
      })
  }, [id])

  if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={12} md={12} xs={12}>
            <PreviewCard data={data} />
          </Grid>
        </Grid>
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Device with the id: {id} does not exist. Please check the list of Devices:{' '}
            <Link href='/devices'>Device List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default DeviceInfoPreview
